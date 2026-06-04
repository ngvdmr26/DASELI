import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { SidebarFilters } from "./components/SidebarFilters";
import { ProductGrid } from "./components/ProductGrid";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer } from "./components/CartDrawer";
import { SearchOverlay } from "./components/SearchOverlay";
import { CategoriesView } from "./components/CategoriesView";
import { ProfileView } from "./components/ProfileView";
import { InstallHint } from "./components/InstallHint";
import { CartAddedToast } from "./components/CartAddedToast";
import {
  Heart,
  ShoppingBag,
} from "lucide-react";

const InnerApp = () => {
  const {
    activeTab,
    setActiveTab,
    favorites,
    clearFilters,
    setSelectedProduct,
    products,
  } = useApp();

  // Favorite items matching
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F6F4F0] pb-28 lg:pb-4 text-[#1A1A1A] font-sans selection:bg-accent selection:text-white relative">
      <Header />

      <main className="max-w-[1440px] mx-auto px-4 lg:px-10 pt-4 lg:pt-8">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === "home" && (
          <div>
            <HeroSection />

            <div className="flex gap-10 mt-6 lg:mt-10">
              <SidebarFilters />

              <div className="flex-1 min-w-0">
                <ProductGrid />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CATALOG VIEW */}
        {activeTab === "catalog" && (
          <div>
            {/* Breadcrumb row */}
            <div className="flex items-center gap-2 text-xs font-light text-muted mb-6">
              <span
                className="hover:text-main cursor-pointer"
                onClick={() => setActiveTab("home")}
              >
                Главная
              </span>
              <span>/</span>
              <span className="text-main font-semibold lowercase">
                каталог продукции
              </span>
            </div>

            <div className="flex gap-10">
              <SidebarFilters />

              <div className="flex-1 min-w-0">
                <ProductGrid />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: FAVORITES VIEW */}
        {activeTab === "favorites" && (
          <div className="min-h-[50vh] py-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Heart className="w-6 h-6 text-accent fill-accent" />
              <h2 className="text-2xl font-serif">Избранные товары</h2>
              <span className="text-xs bg-accent text-white font-bold px-2.5 py-0.5 rounded-full">
                {favoriteProducts.length}
              </span>
            </div>

            {favoriteProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-border/60 rounded-3xl p-8 shadow-sm">
                <Heart
                  className="w-12 h-12 text-muted/40 mx-auto mb-4"
                  strokeWidth={1}
                />
                <p className="text-lg font-serif mb-1">
                  Список избранного пуст
                </p>
                <p className="text-sm text-muted font-light max-w-xs mx-auto mb-8">
                  Добавляйте понравившиеся товары в избранное, кликая на иконку
                  сердечка на карточках.
                </p>
                <button
                  onClick={() => setActiveTab("home")}
                  className="px-6 py-3 bg-accent text-white rounded-xl text-sm font-semibold hover:bg-accent-hover transition-colors"
                >
                  Вернуться на главную
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {favoriteProducts.map((p) => (
                  <div key={p.id} className="flex flex-col">
                    <ProductCard product={p} />
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="mt-2 w-full py-2.5 bg-white border border-border text-main text-xs font-semibold rounded-xl hover:bg-primary transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> В корзину
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: CATEGORIES VIEW */}
        {activeTab === "categories" && (
          <CategoriesView />
        )}

        {/* VIEW 5: PROFILE VIEW */}
        {activeTab === "profile" && (
          <ProfileView />
        )}
      </main>

      {/* Global interactive overlay blocks */}
      <ProductDetailModal />
      <CartDrawer />
      <SearchOverlay />
      <CartAddedToast />

      <MobileBottomNav />
      <InstallHint />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}
