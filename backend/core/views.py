from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db.models import Q
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.exceptions import Throttled
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, ScopedRateThrottle

from .models import ServiceInquiry
from .serializers import (
    AdminInquirySerializer,
    InquiryStatusSerializer,
    ServiceInquirySerializer,
)

PAGE_SIZE = 20


class ContactInquiryThrottle(AnonRateThrottle):
    scope = "contact_inquiry"


class AdminLoginThrottle(ScopedRateThrottle):
    scope = "admin_login"


def _staff_error(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=401)
    if not request.user.is_staff:
        return Response({"detail": "Staff access required."}, status=403)
    return None


def _no_store(response):
    response["Cache-Control"] = "no-store, private"
    response["Pragma"] = "no-cache"
    return response


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    return Response({"status": "ok", "service": "SB Power API"})


@api_view(["GET"])
@permission_classes([AllowAny])
def company_overview(request):
    return Response(
        {
            "name": "SB Power",
            "sector": "Gebäudereinigung",
            "modules": [
                "Gebäudereinigung",
                "Büroreinigung",
                "Praxisreinigung",
                "Privathaushaltsreinigung",
            ],
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([ContactInquiryThrottle])
def create_inquiry(request):
    serializer = ServiceInquirySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    inquiry = serializer.save()
    return Response(
        {
            "success": True,
            "id": inquiry.id,
            "message": "Contact request created successfully.",
        },
        status=status.HTTP_201_CREATED,
    )


@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
def admin_session(request):
    user = request.user
    is_admin = user.is_authenticated and user.is_active and user.is_staff
    return _no_store(
        Response(
            {
                "authenticated": is_admin,
                "user": {"email": user.email, "name": user.get_full_name() or user.username}
                if is_admin
                else None,
                "csrfToken": get_token(request),
            }
        )
    )


@method_decorator(csrf_protect, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class AdminLoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_scope = "admin_login"
    throttle_classes = [AdminLoginThrottle]

    def throttled(self, request, wait):
        raise Throttled(wait=wait, detail="E-Mail oder Passwort ist nicht korrekt.")

    def post(self, request):
        email = str(request.data.get("email", "")).strip()
        password = str(request.data.get("password", ""))
        generic_error = {"detail": "E-Mail oder Passwort ist nicht korrekt."}
        if not email or not password:
            return Response(generic_error, status=400)

        user_model = get_user_model()
        matching_users = list(user_model.objects.filter(email__iexact=email)[:2])
        if len(matching_users) != 1:
            user_model().set_password(password)
            return Response(generic_error, status=400)
        candidate = matching_users[0]
        user = authenticate(
            request, username=candidate.get_username(), password=password
        )
        if not user or not user.is_active or not user.is_staff:
            return Response(generic_error, status=400)

        login(request, user)
        return Response(
            {
                "success": True,
                "user": {
                    "email": user.email,
                    "name": user.get_full_name() or user.username,
                },
                "csrfToken": get_token(request),
            }
        )


admin_login = AdminLoginView.as_view()


@api_view(["POST"])
def admin_logout(request):
    error = _staff_error(request)
    if error:
        return _no_store(error)
    logout(request)
    return _no_store(Response({"success": True}))


@api_view(["GET"])
def admin_inquiry_list(request):
    error = _staff_error(request)
    if error:
        return _no_store(error)

    inquiries = ServiceInquiry.objects.all()
    counts = {
        "new": inquiries.filter(status=ServiceInquiry.Status.NEW).count(),
        "contacted": inquiries.filter(status=ServiceInquiry.Status.CONTACTED).count(),
        "closed": inquiries.filter(status=ServiceInquiry.Status.CLOSED).count(),
    }
    query = request.query_params.get("q", "").strip()
    selected_status = request.query_params.get("status", "").strip()
    if query:
        inquiries = inquiries.filter(
            Q(name__icontains=query)
            | Q(phone__icontains=query)
            | Q(email__icontains=query)
        )
    if selected_status in ServiceInquiry.Status.values:
        inquiries = inquiries.filter(status=selected_status)
    total = inquiries.count()
    try:
        page = max(1, int(request.query_params.get("page", "1")))
    except ValueError:
        page = 1
    total_pages = max(1, (total + PAGE_SIZE - 1) // PAGE_SIZE)
    if page > total_pages:
        page = total_pages
    start = (page - 1) * PAGE_SIZE
    end = start + PAGE_SIZE

    return _no_store(
        Response(
            {
                "results": AdminInquirySerializer(inquiries[start:end], many=True).data,
                "counts": counts,
                "pagination": {
                    "page": page,
                    "page_size": PAGE_SIZE,
                    "total": total,
                    "total_pages": total_pages,
                    "has_next": page < total_pages,
                    "has_previous": page > 1,
                },
            }
        )
    )


@api_view(["GET", "PATCH"])
def admin_inquiry_detail(request, inquiry_id):
    error = _staff_error(request)
    if error:
        return _no_store(error)
    try:
        inquiry = ServiceInquiry.objects.get(pk=inquiry_id)
    except ServiceInquiry.DoesNotExist:
        return _no_store(Response({"detail": "Not found."}, status=404))

    if request.method == "PATCH":
        serializer = InquiryStatusSerializer(inquiry, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return _no_store(Response(AdminInquirySerializer(inquiry).data))
