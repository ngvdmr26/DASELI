import React from "react";
import { Search, Heart, ShoppingBag, User, LogOut } from "lucide-react";
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
    currentUser,
    setCurrentUser,
    setAuthOpen,
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
        {/* Auth Button */}
        {currentUser ? (
          <div className="relative group">
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 text-[#1A1A1A] hover:text-accent transition-colors cursor-pointer p-1"
              aria-label="Профиль"
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-7 h-7 rounded-full object-cover border-2 border-accent/30" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-accent/10 border-2 border-accent/30 text-accent flex items-center justify-center text-xs font-bold">
                  {currentUser.name.substring(0, 1).toUpperCase()}
                </div>
              )}
              <span className="hidden lg:inline text-xs font-semibold truncate max-w-[80px]">{currentUser.name.split(' ')[0]}</span>
            </button>
            {/* Logout tooltip */}
            <div className="absolute right-0 top-full mt-2 hidden group-hover:flex flex-col bg-white border border-border shadow-lg rounded-xl p-1 w-36 z-50">
              <button
                onClick={() => setCurrentUser(null)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Выйти
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAuthOpen(true)}
            className="flex items-center gap-1.5 text-[#1A1A1A] hover:text-accent transition-colors cursor-pointer p-1"
            aria-label="Войти"
          >
            <User className="w-5.5 h-5.5 lg:w-5 lg:h-5" strokeWidth={1.5} />
            <span className="hidden lg:inline text-xs font-semibold">Войти</span>
          </button>
        )}
      </div>
    </header>
  );
};
