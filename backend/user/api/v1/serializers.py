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


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        context = self.context
        print("context: ", context)
        print(f"Keys: {context.keys()}")
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
