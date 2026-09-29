from django.contrib import admin

from .models import ServiceInquiry


@admin.register(ServiceInquiry)
class ServiceInquiryAdmin(admin.ModelAdmin):
    list_display = (
        "created_at",
        "name",
        "service",
        "phone",
        "email",
        "status",
    )
    list_filter = ("status", "service", "created_at")
    search_fields = ("name", "company", "email", "phone")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)
