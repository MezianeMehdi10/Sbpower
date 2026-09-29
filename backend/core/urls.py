from django.urls import path

from .views import (
    admin_inquiry_detail,
    admin_inquiry_list,
    admin_login,
    admin_logout,
    admin_session,
    company_overview,
    create_inquiry,
    health_check,
)

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("company/", company_overview, name="company-overview"),
    path("inquiries/", create_inquiry, name="create-inquiry"),
    path("admin/session/", admin_session, name="admin-session"),
    path("admin/login/", admin_login, name="admin-login"),
    path("admin/logout/", admin_logout, name="admin-logout"),
    path("admin/contact-requests/", admin_inquiry_list, name="admin-inquiries"),
    path(
        "admin/contact-requests/<int:inquiry_id>/",
        admin_inquiry_detail,
        name="admin-inquiry-detail",
    ),
]
