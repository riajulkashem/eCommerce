from rest_framework import serializers

from user.models import EcommerceUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcommerceUser
        fields = ["first_name", "last_name", "phone", "email", "is_staff", "is_active"]
        read_only_fields = ["is_staff", "is_active", "email"]


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
