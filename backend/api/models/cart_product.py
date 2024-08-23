from django.db import models


class CartProduct(models.Model):
    product_id = models.IntegerField()
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    discounted_total = models.DecimalField(max_digits=10, decimal_places=2)
    thumbnail = models.URLField()

    def __str__(self):
        return self.title
