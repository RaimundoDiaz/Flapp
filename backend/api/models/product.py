from django.db import models


class Product(models.Model):
    product_id = models.IntegerField(primary_key=False, unique=True)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(
        default=0, max_digits=5, decimal_places=2)
    thumbnail = models.URLField()
    stock = models.IntegerField()
    rating = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.title
