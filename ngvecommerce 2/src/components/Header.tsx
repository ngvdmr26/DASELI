import React from "react";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";

export const Header = () => {
  const {
    setSearchOpen,
    setCartOpen,
    cart,
    favorites,
    setFilters,
    setActiveTab,
    triggerCartBounce,
  } = useApp();

  const handleGenderClick = (gender: "women" | "men") => {
    setFilters((prev) => ({
      ...prev,
      gender,
      category: "all",
      isSale: false,
    }));
    setActiveTab("catalog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (category: "shoes" | "accessories") => {
    setFilters((prev) => ({
      ...prev,
      gender: "all",
      category,
      isSale: false,
    }));
    setActiveTab("catalog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaleClick = () => {
    setFilters((prev) => ({
      ...prev,
      gender: "all",
      category: "all",
    }));
    setActiveTab("catalog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      gender: "all",
      category: "all",
    }));
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-primary/95 backdrop-blur-md border-b border-border/60 px-4 py-4 lg:px-10 lg:py-5 flex items-center justify-between">
      {/* Brand Logo */}
      <a
        href="/"
        onClick={handleHomeClick}
        className="text-2xl lg:text-3.5xl font-serif tracking-widest text-[#2D252E] uppercase select-none transition-all active:opacity-70 flex items-center gap-2 group hover:text-accent"
      >
        <span className="font-extrabold text-accent">DASELI</span>
        <span className="font-light text-muted group-hover:text-accent tracking-normal capitalize text-sm border-l border-border pl-2.5 hidden sm:inline-block">Текстиль</span>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-8">
        <button
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              category: "bedding",
              gender: "all",
              isSale: false,
            }));
            setActiveTab("catalog");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-xs font-bold uppercase tracking-wider text-[#2D252E] hover:text-accent transition-colors cursor-pointer"
        >
          Постельное белье
        </button>
        <button
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              category: "decor",
              gender: "all",
              isSale: false,
            }));
            setActiveTab("catalog");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-xs font-bold uppercase tracking-wider text-[#2D252E] hover:text-accent transition-colors cursor-pointer"
        >
          Пледы и Декор
        </button>
        <button
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              category: "bath",
              gender: "all",
              isSale: false,
            }));
            setActiveTab("catalog");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-xs font-bold uppercase tracking-wider text-[#2D252E] hover:text-accent transition-colors cursor-pointer"
        >
          Халаты и Полотенца
        </button>
        <button
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              category: "kids",
              gender: "all",
              isSale: false,
            }));
            setActiveTab("catalog");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-xs font-bold uppercase tracking-wider text-[#2D252E] hover:text-accent transition-colors cursor-pointer"
        >
          Детский текстиль
        </button>
        <button
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              category: "basics",
              gender: "all",
              isSale: false,
            }));
            setActiveTab("catalog");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-xs font-bold uppercase tracking-wider text-[#2D252E] hover:text-accent transition-colors cursor-pointer"
        >
          Подушки и Одеяла
        </button>
        <button
          onClick={() => {
            setFilters((prev) => ({
              ...prev,
              category: "all",
              gender: "all",
              isSale: true,
            }));
            setActiveTab("catalog");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-hover transition-colors cursor-pointer"
        >
          Акции %
        </button>
      </nav>

      {/* Icons */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          onClick={() => setSearchOpen(true)}
          className="text-[#1A1A1A] hover:text-accent transition-colors cursor-pointer p-1"
          aria-label="Search"
        >
          <Search className="w-5.5 h-5.5 lg:w-5 lg:h-5" strokeWidth={1.5} />
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className="relative text-[#1A1A1A] hover:text-accent transition-colors cursor-pointer p-1"
          aria-label="Favorites"
        >
          <Heart className="w-5.5 h-5.5 lg:w-5 lg:h-5" strokeWidth={1.5} />
          {favorites.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-accent w-2 h-2 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setCartOpen(true)}
          className={`relative text-[#1A1A1A] hover:text-accent transition-colors cursor-pointer p-1 ${
            triggerCartBounce ? "animate-bounce" : ""
          }`}
          aria-label="Cart"
        >
          <ShoppingBag
            className="w-5.5 h-5.5 lg:w-5 lg:h-5"
            strokeWidth={1.5}
          />
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
