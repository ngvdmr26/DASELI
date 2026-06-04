import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Product, CartItem, OrderData, OrderResult } from "../types";
import { useProducts } from "../hooks/useProducts";
import { api } from "../services/api";

interface FiltersState {
  gender: "all";
  category: "bedding" | "decor" | "bath" | "basics" | "kids" | "curtains" | "table" | "all";
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  isSale?: boolean;
  sort: "popular" | "priceAsc" | "priceDesc";
}

interface AppContextType {
  cart: CartItem[];
  favorites: string[];
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileFiltersOpen: boolean;
  selectedProduct: Product | null;
  filters: FiltersState;
  activeTab: string; // 'home' | 'catalog' | 'favorites' | 'cart'
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileFiltersOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  setActiveTab: (tab: string) => void;

  // Custom helpers
  addToCart: (
    product: Product,
    size: string,
    color: string,
    quantity?: number,
  ) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => void;
  toggleFavorite: (productId: string) => void;
  clearFilters: () => void;
  filteredProducts: Product[];
  triggerCartBounce: boolean;
  cartNotice: CartItem | null;
  products: Product[];
  productsLoading: boolean;
  createOrder: (data: OrderData) => Promise<OrderResult>;
}

const defaultFilters: FiltersState = {
  gender: "all",
  category: "all",
  sizes: [],
  colors: [],
  priceRange: [1800, 24900],
  inStockOnly: false,
  isSale: false,
  sort: "popular",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { products, isLoading: productsLoading } = useProducts();
  // Load initial cart and favorites from LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const cached = localStorage.getItem("fa_cart");
    return cached ? JSON.parse(cached) : [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const cached = localStorage.getItem("fa_favorites");
    return cached ? JSON.parse(cached) : [];
  });

  const [isCartOpenState, setCartOpenState] = useState(false);
  const [isSearchOpenState, setSearchOpenState] = useState(false);
  const [isMobileFiltersOpenState, setMobileFiltersOpenState] = useState(false);
  const [selectedProductState, setSelectedProductState] =
    useState<Product | null>(null);

  const setCartOpen = (open: boolean) => {
    setCartOpenState(open);
    if (open) {
      setSearchOpenState(false);
      setMobileFiltersOpenState(false);
      setSelectedProductState(null);
    }
  };
  const setSearchOpen = (open: boolean) => {
    setSearchOpenState(open);
    if (open) {
      setCartOpenState(false);
      setMobileFiltersOpenState(false);
      setSelectedProductState(null);
    }
  };
  const setMobileFiltersOpen = (open: boolean) => {
    setMobileFiltersOpenState(open);
    if (open) {
      setCartOpenState(false);
      setSearchOpenState(false);
      setSelectedProductState(null);
    }
  };
  const setSelectedProduct = (product: Product | null) => {
    setSelectedProductState(product);
    if (product) {
      setCartOpenState(false);
      setSearchOpenState(false);
      setMobileFiltersOpenState(false);
    }
  };

  const isCartOpen = isCartOpenState;
  const isSearchOpen = isSearchOpenState;
  const isMobileFiltersOpen = isMobileFiltersOpenState;
  const selectedProduct = selectedProductState;
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'catalog' | 'favorites' | 'cart'
  const [searchQuery, setSearchQuery] = useState("");
  const [triggerCartBounce, setTriggerCartBounce] = useState(false);
  const [cartNotice, setCartNotice] = useState<CartItem | null>(null);
  const cartNoticeTimer = useRef<number | null>(null);

  // Lock body scroll when overlays are open
  useEffect(() => {
    if (isCartOpen || isSearchOpen || isMobileFiltersOpen || selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen, isSearchOpen, isMobileFiltersOpen, selectedProduct]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("fa_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("fa_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (
    product: Product,
    size: string,
    color: string,
    quantity = 1,
  ) => {
    const noticeItem = { product, quantity, selectedSize: size, selectedColor: color };

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color,
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prevCart,
        { product, quantity, selectedSize: size, selectedColor: color },
      ];
    });

    // Trigger bounce animation
    setTriggerCartBounce(true);
    setCartNotice(noticeItem);
    setTimeout(() => setTriggerCartBounce(false), 600);
    if (cartNoticeTimer.current) {
      window.clearTimeout(cartNoticeTimer.current);
    }
    cartNoticeTimer.current = window.setTimeout(() => setCartNotice(null), 2600);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          ),
      ),
    );
  };

  const updateCartQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  // Advanced filtration logic
  const createOrder = async (data: OrderData): Promise<OrderResult> => {
    const response = await api.createOrder(data);
    if (response.data) return response.data;
    return { success: false, error: response.error || "Не удалось оформить заказ" };
  };

  const filteredProducts = products
    .filter((product) => {
      // 1. Category Filter
      if (filters.category !== "all") {
        if (product.category !== filters.category) {
          return false;
        }
      }

      // 2. Sale Filter
      if (filters.isSale) {
        if (!product.isSale) {
          return false;
        }
      }

      // 3. Size Filter
      if (filters.sizes.length > 0) {
        // Must contain at least one of the selected sizes
        const hasSize = product.sizes.some((s) => filters.sizes.includes(s));
        if (!hasSize) return false;
      }

      // 4. Color Filter
      if (filters.colors.length > 0) {
        // Must contain at least one of the selected colors
        const hasColor = product.colors.some((c) => filters.colors.includes(c));
        if (!hasColor) return false;
      }

      // 5. Price Filter
      const activePrice = product.salePrice ?? product.price;
      if (
        activePrice < filters.priceRange[0] ||
        activePrice > filters.priceRange[1]
      ) {
        return false;
      }

      // 6. Stock Check
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      // 7. Search query check
      if (searchQuery.trim() !== "") {
        const matchQuery = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(matchQuery);
        const matchDesc = product.description
          .toLowerCase()
          .includes(matchQuery);
        const matchSpecs = Object.values(product.specs).some((val) =>
          String(val).toLowerCase().includes(matchQuery),
        );
        if (!matchTitle && !matchDesc && !matchSpecs) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const aPrice = a.salePrice ?? a.price;
      const bPrice = b.salePrice ?? b.price;
      if (filters.sort === "priceAsc") {
        return aPrice - bPrice;
      }
      if (filters.sort === "priceDesc") {
        return bPrice - aPrice;
      }
      return 0; // Default sorting (popular = original order)
    });

  return (
    <AppContext.Provider
      value={{
        cart,
        favorites,
        isCartOpen,
        isSearchOpen,
        isMobileFiltersOpen,
        selectedProduct,
        filters,
        activeTab,
        searchQuery,
        setSearchQuery,
        setCartOpen,
        setSearchOpen,
        setMobileFiltersOpen,
        setSelectedProduct,
        setFilters,
        setActiveTab,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleFavorite,
        clearFilters,
        filteredProducts,
        triggerCartBounce,
        cartNotice,
        products,
        productsLoading,
        createOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
