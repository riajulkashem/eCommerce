from django.db import models

from user.models import EcommerceUser


class TimeStampedModel(models.Model):
    created_by = models.ForeignKey(EcommerceUser, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(TimeStampedModel):
    name = models.CharField(max_length=200)
    price = models.FloatField()
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')

    def __str__(self):
        return self.name


class Stock(TimeStampedModel):
    name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)
    location = models.CharField(max_length=100, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stocks')

    def __str__(self):
        return f"{self.product.name} - {self.quantity} in stock"
