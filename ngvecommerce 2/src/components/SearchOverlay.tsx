import React, { useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { mockProducts } from '../data';

export const SearchOverlay = () => {
  const { isSearchOpen, setSearchOpen, searchQuery, setSearchQuery, setSelectedProduct, setActiveTab } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Search filter internally over original array to show immediate fast results
  const searchResults = mockProducts.filter(item => {
    if (searchQuery.trim() === '') return false;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      Object.values(item.specs).some(val => val.toLowerCase().includes(q))
    );
  });

  const trendingTags = ['Жакет', 'Поло', 'Платье', 'Лен', 'Замша', 'Кожа'];

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] bg-[#F6F4F0] flex flex-col text-[#1A1A1A]">
        {/* Top Header bar with search input */}
        <div className="max-w-[1440px] mx-auto w-full px-4 lg:px-10 py-6 flex items-center justify-between border-b border-border/60 shrink-0 mt-safe">
          <div className="flex-1 flex items-center gap-4 max-w-4xl">
            <Search className="w-5 h-5 text-accent shrink-0" />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Введите название товара или материал..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-lg lg:text-xl font-light bg-transparent focus:outline-none placeholder:text-muted/60"
            />
          </div>

          <button 
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }}
            className="p-2.5 rounded-full hover:bg-white border border-[#E5E5E5] transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results / suggestions */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 overflow-y-auto">
          {searchQuery.trim() === '' ? (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Популярные поисковые запросы</h3>
              <div className="flex flex-wrap gap-2 mb-10">
                {trendingTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-4 py-2 bg-white hover:bg-accent hover:text-white border border-border text-xs rounded-xl tracking-wide font-medium transition-all duration-300"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              {/* Little lifestyle advice */}
              <div className="bg-surface-alt/80 rounded-2xl p-6 border border-border/40 font-light text-sm p-8 leading-relaxed text-muted">
                <p className="font-serif italic text-base mb-2 text-main">Премиальность в простоте.</p>
                <p>Используйте поисковую строку для поиска капсульных наборов весенней линейки. Наберите «шелк», «лен» или «кожа», чтобы просмотреть предметы из соответствующих премиальных линеек бренда ФАЩЭ.</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 text-xs font-bold uppercase tracking-widest text-muted">
                <span>Найденные товары ({searchResults.length})</span>
                {searchResults.length > 0 && <span>Кликните на товар для просмотра</span>}
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-20 bg-white border border-border/60 rounded-3xl p-8 shadow-sm">
                  <p className="text-[#1A1A1A] text-lg font-serif mb-2">По вашему запросу ничего не найдено</p>
                  <p className="text-sm text-muted font-light max-w-md mx-auto">Попробуйте ввести другие ключевые слова, более точные термины или воспользуйтесь предустановленными тегами выше.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => handleSelectProduct(item)}
                        className="bg-white hover:bg-primary border border-border/40 p-3 rounded-2xl flex gap-3 transition-colors cursor-pointer items-center shadow-sm group"
                      >
                        <div className="w-16 h-20 bg-surface-alt rounded-lg overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold truncate group-hover:text-accent transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs font-extrabold mt-1 text-main">
                            {(item.salePrice ?? item.price).toLocaleString('ru-RU')} ₽
                          </p>
                          <span className="text-[10px] text-muted capitalize inline-block mt-0.5 font-light">
                            {item.category === 'bedding' ? 'Постельное белье' : item.category === 'decor' ? 'Декор и пледы' : item.category === 'bath' ? 'Халаты и полотенца' : item.category === 'kids' ? 'Детский текстиль' : 'Подушки и одеяла'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show all in catalog CTA */}
                  <div className="mt-8 text-center pb-safe">
                    <button 
                      onClick={() => {
                        setSearchOpen(false); // keep searchQuery active!
                        setActiveTab('catalog');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3 bg-[#1A1A1A] text-white rounded-xl text-sm font-semibold hover:bg-accent transition-colors shadow-md"
                    >
                      Посмотреть {searchResults.length} товаров в каталоге
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
