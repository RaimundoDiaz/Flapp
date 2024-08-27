export interface CartProduct {
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discount_percentage: number;
  discounted_total: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discounted_total: number;
  user_id: number;
  total_products: number;
  total_quantity: number;
}

export interface Product {
  id: number;
  product_id: number;
  title: string;
  description: string;
  brand: string;
  price: number;
  discount_percentage: number;
  thumbnail: string;
  stock: number;
  rating: number;
}
