import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, CreditCard } from "lucide-react";
import styles from "../styles/Home.module.css";
import api from "../utils/network/api";
import { Button, Row, Col, Layout, Space, Skeleton } from "antd";
import { Product, Cart } from "../utils/types";
import ProductCard from "../components/ProductCard";

const Home: React.FC = () => {
  const { Header } = Layout;
  const [cartExists, setCartExists] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
    checkCartExistsInLocalStorage();
  }, []);

  const getProducts = () => {
    const productsStorage = localStorage.getItem("products");

    if (productsStorage) {
      // Primero busco los productos en localStorage
      const products = JSON.parse(productsStorage);
      setProducts(products);
      console.log("Productos obtenidos de localStorage:", products);
      setLoading(false);
    } else {
      // Si no están, se hace la llamada a la API
      api
        .get("/product/")
        .then((res) => res.data)
        .then((data) => {
          setProducts(data);
          console.log("Productos obtenidos de la API:", data);
          setLoading(false);
          // Guardo los productos en localStorage
          localStorage.setItem("products", JSON.stringify(data));
        })
        .catch((err) => alert(err));
    }
  };

  const getCartFromLocalStorage = (): Cart | null => {
    const cartStorage = localStorage.getItem("cart");

    if (cartStorage) {
      try {
        const cart: Cart = JSON.parse(cartStorage);
        console.log("Carrito obtenido de localStorage:", cart);
        return cart;
      } catch (error) {
        console.error("Error al parsear el carrito desde localStorage:", error);
        return null;
      }
    }

    return null;
  };

  const getRandomCart = () => {
    const cart = getCartFromLocalStorage();

    if (cart) {
      // Primero busco el carrito en localStorage
      setCart(cart);
      console.log("Carrito obtenido de localStorage:", cart);
      setCartExists(true);
    } else {
      // Si no está, se hace la llamada a la API
      api
        .get("/cart/")
        .then((res) => res.data)
        .then((data: Cart) => {
          setCart(data);
          console.log("Carrito obtenido de la API:", data);
          setCartExists(true);
          // Guardo el carrito en localStorage
          localStorage.setItem("cart", JSON.stringify(data));
        })
        .catch((err) => alert(err));
    }
  };

  const checkCartExistsInLocalStorage = () => {
    const cart = getCartFromLocalStorage();
    if (cart) {
      setCartExists(true);
      setCart(cart);
    } else {
      setCartExists(false);
    }
  };

  return (
    <div>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        <div
          className="logo"
          style={{ color: "white", fontSize: "24px", fontWeight: "bold" }}
        >
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Flapp
          </Link>
        </div>
        <Space>
          <Button
            type="primary"
            onClick={getRandomCart}
            icon={<ShoppingCart />}
          >
            Generar carrito
          </Button>
          <Button
            type="default"
            href="/checkout"
            disabled={!cartExists}
            icon={<CreditCard />}
            style={{ backgroundColor: "#777777", color: "white" }}
          >
            Finalizar compra
          </Button>
        </Space>
      </Header>

      <main className={styles.main}>
        {loading ? (
          <Row gutter={[50, 50]} style={{ padding: "10px" }}>
            {Array.from({ length: 20 }).map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Skeleton active />
              </Col>
            ))}
          </Row>
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; Flapp. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
