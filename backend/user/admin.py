from user.models import EcommerceUser
from django.contrib import admin


@admin.register(EcommerceUser)
class EcommerceUserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "email",
        "phone",
        "address",
        "is_active",
        "is_staff",
        "is_superuser",
    )
