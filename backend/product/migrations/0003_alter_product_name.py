# Generated by Django 5.1.7 on 2025-03-18 15:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("product", "0002_remove_stock_name_alter_category_created_by_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="name",
            field=models.CharField(max_length=200, unique=True),
        ),
    ]
