import React, { useState, useEffect } from "react";
import { Typography, Button, Space } from "antd";
import { Link } from "react-router-dom";
import { Home, RefreshCcw, Package } from "lucide-react";

const { Title, Text } = Typography;

export default function NotFound() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prevRotation) => (prevRotation + 5) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Package
          size={120}
          style={{
            transform: `rotate(${rotation}deg)`,
            color: "#1890ff",
          }}
        />
      </div>
      <Title level={1} style={{ marginBottom: "1rem" }}>
        ¡Oops! Página no encontrada
      </Title>
      <Text style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Parece que el producto que buscas se ha extraviado en nuestro almacén
        virtual.
      </Text>
      <Space size="large">
        <Button type="primary" icon={<Home />} size="large">
          <Link to="/" style={{ color: "inherit" }}>
            Volver al inicio
          </Link>
        </Button>
        <Button
          icon={<RefreshCcw />}
          size="large"
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </Button>
      </Space>
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
        }}
      >
        <Text type="secondary">
          Si crees que esto es un error, por favor contacta a nuestro equipo de
          soporte.
        </Text>
      </div>
    </div>
  );
}
