from django.db import models
from api.models import CartProduct


class Cart(models.Model):
    products = models.ManyToManyField(CartProduct, related_name='carts')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_total = models.DecimalField(max_digits=10, decimal_places=2)
    user_id = models.IntegerField()
    total_products = models.PositiveIntegerField()
    total_quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"Cart {self.id} for User {self.user_id}"
