import json

from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework.reverse import reverse_lazy
from rest_framework_simplejwt.tokens import RefreshToken

from product.models import Product, Category, Stock
from user.models import EcommerceUser


class ProductViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff_user = EcommerceUser.objects.create_user(
            email="staff@mail.com", password="password", is_staff=True
        )
        self.regular_user = EcommerceUser.objects.create_user(
            email="regular@mail.com", password="password", is_staff=False
        )
        self.category = Category.objects.create(
            name="Test Category", created_by_id=self.staff_user.id
        )
        self.product_data = {
            "name": "Test Product",
            "description": "Test Description",
            "price": 100,
            "category": self.category,
            "created_by_id": self.staff_user.id,
        }

        self.product = Product.objects.create(**self.product_data)

        # Create a test user for authenticated tests
        self.token = RefreshToken.for_user(self.staff_user)
        self.access_token = str(self.token.access_token)

    def test_product_list(self):
        data = self.product_data.copy()
        for i in range(5):
            data["name"] = f"Product {i}"
            Product.objects.create(**data)
        response = self.client.get(reverse_lazy("product-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()), Product.objects.count())

    def test_product_create_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        data = self.product_data.copy()
        data["name"] = "New Product"
        data["category"] = self.category.id
        response = self.client.post(reverse_lazy("product-list"), data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_product_update_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        data = {
            "name": "Updated Product",
            "price": 100,
            "category": self.category.id,
        }
        response = self.client.put(
            reverse_lazy("product-detail", kwargs={"pk": self.product.id}),
            data=json.dumps(data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, data["name"])

    def test_product_delete_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.delete(
            reverse_lazy("product-detail", kwargs={"pk": self.product.id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_product_create_as_regular_user(self):
        token = RefreshToken.for_user(self.regular_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token.access_token)}")
        self.product_data["category"] = self.category.id
        response = self.client.post(reverse_lazy("product-list"), self.product_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_product_create_unauthenticated(self):
        response = self.client.post(reverse_lazy("product-list"), self.product_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CategoryViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff_user = EcommerceUser.objects.create_user(
            email="staff@mail.com", password="password", is_staff=True
        )
        self.category = Category.objects.create(name="Test Category")

        # Create a test user for authenticated tests
        self.token = RefreshToken.for_user(self.staff_user)
        self.access_token = str(self.token.access_token)

    def test_category_list(self):
        response = self.client.get(reverse_lazy("category-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_category_create_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.post(
            reverse_lazy("category-list"), {"name": "New Category"}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()["name"], "New Category")

    def test_category_update_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.put(
            reverse_lazy("category-detail", kwargs={"pk": self.category.id}),
            data=json.dumps({"name": "Updated Category"}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["name"], "Updated Category")

    def test_category_delete_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.delete(
            reverse_lazy("category-detail", kwargs={"pk": self.category.id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_category_delete_as_regular_user(self):
        regular_user = EcommerceUser.objects.create_user(
            email="regular@mail.com", password="password"
        )
        token = RefreshToken.for_user(regular_user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token.access_token)}")
        response = self.client.delete(
            reverse_lazy("category-detail", kwargs={"pk": self.category.id})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class StockViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.staff_user = EcommerceUser.objects.create_user(
            email="staff@mail.com", password="password", is_staff=True
        )
        self.regular = EcommerceUser.objects.create_user(
            email="regular@mail.com", password="password", is_staff=True
        )
        category = Category.objects.create(name="Test Category")
        self.product = Product.objects.create(
            name="Test Product",
            price=100,
            category=category,
        )
        self.stock = Stock.objects.create(
            location="Test Location", quantity=10, product=self.product
        )

        # Create a test user for authenticated tests
        self.token = RefreshToken.for_user(self.staff_user)
        self.access_token = str(self.token.access_token)

    def test_stock_list(self):
        response = self.client.get(reverse_lazy("stock-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_stock_create_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        category = Category.objects.create(name="New Category")
        product = Product.objects.create(
            name="New Product",
            price=100,
            category=category,
        )
        response = self.client.post(
            reverse_lazy("stock-list"),
            data=json.dumps({"location": "New Location", "product": product.id}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_stock_update_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.put(
            reverse_lazy("stock-detail", kwargs={"pk": self.stock.id}),
            data=json.dumps({"quantity": 100, "product": self.stock.product_id}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.stock.refresh_from_db()
        self.assertTrue(response.json()["quantity"] == self.stock.quantity == 100)

    def test_stock_delete_as_staff(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        response = self.client.delete(
            reverse_lazy("stock-detail", kwargs={"pk": self.stock.id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
