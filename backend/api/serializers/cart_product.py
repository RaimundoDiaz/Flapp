from rest_framework import serializers
from api.models import CartProduct


class CartProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartProduct
        fields = "__all__"
