import requests
from rest_framework import viewsets, status
from rest_framework.response import Response
from api.models import Product
from api.serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_products_from_dummyjson(self):
        url = "https://dummyjson.com/products?limit=0"
        response = requests.get(url)

        if response.status_code != 200:
            return None

        return response.json().get('products', [])

    def create(self, request, *args, **kwargs):
        # Obtengo los productos de DummyJson
        products_data = self.get_products_from_dummyjson()

        if products_data is None:
            return Response({'error': 'Error al obtener productos de DummyJson'}, status=status.HTTP_400_BAD_REQUEST)

        # Creo los productos
        for product in products_data:
            Product.objects.update_or_create(
                product_id=product.get("id"),
                defaults={
                    'title': product.get("title", "No Title"),
                    'description': product.get("description", "No Description"),
                    'brand': product.get("brand", "No Brand"),
                    'price': product.get("price", 0.00),
                    'discount_percentage': product.get("discountPercentage", 0),
                    'thumbnail': product.get("thumbnail", ""),
                    'stock': product.get("stock", 0),
                    'rating': product.get("rating", 0.0),
                }
            )

        return Response({'message': 'Productos importados correctamente.'}, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Como el total de productos es 194, si hay menos, significa que me faltan productos
        if queryset.count() < 194:
            queryset.delete()  # Por lo que elimino los que hay
            # Y vuelvo a obtener los productos de la base de datos
            self.create(request)

            queryset = self.get_queryset()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
