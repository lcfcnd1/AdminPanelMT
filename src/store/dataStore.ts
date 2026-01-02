import { create } from 'zustand';
import { Product, Category, Coupon, Order, PaymentSettings } from '@/types';

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Rituales de Amor', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '2', name: 'Rituales de Prosperidad', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '3', name: 'Rituales de Protección', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '4', name: 'Rituales de Sanación', isActive: false, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
];

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Ritual de Atracción Amorosa',
    description: 'Poderoso ritual para atraer el amor verdadero a tu vida.',
    price: 49.99,
    categoryId: '1',
    powerLevel: 'Intermedio',
    isFeatured: true,
    discountPercentage: 10,
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400',
    ritualBenefits: ['Atrae amor verdadero', 'Mejora relaciones', 'Abre el corazón'],
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Ritual de Abundancia Financiera',
    description: 'Atrae la prosperidad y abundancia económica a tu vida.',
    price: 79.99,
    categoryId: '2',
    powerLevel: 'Avanzado',
    isFeatured: true,
    discountPercentage: 0,
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400',
    ritualBenefits: ['Atrae dinero', 'Abre caminos', 'Elimina bloqueos financieros'],
    isActive: true,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16',
  },
  {
    id: '3',
    title: 'Escudo de Protección Personal',
    description: 'Protección energética contra energías negativas.',
    price: 39.99,
    categoryId: '3',
    powerLevel: 'Básico',
    isFeatured: false,
    discountPercentage: 15,
    ritualBenefits: ['Protege de envidias', 'Limpia aura', 'Fortalece energía'],
    isActive: true,
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17',
  },
];

const mockCoupons: Coupon[] = [
  { id: '1', code: 'BIENVENIDO10', discountPercentage: 10, expirationDate: '2024-12-31', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '2', code: 'RITUAL20', discountPercentage: 20, expirationDate: '2024-06-30', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '3', code: 'VERANO15', discountPercentage: 15, expirationDate: '2024-03-01', isActive: false, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
];

const mockOrders: Order[] = [
  { id: 'ORD-001', date: '2024-01-20', productId: '1', productTitle: 'Ritual de Atracción Amorosa', originalPrice: 49.99, finalPrice: 44.99, status: 'completed', customerEmail: 'cliente1@email.com', createdAt: '2024-01-20' },
  { id: 'ORD-002', date: '2024-01-21', productId: '2', productTitle: 'Ritual de Abundancia Financiera', originalPrice: 79.99, finalPrice: 79.99, status: 'processing', customerEmail: 'cliente2@email.com', createdAt: '2024-01-21' },
  { id: 'ORD-003', date: '2024-01-22', productId: '3', productTitle: 'Escudo de Protección Personal', originalPrice: 39.99, finalPrice: 33.99, status: 'pending', customerEmail: 'cliente3@email.com', createdAt: '2024-01-22' },
  { id: 'ORD-004', date: '2024-01-23', productId: '1', productTitle: 'Ritual de Atracción Amorosa', originalPrice: 49.99, finalPrice: 44.99, status: 'cancelled', customerEmail: 'cliente4@email.com', createdAt: '2024-01-23' },
];

interface DataStore {
  // Products
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteProducts: (ids: string[]) => void;
  
  // Categories
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  deleteCategories: (ids: string[]) => void;
  
  // Coupons
  coupons: Coupon[];
  setCoupons: (coupons: Coupon[]) => void;
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  deleteCoupons: (ids: string[]) => void;
  
  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  
  // Payment Settings
  paymentSettings: PaymentSettings;
  setPaymentSettings: (settings: PaymentSettings) => void;

  // Bulk actions
  bulkUpdateProducts: (ids: string[], updates: Partial<Product>) => void;
  bulkUpdateCategories: (ids: string[], updates: Partial<Category>) => void;
  bulkUpdateCoupons: (ids: string[], updates: Partial<Coupon>) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  products: mockProducts,
  categories: mockCategories,
  coupons: mockCoupons,
  orders: mockOrders,
  paymentSettings: {
    mercadoPagoPublicKey: '',
    mercadoPagoAccessToken: '',
  },

  // Products
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
  })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  deleteProducts: (ids) => set((state) => ({ products: state.products.filter((p) => !ids.includes(p.id)) })),

  // Categories
  setCategories: (categories) => set({ categories }),
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)),
  })),
  deleteCategory: (id) => set((state) => ({ categories: state.categories.filter((c) => c.id !== id) })),
  deleteCategories: (ids) => set((state) => ({ categories: state.categories.filter((c) => !ids.includes(c.id)) })),

  // Coupons
  setCoupons: (coupons) => set({ coupons }),
  addCoupon: (coupon) => set((state) => ({ coupons: [...state.coupons, coupon] })),
  updateCoupon: (id, updates) => set((state) => ({
    coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)),
  })),
  deleteCoupon: (id) => set((state) => ({ coupons: state.coupons.filter((c) => c.id !== id) })),
  deleteCoupons: (ids) => set((state) => ({ coupons: state.coupons.filter((c) => !ids.includes(c.id)) })),

  // Orders
  setOrders: (orders) => set({ orders }),
  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
  })),

  // Payment Settings
  setPaymentSettings: (settings) => set({ paymentSettings: settings }),

  // Bulk actions
  bulkUpdateProducts: (ids, updates) => set((state) => ({
    products: state.products.map((p) => 
      ids.includes(p.id) ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ),
  })),
  bulkUpdateCategories: (ids, updates) => set((state) => ({
    categories: state.categories.map((c) => 
      ids.includes(c.id) ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ),
  })),
  bulkUpdateCoupons: (ids, updates) => set((state) => ({
    coupons: state.coupons.map((c) => 
      ids.includes(c.id) ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ),
  })),
}));
