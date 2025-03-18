from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import EcommerceUser
from rest_framework_simplejwt.tokens import RefreshToken


class EcommerceUserAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "phone": "1234567890",
            "address": "123 Main St",
            "password": "securepassword123",
        }
        # Create a test user for authenticated tests
        self.user = EcommerceUser.objects.create_user(**self.user_data)
        self.token = RefreshToken.for_user(self.user)
        self.access_token = str(self.token.access_token)
        self.refresh_token = str(self.token)

    def test_register_success(self):
        url = reverse("user-register")
        new_user_data = {
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane.smith@example.com",
            "phone": "0987654321",
            "address": "456 Elm St",
            "password": "anotherpass456",
        }
        response = self.client.post(url, new_user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "User created successfully")
        self.assertTrue(
            EcommerceUser.objects.filter(email="jane.smith@example.com").exists()
        )

    def test_register_duplicate_email(self):
        url = reverse("user-register")
        response = self.client.post(url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_missing_fields(self):
        url = reverse("user-register")
        incomplete_data = {"email": "test@example.com"}  # Missing password
        response = self.client.post(url, incomplete_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_login_success(self):
        url = reverse("login")
        login_data = {"email": "john.doe@example.com", "password": "securepassword123"}
        response = self.client.post(url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_invalid_credentials(self):
        url = reverse("login")
        login_data = {"email": "john.doe@example.com", "password": "wrongpassword"}
        response = self.client.post(url, login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_password_change_success(self):
        url = reverse("user-password-change")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.post(
            url,
            {"old_password": "securepassword123", "new_password": "testpassnew"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_change_invalid(self):
        url = reverse("user-password-change")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.post(url, {"old_password": "wrong pass", "new_password": "newpassss"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_profile_update_success(self):
        url = reverse("user-profile")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        update_data = {
            "first_name": "Johnny",
            "last_name": "Doe Updated",
            "phone": "1112223333",
            "address": "789 Pine St",
        }
        response = self.client.put(url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Johnny")
        # Check Data Updated to DB
        self.user.refresh_from_db()
        self.assertEqual(self.user.phone, "1112223333")

    def test_profile_update_unauthenticated(self):
        url = reverse("user-profile")
        update_data = {"first_name": "Johnny"}
        response = self.client.put(url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_token_validation_success(self):
        url = reverse("token_verify")
        response = self.client.post(url, {"token": self.access_token}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {})  # Empty dict means valid token

    def test_token_validation_invalid(self):
        url = reverse("token_verify")
        response = self.client.post(url, {"token": "invalidtoken123"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)

    def test_token_refresh_success(self):
        url = reverse("token_refresh")
        response = self.client.post(url, {"refresh": self.refresh_token, "access": self.access_token}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_token_refresh_invalid(self):
        url = reverse("token_refresh")
        response = self.client.post(url, {"refresh": "invalide refressh token", "access": self.access_token}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
