from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models


class EcommerceUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)

    def create_staffuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Staff must have is_staff=True.")
        return self._create_user(email, password, **extra_fields)


class EcommerceUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=128, blank=True, null=True)
    last_name = models.CharField(max_length=128, blank=True, null=True)
    email = models.EmailField(max_length=128, unique=True)
    phone = models.CharField(max_length=14, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = EcommerceUserManager()

    class Meta:
        verbose_name = "ecommerce user"
        verbose_name_plural = "ecommerce users"

    def get_full_name(self) -> str:
        if self.first_name and self.last_name:
            return self.first_name + " " + self.last_name
        return self.email

    def __str__(self) -> str:
        return self.get_full_name()
