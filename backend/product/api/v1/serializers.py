from rest_framework import serializers

from product.models import Product, Category, Stock


class EcommerceBaseSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True
        fields = '__all__'
        exclude = ('created_at', 'updated_at', 'created_by')

    def create(self, validated_data):
        instance = super().create(validated_data)
        user = self.context['request'].user
        instance.created_by = user
        instance.save()


class ProductSerializer(EcommerceBaseSerializer):
    class Meta:
        model = Product


class CategorySerializer(EcommerceBaseSerializer):
    class Meta:
        model = Category


class StockSerializer(EcommerceBaseSerializer):
    class Meta:
        model = Stock
