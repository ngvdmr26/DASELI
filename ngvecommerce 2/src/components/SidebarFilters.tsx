import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SidebarFilters = () => {
  const { filters, setFilters, clearFilters, isMobileFiltersOpen, setMobileFiltersOpen } = useApp();
  const [isCategoryOpen, setCategoryOpen] = useState(true);
  const [isSizeOpen, setSizeOpen] = useState(true);
  const [isColorOpen, setColorOpen] = useState(true);
  const [isPriceOpen, setPriceOpen] = useState(true);

  // Local state for smooth price typing avoiding strict bounds lock per keystroke
  const [localMin, setLocalMin] = useState(filters.priceRange[0].toString());
  const [localMax, setLocalMax] = useState(filters.priceRange[1].toString());

  useEffect(() => {
    setLocalMin(filters.priceRange[0].toString());
    setLocalMax(filters.priceRange[1].toString());
  }, [filters.priceRange]);

  const commitPriceChange = (type: 'min' | 'max') => {
    let min = parseInt(localMin) || 0;
    let max = parseInt(localMax) || 0;

    if (max < min) {
      if (type === 'min') max = min;
      else min = max;
    }

    setLocalMin(min.toString());
    setLocalMax(max.toString());
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
  };

  const handlePresetChange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, priceRange: [min, max] }));
  };

  const handleCategorySelect = (category: 'bedding' | 'decor' | 'bath' | 'basics' | 'kids' | 'all') => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleSizeToggle = (size: string) => {
    setFilters(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleColorToggle = (color: string) => {
    setFilters(prev => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const handleStockToggle = () => {
    setFilters(prev => ({ ...prev, inStockOnly: !prev.inStockOnly }));
  };

  const colorsList = [
    { value: '#FFFFFF', label: 'Белый' },
    { value: '#EDE6D6', label: 'Молочный / Кремовый' },
    { value: '#E6D5C3', label: 'Бежевый / Лен' },
    { value: '#9E7B9B', label: 'Лавандовый / Розовый' },
    { value: '#8E7051', label: 'Золотистый / Тауп' },
    { value: '#4A5568', label: 'Пыльно-серый' },
    { value: '#1A1A1A', label: 'Темный графит' }
  ];

  const textileSizes = [
    '1.5-СП', 'Евро', 'Семейный',
    'S-M', 'L-XL', 'Набор 3 шт.',
    '50x70 см', '70x70 см', '45x45 см (2 шт)'
  ];

  return (
    <aside className={`fixed inset-0 z-[60] bg-[#F7F5F0] flex flex-col transition-transform duration-300 ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:w-[280px] lg:shrink-0 lg:sticky lg:top-28 lg:self-start lg:bg-primary lg:h-[calc(100vh-120px)] lg:pr-6 lg:pb-12`}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-border shadow-sm shrink-0 mt-safe">
         <h2 className="text-base font-bold uppercase tracking-widest text-main">Фильтры</h2>
         <button 
           onClick={() => setMobileFiltersOpen(false)}
           className="p-2 rounded-full text-main hover:bg-border transition-colors active:scale-95"
         >
           <X className="w-5 h-5"/>
         </button>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto w-full p-6 lg:p-0 lg:flex lg:flex-col pb-32 lg:pb-0">
        {/* Header - Desktop Only */}
        <div className="hidden lg:flex items-center justify-between mb-8 shrink-0">
          <h2 className="text-xs font-bold uppercase tracking-widest text-main">Фильтры</h2>
          <button 
            onClick={clearFilters}
            className="text-[10px] text-muted hover:text-red-500 font-medium transition-colors"
          >
            Очистить все
          </button>
        </div>

      {/* Accordion: Category */}
      <div className="py-2 border-t border-border flex flex-col gap-3">
        <button 
          onClick={() => setCategoryOpen(!isCategoryOpen)}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-main group pt-2"
        >
          <span>Категория текстиля</span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
        </button>
        {isCategoryOpen && (
          <div className="flex flex-col gap-2 pt-1">
            {[
              { id: 'all', label: 'Вся продукция' },
              { id: 'bedding', label: 'Постельное белье' },
              { id: 'decor', label: 'Пледы и Декор' },
              { id: 'bath', label: 'Халаты и Полотенца' },
              { id: 'kids', label: 'Детский текстиль' },
              { id: 'basics', label: 'Подушки и Одеяла' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id as any)}
                className={`text-left text-xs py-1.5 px-2.5 rounded-lg transition-all ${
                  filters.category === cat.id 
                    ? 'bg-accent text-white font-semibold' 
                    : 'text-muted hover:text-main hover:bg-white/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Accordion: Size */}
      <div className="py-4 border-t border-border flex flex-col gap-4">
        <button 
          onClick={() => setSizeOpen(!isSizeOpen)}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-main group"
        >
          <span>Размер изделия</span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isSizeOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isSizeOpen && (
          <div className="flex flex-wrap gap-2 pt-1">
            {textileSizes.map((size) => {
              const isActive = filters.sizes.includes(size);
              return (
                <button 
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1.5 flex items-center justify-center text-[10.5px] border rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white border-accent text-accent font-semibold shadow-sm' 
                      : 'bg-transparent border-border text-main hover:border-main'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion: Color */}
      <div className="py-4 border-t border-border flex flex-col gap-4">
        <button 
          onClick={() => setColorOpen(!isColorOpen)}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-main group"
        >
          <span>Цветовая гамма</span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isColorOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isColorOpen && (
          <div className="flex flex-col gap-2 pt-1">
            {colorsList.map((col) => {
              const isActive = filters.colors.includes(col.value);
              return (
                <button
                  key={col.value}
                  onClick={() => handleColorToggle(col.value)}
                  className={`flex items-center gap-3 w-full py-1.5 px-2 rounded-lg transition-all text-left text-xs ${
                    isActive ? 'bg-white font-semibold shadow-sm text-accent' : 'text-muted hover:text-main'
                  }`}
                >
                  <span 
                    className="w-4 h-4 rounded-full border border-border inline-block shadow-inner shrink-0" 
                    style={{ backgroundColor: col.value }}
                  />
                  <span>{col.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion: Price */}
      <div className="py-4 border-t border-border flex flex-col gap-4">
        <button 
          onClick={() => setPriceOpen(!isPriceOpen)}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-main group"
        >
          <span>Диапазон цен, ₽</span>
          <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${isPriceOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isPriceOpen && (
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-muted">От</span>
                <input 
                  type="number" 
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  onBlur={() => commitPriceChange('min')}
                  onKeyDown={e => e.key === 'Enter' && commitPriceChange('min')}
                  className="w-full bg-white border border-border rounded-lg text-xs p-2 focus:outline-none focus:border-accent text-main font-medium"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <span className="text-[10px] text-muted">До</span>
                <input 
                  type="number" 
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  onBlur={() => commitPriceChange('max')}
                  onKeyDown={e => e.key === 'Enter' && commitPriceChange('max')}
                  className="w-full bg-white border border-border rounded-lg text-xs p-2 focus:outline-none focus:border-accent text-main font-medium"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <button 
                onClick={() => handlePresetChange(1800, 8000)}
                className="py-1.5 border border-border rounded bg-white/70 hover:bg-white text-muted hover:text-main"
              >
                до 8 000 ₽
              </button>
              <button 
                onClick={() => handlePresetChange(8000, 20000)}
                className="py-1.5 border border-border rounded bg-white/70 hover:bg-white text-muted hover:text-main"
              >
                8 000 - 20 000 ₽
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toggle: In Stock */}
      <div className="py-4 border-t border-border border-b flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-main">Только в наличии</span>
        <button 
          onClick={handleStockToggle}
          className={`w-10 h-6 rounded-full relative transition-colors duration-300 shadow-inner p-1 ${
            filters.inStockOnly ? 'bg-accent' : 'bg-[#D9D9D9]'
          }`}
        >
          <div 
            className={`w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${
              filters.inStockOnly ? 'translate-x-4' : 'translate-x-0'
            }`} 
          />
        </button>
      </div>

      </div>

      <div className="lg:hidden shrink-0 p-4 border-t border-border bg-white flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-safe relative z-10 w-full">
         <button 
           onClick={clearFilters}
           className="px-4 py-3 bg-surface-alt text-main rounded-xl text-sm font-semibold hover:bg-border transition-colors active:scale-95 w-1/3"
         >
           Сбросить
         </button>
         <button 
           onClick={() => setMobileFiltersOpen(false)}
           className="px-4 py-3 bg-[#1A1A1A] text-white rounded-xl text-sm font-semibold hover:bg-accent transition-colors active:scale-95 flex-1"
         >
           Готово
         </button>
      </div>

    </aside>
  );
};
