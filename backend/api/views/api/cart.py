import requests
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import CartProduct, Product

url = "https://dummyjson.com/products"


class CartCreateView(APIView):
    def post(self, request):
        cart = request.data
        requested_products: list[CartProduct] = []

        # Primero obtengo los productos solicitados y creo objetos de django para manejarlos mas facilmente
        for item in cart:
            product_id = int(item.get('productId'))
            price = item.get('price')
            quantity = item.get('quantity')
            discount = item.get('discount')

            cart_product = CartProduct(
                product_id=product_id,
                price=price,
                quantity=quantity,
                total=price * quantity,  # Calcula el total sin descuentos
                discount_percentage=discount,  # Supuse que el descuento era en unidades no en %
                # Como el descuento es en unidades simplemente restamos del precio unitario
                discounted_total=(price - discount) * quantity
            )
            requested_products.append(cart_product)

        # Obtengo los productos de DummyJson con una paginacion 10 en 10
        all_products = []
        for i in range(10):
            response = requests.get(
                url, params={"skip": (i*10), "limit": 10, "select": "id,title,stock,rating"})
            data = response.json()
            all_products.extend(data['products'])

        # Los transformo en objetos de Django para trabajar mas facil con ellos
        product_list: list[Product] = []
        for product in all_products:
            product_obj = Product(
                product_id=product["id"],
                title=product["title"],
                stock=product["stock"],
                rating=product["rating"],
            )
            product_list.append(product_obj)

        # Imprimo en consola los productos solicitados
        print("\n")
        print("Impriminedo carrito de compra:")
        failed_products: Product = []
        for cart_product in requested_products:
            product_list_ids = [
                item.product_id for item in product_list]
            if cart_product.product_id in product_list_ids:  # Si el producto solicitado es parte de la tienda
                product = [
                    product for product in product_list if product.product_id == cart_product.product_id][0]
                total_discount = cart_product.quantity * cart_product.discount_percentage
                # Se calcula el stock real Sr = [St/r]
                real_stock = round(product.stock/product.rating)
                if cart_product.quantity > real_stock:  # Si se desea comprar mas cantidad de lo que hay en stock, no se puede satisfacer la compra por lo que se agrega a la lista de productos fallidos
                    failed_products.append(product)
                # Imprimo lo solicitado en consola
                print(f'id: {cart_product.product_id} | nombre: {product.title} | precio unitario: {cart_product.price} | descuento total: {total_discount} | cantidad solicitada: {cart_product.quantity} | stock: {product.stock} | rating: {product.rating} | stock real: {real_stock}')

            else:
                # Esto solo ocurre en caso de que el id de un producto solicitado no se haya obtenido en la paginacion 10 en 10. Falla al instante ya que no hay información para trabajarlo
                print("Error, hay un producto que no existe en nuestra tienda.")
                print(
                    f"El producto con ID={cart_product.product_id} no existe en la tienda, no hay informacion para emitir una respuesta")
                return JsonResponse({"Success": False, "Message": "El carrito no pudo ser completado debido a que uno o mas productos no existen en nuestra tienda."})
        print("\n")

        # En caso de que hayan productos fallidos entonces no se puede recibir el carrito
        if len(failed_products) > 0:
            failed_text = ', '.join(
                [f'{obj.title} (id={obj.product_id})' for obj in failed_products])
            return JsonResponse({"Success": False, "Message": f'El carrito no pudo ser completado debido a falta de stock en los siguientes productos: {failed_text}'})
        else:
            return JsonResponse({"Success": True, "Message": "Carrito recibido por Flapp, gracias por su compra!"})
        return Response({"message": "Cart products created successfully."}, status=status.HTTP_200_OK)
