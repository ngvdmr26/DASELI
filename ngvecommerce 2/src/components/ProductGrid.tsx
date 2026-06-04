import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { useApp } from '../context/AppContext';
import { SlidersHorizontal } from 'lucide-react';

export const ProductGrid = () => {
  const { filteredProducts, filters, setFilters, clearFilters, searchQuery, setSearchQuery, setMobileFiltersOpen } = useApp();
  const [activeTab, setActiveTabState] = useState<'hits' | 'new' | 'recs'>('hits');

  // Interactive Tab filtering
  const displayProducts = filteredProducts.filter((p) => {
    if (activeTab === 'new') return p.isNew;
    if (activeTab === 'recs') return p.isHot; // recommendations or premium ones
    return true; // Hits (All matching filter state)
  });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as any;
    setFilters((prev) => ({ ...prev, sort: value }));
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'bedding': return 'Постельное белье';
      case 'decor': return 'Пледы и Декор';
      case 'bath': return 'Халаты и Полотенца';
      case 'kids': return 'Детский текстиль';
      case 'basics': return 'Подушки и Одеяла';
      default: return 'Текстиль';
    }
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    filters.category !== 'all' || 
    filters.isSale || 
    filters.inStockOnly || 
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] !== 1800 || 
    filters.priceRange[1] !== 24900;

  return (
    <section className="mb-12 lg:mb-16 select-none">
      
      {/* Active Search Context */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs lg:text-sm font-medium">
          <span className="text-muted hidden sm:inline-block">Активные фильтры:</span>
          
          {searchQuery.trim() !== '' && (
            <span className="bg-white border border-border px-3 py-1 rounded-full flex items-center gap-2 shadow-sm text-main">
              Поиск: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="text-muted hover:text-red-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </span>
          )}

          {filters.category !== 'all' && (
            <span className="bg-white border border-border px-3 py-1 rounded-full flex items-center gap-2 shadow-sm text-main capitalize">
              {getCategoryLabel(filters.category)}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))} 
                className="text-muted hover:text-red-500 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </span>
          )}

          {(filters.priceRange[0] !== 1800 || filters.priceRange[1] !== 24900) && (
            <span className="bg-white border border-border px-3 py-1 rounded-full flex items-center gap-2 shadow-sm text-main">
              {filters.priceRange[0]} - {filters.priceRange[1]} ₽
              <button 
                onClick={() => setFilters(prev => ({ ...prev, priceRange: [1800, 24900] }))} 
                className="text-muted hover:text-red-500 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </span>
          )}

          {filters.isSale && (
            <span className="bg-white border border-border px-3 py-1 rounded-full flex items-center gap-2 shadow-sm text-accent">
              Sale
              <button 
                onClick={() => setFilters(prev => ({ ...prev, isSale: false }))} 
                className="text-muted hover:text-red-500 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </span>
          )}
          
          {hasActiveFilters && (
             <button 
              onClick={() => {
                clearFilters();
                setSearchQuery('');
              }}
              className="text-xs text-muted hover:text-accent underline transition-colors lg:ml-2"
             >
               Сбросить все
             </button>
          )}
        </div>
      )}

      {/* Mobile Filter Toggle */}
      <div className="flex lg:hidden justify-end mb-4">
         <button 
           onClick={() => setMobileFiltersOpen(true)}
           className="flex items-center gap-2 bg-white px-4 py-2 text-xs rounded-xl shadow-sm border border-border/80 font-semibold text-main active:scale-95 transition-all"
         >
            <SlidersHorizontal className="w-4 h-4"/> Фильтры
         </button>
      </div>

      {/* Grid Sub-Header with sorting options and Tab lists */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4 mb-6">
        
        {/* Selection Tab Lists */}
        <div className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide text-xs lg:text-sm font-bold tracking-wider">
          <button 
            onClick={() => setActiveTabState('hits')}
            className={`pb-1 uppercase whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === 'hits' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-main'
            }`}
          >
            Хиты продаж
          </button>
          
          <button 
            onClick={() => setActiveTabState('new')}
            className={`pb-1 uppercase whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === 'new' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-main'
            }`}
          >
            Новинки
          </button>
          
          <button 
            onClick={() => setActiveTabState('recs')}
            className={`pb-1 uppercase whitespace-nowrap border-b-2 transition-all cursor-pointer ${
              activeTab === 'recs' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-main'
            }`}
          >
            Рекомендуем
          </button>
        </div>

        {/* Sorting Dropdown selector */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Сортировка:</span>
          </div>

          <select 
            value={filters.sort}
            onChange={handleSortChange}
            className="text-xs bg-white border border-border/80 rounded-lg py-1.5 px-3 focus:outline-none focus:border-accent text-main font-semibold cursor-pointer shadow-sm"
          >
            <option value="popular">Рекомендации</option>
            <option value="priceAsc">Сначала дешевле</option>
            <option value="priceDesc">Сначала дороже</option>
          </select>
        </div>
      </div>

      {/* Grid List Products */}
      {displayProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-border/50 rounded-3xl p-8 shadow-sm">
          <p className="text-[#1A1A1A] text-lg font-serif mb-2">Товары по фильтрам не найдены</p>
          <p className="text-sm text-muted font-light max-w-sm mx-auto mb-6">Попробуйте ослабить параметры фильтрации или ценового диапазона, чтобы увидеть больше текстиля.</p>
          <button 
            onClick={clearFilters}
            className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-accent transition-colors shadow-sm"
          >
            Сбросить все фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
