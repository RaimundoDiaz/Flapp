import { Table, Typography, Card } from "antd";
import { Cart, CartProduct } from "../utils/types";

const { Title, Text } = Typography;

interface CartDetailsProps {
  cart: Cart;
}

export default function CartDetails({ cart }: CartDetailsProps) {
  const columns = [
    {
      title: "Producto",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: CartProduct) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={record.thumbnail}
            alt={text}
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
              objectFit: "cover",
            }}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Precio unitario",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price}`,
    },
    {
      title: "Descuento",
      dataIndex: "discount_percentage",
      key: "discount_percentage",
      render: (discount: number) => `${discount}%`,
    },
    {
      title: "Total",
      dataIndex: "discounted_total",
      key: "discounted_total",
      render: (total: number) => `$${total}`,
    },
  ];

  return (
    <Card>
      <Title level={3}>Detalles del carrito</Title>
      <Table
        dataSource={cart.products}
        columns={columns}
        pagination={false}
        rowKey="product_id"
      />
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <Text strong>Total de productos: {cart.total_products}</Text>
        <br />
        <Text strong>Cantidad total: {cart.total_quantity}</Text>
        <br />
        <Text strong>Total: ${cart.total}</Text>
        <br />
        <Text strong type="success">
          Total con descuento: ${cart.discounted_total}
        </Text>
      </div>
    </Card>
  );
}
