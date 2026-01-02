export type PowerLevel = 'Básico' | 'Intermedio' | 'Avanzado';

export interface Category {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  powerLevel: PowerLevel;
  isFeatured: boolean;
  discountPercentage: number;
  imageUrl?: string;
  ritualBenefits: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  productId: string;
  productTitle: string;
  originalPrice: number;
  finalPrice: number;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  extraInfo: string;
  couponCode: string | null;
  createdAt: string;
}

export interface PaymentSettings {
  mercadoPagoPublicKey: string;
  mercadoPagoAccessToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
