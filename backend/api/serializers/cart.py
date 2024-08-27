from rest_framework import serializers
from api.models import Cart
from . import CartProductSerializer


class CartSerializer(serializers.ModelSerializer):
    products = CartProductSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = "__all__"
