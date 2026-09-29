from rest_framework import serializers

from .models import ServiceInquiry


ALLOWED_SERVICES = {
    "building",
    "office",
    "practice",
    "retail",
    "stairs",
    "sanitary",
    "private-household",
    "entrance",
    "maintenance",
    "other",
}


class ServiceInquirySerializer(serializers.ModelSerializer):
    privacy_accepted = serializers.BooleanField(required=True)
    website = serializers.CharField(
        allow_blank=True, max_length=200, required=False, write_only=True
    )

    class Meta:
        model = ServiceInquiry
        fields = [
            "id",
            "name",
            "phone",
            "email",
            "service",
            "message",
            "privacy_accepted",
            "language",
            "created_at",
            "website",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "name": {"trim_whitespace": True, "min_length": 2, "max_length": 160},
            "phone": {"allow_blank": True, "required": False, "max_length": 80},
            "email": {"allow_blank": True, "required": False},
            "message": {"allow_blank": True, "required": False, "max_length": 3000},
        }

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Submission rejected.")
        return value

    def validate_privacy_accepted(self, value):
        if value is not True:
            raise serializers.ValidationError("Privacy consent is required.")
        return value

    def validate_language(self, value):
        if value not in {"de", "en", "fr", "ru", "ar"}:
            raise serializers.ValidationError("Unsupported language.")
        return value

    def validate_service(self, value):
        if value not in ALLOWED_SERVICES:
            raise serializers.ValidationError("Unsupported service.")
        return value

    def validate(self, attrs):
        if not attrs.get("phone", "").strip() and not attrs.get("email", "").strip():
            raise serializers.ValidationError(
                {"contact": "A phone number or email address is required."}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("website", None)
        validated_data["status"] = ServiceInquiry.Status.NEW
        return super().create(validated_data)


class AdminInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceInquiry
        fields = [
            "id",
            "name",
            "phone",
            "email",
            "service",
            "message",
            "status",
            "language",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class InquiryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceInquiry
        fields = ["status"]

    def validate_status(self, value):
        if value not in ServiceInquiry.Status.values:
            raise serializers.ValidationError("Unsupported status.")
        return value
