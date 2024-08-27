import { useState, useEffect } from "react";
import { Layout, Typography, Form, Input, Button, message, Space } from "antd";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CartDetails from "../components/CartDetails";
import { Cart, Product } from "../utils/types";
import api from "../utils/network/api";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Checkout() {
  const [cart, setCart] = useState<Cart | null>(null);
  const navigate = useNavigate();

  // Informacion dummy para el formulario
  const dummyInfo = {
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    address: "Calle Falsa 123",
    cardNumber: "1234 5678 9012 3456",
  };

  useEffect(() => {
    const cartStorage = localStorage.getItem("cart");
    if (cartStorage) {
      setCart(JSON.parse(cartStorage));
    } else {
      message.error("No se encontró un carrito de compras");
      navigate("/");
    }
  }, [navigate]);

  const checkAvailability = () => {
    const productsInCart = cart?.products || []; // Obtengo los productos del carrito
    const productsInStore = JSON.parse(
      localStorage.getItem("products") || "[]"
    ) as Product[]; // Obtengo los productos de la tienda

    const allAvailable = productsInCart.every((cartProduct) => {
      // Busco el producto en la tienda
      const storeProduct = productsInStore.find(
        (product) => product.id === cartProduct.product_id
      );
      if (storeProduct) {
        const { stock: St, rating: r } = storeProduct;
        const realStock = St / r; // Caluclo stock real con la formula [Sr=St/r]
        return realStock >= cartProduct.quantity; // Verifico si hay suficiente stock
      }
      return false; // Si el producto no se encuentra, se considera no disponible
    });

    if (allAvailable) {
      const totalDiscountedPrice = cart
        ? Math.round((cart.total - cart.discounted_total) * 100) / 100
        : 0; // Precio que se ahorra el usuario al usar Flapp
      message.success(`Envío Flapp⚡️ - $${totalDiscountedPrice}`);
    } else {
      message.error("No hay envíos disponibles :(");
    }
  };

  const clearCart = async () => {
    if (!cart) return;

    try {
      await api.delete(`/cart/${cart.id}/`);
      localStorage.removeItem("cart");
      message.success("Carrito eliminado con éxito");
      navigate("/");
    } catch (error) {
      message.error("Error al eliminar el carrito: " + error.message);
    }
  };

  if (!cart) {
    return null;
  }

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <div style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Flapp
          </Link>
        </div>
        <Space>
          <Button
            danger
            type="primary"
            onClick={clearCart}
            style={{ marginTop: "20px" }}
          >
            Limpiar carrito
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: "50px" }}>
        <Button
          icon={<ArrowLeft />}
          style={{ marginBottom: "20px" }}
          onClick={() => navigate("/")}
        >
          Volver a la tienda
        </Button>
        <Title level={2}>Finalizar compra</Title>
        <div style={{ display: "flex", gap: "32px" }}>
          <div style={{ flex: 1 }}>
            <CartDetails cart={cart} />
          </div>
          <div style={{ flex: 1 }}>
            <Form name="checkout" layout="vertical" style={{ maxWidth: 600 }}>
              <Form.Item label="Nombre completo">
                <Input value={dummyInfo.name} disabled />
              </Form.Item>
              <Form.Item label="Correo electrónico">
                <Input value={dummyInfo.email} disabled />
              </Form.Item>
              <Form.Item label="Dirección de envío">
                <Input.TextArea value={dummyInfo.address} disabled />
              </Form.Item>
              <Form.Item label="Número de tarjeta">
                <Input value={dummyInfo.cardNumber} disabled />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={checkAvailability}>
                  Cotizar despacho
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
