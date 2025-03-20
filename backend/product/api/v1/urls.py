from django.urls import include
from rest_framework.routers import DefaultRouter
from rest_framework.urls import path

from product.api.v1.views import ProductViewSet, CategoryViewSet, StockViewSet

router = DefaultRouter()
router.register(
    r"product", ProductViewSet, basename="product"
)  # endpoints [product-list, product-detail]
router.register(
    r"category", CategoryViewSet, basename="category"
)  # endpoints [category-list, category-detail]
router.register(
    r"stock", StockViewSet, basename="stock"
)  # endpoints [stock-list, stock-detail]

urlpatterns = [
    path("products/", include(router.urls)),
]
