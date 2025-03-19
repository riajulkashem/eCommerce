from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user.models import EcommerceUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcommerceUser
        fields = ["first_name", "last_name", "phone", "email", "is_staff"]
        read_only_fields = ["is_staff", "email"]


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcommerceUser
        fields = ["first_name", "last_name", "email", "password"]
        read_only_fields = ["is_staff", "is_active"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data: dict) -> EcommerceUser:
        email = validated_data["email"]
        password = validated_data["password"]
        first_name = validated_data["first_name"]
        last_name = validated_data["last_name"]
        user = EcommerceUser.objects.create_user(
            email=email, password=password, first_name=first_name, last_name=last_name
        )
        return user


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # Call the parent validate method to authenticate and get tokens
        data = super().validate(attrs)
        # Get the authenticated user
        user = self.user
        data['user'] = {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "is_staff": user.is_staff,
        }
        return data