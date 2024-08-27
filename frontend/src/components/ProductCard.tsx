import React from "react";
import { Card, Typography, Rate, Tag } from "antd";
import { Product } from "../utils/types";

const { Meta } = Card;
const { Text } = Typography;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountedPrice =
    product.price * (1 - product.discount_percentage / 100);

  return (
    <Card
      hoverable
      style={{ width: 240, margin: "16px" }}
      cover={
        <img
          alt={product.title}
          src={product.thumbnail}
          style={{ height: 200, objectFit: "cover" }}
        />
      }
    >
      <Meta
        title={product.title}
        description={
          <>
            <Text type="secondary">{product.brand}</Text>
            <br />
            <Rate allowHalf defaultValue={product.rating} disabled />
            <br />
            <Text strong>${discountedPrice.toFixed(2)}</Text>
            {product.discount_percentage !== 0 && (
              <Text delete type="secondary" style={{ marginLeft: 8 }}>
                ${product.price}
              </Text>
            )}
            <br />
            <Tag color={product.stock > 0 ? "green" : "red"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </Tag>
          </>
        }
      />
    </Card>
  );
};

export default ProductCard;
