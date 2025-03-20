from django.db import models
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from user.models import EcommerceUser


class TimeStampedModel(models.Model):
    created_by = models.ForeignKey(
        EcommerceUser, on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(TimeStampedModel):
    name = models.CharField(max_length=200, unique=True)
    price = models.FloatField()
    image = models.ImageField(upload_to="products/", null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )

    def __str__(self):
        return self.name


class Stock(TimeStampedModel):
    quantity = models.PositiveIntegerField(default=0)
    location = models.CharField(max_length=100, null=True, blank=True)
    product = models.OneToOneField(
        Product, on_delete=models.CASCADE, related_name="stock"
    )

    def __str__(self):
        return f"{self.product.name} - {self.quantity} in stock"


# Create Stock Automatically On Create New Products
@receiver(post_save, sender=Product)
def create_stock(sender, instance, created, **kwargs):
    if created:
        Stock.objects.create(product=instance)

# Prevent deletion product if stock available
@receiver(pre_delete, sender=Product)
def delete_stock(sender, instance, created, **kwargs):
    if instance.stock.quantity > 0:
        raise Exception("The product has stock available")
    instance.stock.delete()

