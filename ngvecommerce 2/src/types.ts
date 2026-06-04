export interface Product {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  image: string;
  images?: string[];
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isSale?: boolean;
  isHot?: boolean;
  category: 'bedding' | 'decor' | 'bath' | 'basics' | 'kids' | 'curtains' | 'table' | 'all';
  gender: 'all';
  inStock: boolean;
  stockQuantity?: number;
  description: string;
  specs: { [key: string]: string };
  moySkladId?: string;
  variants?: ProductVariant[];
  externalCode?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  price?: number;
  moySkladId?: string;
}

export interface Category {
  id: string;
  name: string;
  code: Product['category'];
  productsCount?: number;
}

export interface StockInfo {
  productId: string;
  variantId?: string;
  stock: number;
  reserve: number;
  name: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  deliveryMethod: 'courier' | 'pickup';
  comment?: string;
}

export interface OrderItem {
  productId: string;
  moySkladId?: string;
  variantId?: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  title: string;
}

export interface OrderData {
  customer: CustomerInfo;
  items: OrderItem[];
  promoCode?: string;
  discount?: number;
  deliveryCost: number;
  totalAmount: number;
}

export interface OrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  source?: 'moysklad' | 'fallback';
}
