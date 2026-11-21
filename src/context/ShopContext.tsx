import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, VendorConfig, MedicalCategory } from '../types';
import { MEDICAL_PRODUCTS } from '../data/products';
import { DEFAULT_VENDOR_CONFIG } from '../data/defaultConfig';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  
  requestingPackage: Product | null;
  setRequestingPackage: (pkg: Product | null) => void;
  
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  selectedCategory: MedicalCategory;
  setSelectedCategory: (cat: MedicalCategory) => void;
  
  vendorConfig: VendorConfig;
  setVendorConfig: (config: VendorConfig) => void;
  
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  
  isOrdersOpen: boolean;
  setIsOrdersOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'yesglobal_cart_v1';
const ORDERS_STORAGE_KEY = 'yesglobal_orders_v1';
const VENDOR_STORAGE_KEY = 'yesglobal_vendor_v1';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(MEDICAL_PRODUCTS);
  
  // Load Cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load Orders from localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load Vendor Configuration
  const [vendorConfig, setVendorConfigState] = useState<VendorConfig>(() => {
    try {
      const saved = localStorage.getItem(VENDOR_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_VENDOR_CONFIG;
    } catch {
      return DEFAULT_VENDOR_CONFIG;
    }
  });

  // UI Modals & Navigation state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [requestingPackage, setRequestingPackage] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MedicalCategory>('All');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const setVendorConfig = (config: VendorConfig) => {
    setVendorConfigState(config);
    try {
      localStorage.setItem(VENDOR_STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrder = (order: Order) => {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    if (activeOrder?.id === order.id) {
      setActiveOrder(order);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        requestingPackage,
        setRequestingPackage,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrder,
        setActiveOrder,
        orders,
        addOrder,
        updateOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        vendorConfig,
        setVendorConfig,
        isSettingsOpen,
        setIsSettingsOpen,
        isOrdersOpen,
        setIsOrdersOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
