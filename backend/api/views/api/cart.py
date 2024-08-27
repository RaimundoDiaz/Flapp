import random
import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models import Cart, CartProduct
from api.serializers import CartSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

    def get_random_cart_data(self):
        # Seleccionar un carrito al azar (viendo la documentacion me fije que son 50 carritos en total)
        random_cart_id = random.randint(1, 50)
        response = requests.get(
            f'https://dummyjson.com/carts/{random_cart_id}')

        if response.status_code != 200:
            return None

        return response.json()

    def create(self, request, *args, **kwargs):
        # Obtengo los datos de un carrito aleatorio
        cart_data = self.get_random_cart_data()

        if not cart_data:
            return Response({'error': 'Error al obtener datos de la API de DummyJson'}, status=status.HTTP_400_BAD_REQUEST)

        # Creo los productos del carrito
        cart_products = []
        for product in cart_data['products']:
            cart_product, created = CartProduct.objects.get_or_create(
                product_id=product['id'],
                defaults={
                    'title': product['title'],
                    'price': product['price'],
                    'quantity': product['quantity'],
                    'total': product['total'],
                    'discount_percentage': product['discountPercentage'],
                    'discounted_total': product['discountedTotal'],
                    'thumbnail': product['thumbnail']
                }
            )
            cart_products.append(cart_product)

        # Creo el carrito
        cart = Cart.objects.create(
            total=cart_data['total'],
            discounted_total=cart_data['discountedTotal'],
            user_id=cart_data['userId'],
            total_products=cart_data['totalProducts'],
            total_quantity=cart_data['totalQuantity'],
        )
        cart.products.set(cart_products)
        cart.save()

        serializer = self.get_serializer(cart)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        cart = self.get_object()
        cart.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        # Si no se ha creado un carrito entonces hago uno
        if queryset.count() == 0:
            self.create(request)
            queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data[0], status=status.HTTP_200_OK)
