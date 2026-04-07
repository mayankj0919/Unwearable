export interface Product {
  id: string;
  slug: string;
  sku: string;
  store_skus?: Record<string, string>;
  name: string;
  tagline: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColorId: string;
}