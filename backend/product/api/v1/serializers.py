from rest_framework import serializers

from product.models import Product, Category, Stock


class EcommerceBaseSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True

    def create(self, validated_data):
        instance = super().create(validated_data)
        user = self.context["request"].user
        instance.created_by = user
        instance.save()
        return instance


class ProductSerializer(EcommerceBaseSerializer):
    class Meta:
        model = Product
        fields = ["name", "price", "image", "description", "category"]


class CategorySerializer(EcommerceBaseSerializer):
    class Meta:
        model = Category
        fields = ["name"]


class StockSerializer(EcommerceBaseSerializer):
    class Meta:
        model = Stock
        fields = ["quantity", "location", "product"]
