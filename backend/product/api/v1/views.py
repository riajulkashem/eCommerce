from rest_framework import viewsets, status
from rest_framework.response import Response

from product.api.v1.permissions import IsEcommerceStaffOrReadOnly
from product.api.v1.serializers import (
    ProductSerializer,
    CategorySerializer,
    StockSerializer,
)
from product.models import Product, Category, Stock


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsEcommerceStaffOrReadOnly]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsEcommerceStaffOrReadOnly]


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsEcommerceStaffOrReadOnly]

    def create(self, request, *args, **kwargs):
        response = {'message': 'Create function is not offered in this path.'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)
