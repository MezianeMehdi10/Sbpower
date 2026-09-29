from django.db import models


class ServiceInquiry(models.Model):
    class CustomerType(models.TextChoices):
        PRIVATE = "private", "Privatkunde"
        BUSINESS = "business", "Unternehmen / Gewerbe"

    class Status(models.TextChoices):
        NEW = "new", "Neu"
        CONTACTED = "contacted", "Kontaktiert"
        CLOSED = "closed", "Abgeschlossen"

    name = models.CharField(max_length=160)
    company = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=80, blank=True)
    customer_type = models.CharField(
        max_length=20, choices=CustomerType.choices, blank=True, default=""
    )
    service = models.CharField(max_length=100)
    frequency = models.CharField(max_length=40, blank=True)
    address = models.CharField(max_length=255, blank=True)
    area = models.CharField(max_length=80, blank=True)
    preferred_date = models.DateField(blank=True, null=True)
    object_details = models.TextField(max_length=1500, blank=True)
    message = models.TextField(max_length=5000, blank=True)
    privacy_accepted = models.BooleanField(default=False)
    language = models.CharField(max_length=5, default="de")
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.NEW
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.service}"
