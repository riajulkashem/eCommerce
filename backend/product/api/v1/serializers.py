from rest_framework import serializers

from product.models import Product, Category, Stock


class EcommerceBaseSerializer(serializers.ModelSerializer):
    class Meta:
        abstract = True

    def create(self, validated_data):
        """Add requested user as creator to the object"""
        instance = super().create(validated_data)
        user = self.context["request"].user
        instance.created_by = user
        instance.save()
        return instance


class ProductSerializer(EcommerceBaseSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    image = serializers.ImageField(
        max_length=None, use_url=True, allow_null=True, required=False
    )

    class Meta:
        model = Product
        fields = ["id", "name", "price", "image", "description", "category"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["category_name"] = (
            instance.category.name if instance.category else None
        )
        representation["stock"] = instance.stock.quantity if instance.stock else 0
        return representation


class CategorySerializer(EcommerceBaseSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class StockSerializer(EcommerceBaseSerializer):
    class Meta:
        model = Stock
        fields = ["id", "quantity", "location"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["product"] = instance.product.name if instance.product else None
        return representation
