from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase
from rest_framework.test import APIClient

from .models import ServiceInquiry


class PublicInquiryApiTests(TestCase):
    def setUp(self):
        cache.clear()
        self.client = APIClient()
        self.payload = {
            "name": "Erika Muster",
            "phone": "+49 421 123456",
            "email": "",
            "service": "private-household",
            "message": "Bitte rufen Sie mich zurück.",
            "privacy_accepted": True,
            "language": "de",
            "website": "",
        }

    def test_creates_phone_only_contact_request(self):
        response = self.client.post("/api/inquiries/", self.payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json()["success"])
        inquiry = ServiceInquiry.objects.get()
        self.assertEqual(inquiry.status, ServiceInquiry.Status.NEW)
        self.assertEqual(inquiry.email, "")

    def test_creates_email_only_contact_request(self):
        self.payload["phone"] = ""
        self.payload["email"] = "erika@example.com"
        response = self.client.post("/api/inquiries/", self.payload, format="json")
        self.assertEqual(response.status_code, 201)

    def test_rejects_missing_name(self):
        self.payload.pop("name")
        response = self.client.post("/api/inquiries/", self.payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("name", response.json())

    def test_rejects_missing_service(self):
        self.payload.pop("service")
        response = self.client.post("/api/inquiries/", self.payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("service", response.json())

    def test_rejects_missing_phone_and_email(self):
        self.payload["phone"] = ""
        self.payload["email"] = ""
        response = self.client.post("/api/inquiries/", self.payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("contact", response.json())

    def test_rejects_invalid_email(self):
        self.payload["phone"] = ""
        self.payload["email"] = "not-an-email"
        response = self.client.post("/api/inquiries/", self.payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("email", response.json())

    def test_rejects_missing_privacy_consent(self):
        self.payload.pop("privacy_accepted")
        response = self.client.post("/api/inquiries/", self.payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("privacy_accepted", response.json())

    def test_rejects_filled_honeypot(self):
        self.payload["website"] = "https://spam.example"
        response = self.client.post("/api/inquiries/", self.payload, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ServiceInquiry.objects.count(), 0)

    def test_contact_endpoint_is_throttled(self):
        self.payload.pop("name")
        response = None
        for index in range(11):
            response = self.client.post(
                "/api/inquiries/",
                {**self.payload, "email": f"throttle-{index}@example.com"},
                format="json",
            )
        self.assertEqual(response.status_code, 429)


class AdminApiTests(TestCase):
    def setUp(self):
        cache.clear()
        user_model = get_user_model()
        self.staff = user_model.objects.create_user(
            username="admin",
            email="admin@sb-power.test",
            password="Strong-test-password-42",
            is_staff=True,
        )
        self.regular_user = user_model.objects.create_user(
            username="customer",
            email="customer@example.com",
            password="Strong-test-password-42",
        )
        self.inquiry = ServiceInquiry.objects.create(
            name="Max Mustermann",
            phone="+49 421 123456",
            service="office",
            privacy_accepted=True,
        )
        self.client = APIClient()

    def test_login_with_email_and_logout(self):
        session_response = self.client.get("/api/admin/session/")
        csrf_token = session_response.json()["csrfToken"]
        response = self.client.post(
            "/api/admin/login/",
            {"email": "ADMIN@SB-POWER.TEST", "password": "Strong-test-password-42"},
            format="json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertTrue(self.client.session.get("_auth_user_id"))

        response = self.client.post(
            "/api/admin/logout/",
            {},
            format="json",
            HTTP_X_CSRFTOKEN=response.json()["csrfToken"],
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.client.session.get("_auth_user_id"))

    def test_login_failure_is_generic(self):
        csrf_token = self.client.get("/api/admin/session/").json()["csrfToken"]
        response = self.client.post(
            "/api/admin/login/",
            {"email": "missing@example.com", "password": "wrong"},
            format="json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()["detail"], "E-Mail oder Passwort ist nicht korrekt.")

    def test_login_requires_valid_csrf_token(self):
        csrf_client = APIClient(enforce_csrf_checks=True)
        credentials = {
            "email": "admin@sb-power.test",
            "password": "Strong-test-password-42",
        }
        response = csrf_client.post("/api/admin/login/", credentials, format="json")
        self.assertEqual(response.status_code, 403)

        csrf_token = csrf_client.get("/api/admin/session/").json()["csrfToken"]
        response = csrf_client.post(
            "/api/admin/login/",
            credentials,
            format="json",
            HTTP_X_CSRFTOKEN=csrf_token,
        )
        self.assertEqual(response.status_code, 200)

    def test_unauthenticated_admin_list_returns_401(self):
        response = self.client.get("/api/admin/contact-requests/")
        self.assertEqual(response.status_code, 401)

    def test_non_staff_admin_list_returns_403(self):
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get("/api/admin/contact-requests/")
        self.assertEqual(response.status_code, 403)

    def test_staff_can_list_search_and_filter_requests(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.get("/api/admin/contact-requests/?q=Max&status=new")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["results"]), 1)
        self.assertEqual(response.json()["counts"]["new"], 1)
        self.assertEqual(response["Cache-Control"], "no-store, private")

    def test_staff_list_is_paginated(self):
        ServiceInquiry.objects.bulk_create(
            [
                ServiceInquiry(
                    name=f"Pagination {index}",
                    phone="+49 421 123456",
                    service="office",
                    privacy_accepted=True,
                )
                for index in range(25)
            ]
        )
        self.client.force_authenticate(user=self.staff)
        response = self.client.get("/api/admin/contact-requests/?q=Pagination")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["results"]), 20)
        self.assertEqual(data["pagination"]["total"], 25)
        self.assertTrue(data["pagination"]["has_next"])

        response = self.client.get("/api/admin/contact-requests/?q=Pagination&page=2")
        data = response.json()
        self.assertEqual(len(data["results"]), 5)
        self.assertTrue(data["pagination"]["has_previous"])

    def test_staff_can_read_detail_and_patch_status(self):
        self.client.force_authenticate(user=self.staff)
        detail_url = f"/api/admin/contact-requests/{self.inquiry.id}/"
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["name"], "Max Mustermann")
        self.assertEqual(response["Cache-Control"], "no-store, private")

        response = self.client.patch(
            detail_url, {"status": "contacted"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.inquiry.refresh_from_db()
        self.assertEqual(self.inquiry.status, ServiceInquiry.Status.CONTACTED)

    def test_admin_login_is_throttled(self):
        csrf_token = self.client.get("/api/admin/session/").json()["csrfToken"]
        response = None
        for index in range(6):
            response = self.client.post(
                "/api/admin/login/",
                {"email": "missing@example.com", "password": f"wrong-{index}"},
                format="json",
                HTTP_X_CSRFTOKEN=csrf_token,
            )
        self.assertEqual(response.status_code, 429)
