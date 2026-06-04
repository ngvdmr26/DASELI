import React, { useState } from 'react';
import { X, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart, toggleFavorite, favorites } = useApp();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
  const [errorMsg, setErrorMsg] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const isFavorite = favorites.includes(product.id);
  const price = product.salePrice ?? product.price;

  const COLOR_NAMES: Record<string, string> = {
    '#E6D5C3': 'Бежевый / Лен',
    '#1A1A1A': 'Темный графит',
    '#A39171': 'Кэмел',
    '#8E7051': 'Золотистый / Тауп',
    '#4A5568': 'Пыльно-серый',
    '#FFFFFF': 'Белый',
    '#9E7B9B': 'Лавандовый / Розовый',
    '#F2B8D2': 'Пыльно-розовый',
    '#EDE6D6': 'Молочный / Кремовый',
    '#ECE3EF': 'Нежная лаванда'
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0 && product.sizes[0] !== 'ONE SIZE') {
      setErrorMsg('Пожалуйста, выберите размер');
      return;
    }
    if (!selectedColor) {
      setErrorMsg('Пожалуйста, выберите цвет');
      return;
    }

    setErrorMsg('');
    addToCart(product, selectedSize || 'ONE SIZE', selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setSelectedProduct(null);
    }, 800);
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    setErrorMsg('');
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative bg-[#F6F4F0] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] text-[#1A1A1A]"
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white text-main shadow-md transition-all active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Beautiful Gallery */}
          <div className="w-full md:w-1/2 relative bg-surface-alt flex items-center justify-center overflow-hidden aspect-[4/5] md:aspect-auto">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-accent text-white uppercase text-[9px] tracking-widest px-3 py-1 rounded-full font-semibold">
                New
              </span>
            )}
            {product.isSale && (
              <span className="absolute top-4 left-4 bg-red-600 text-white uppercase text-[9px] tracking-widest px-3 py-1 rounded-full font-semibold">
                Sale
              </span>
            )}
          </div>

          {/* Right: Rich Details and Pickers */}
          <div className="w-full md:w-1/2 p-6 lg:p-10 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Product Title */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-xl lg:text-2xl font-serif leading-tight">
                  {product.title}
                </h2>
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="p-2 rounded-full border border-border hover:bg-white transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'text-accent fill-accent' : 'text-main'}`} />
                </button>
              </div>

              {/* Price Details */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-xl lg:text-2xl font-bold text-main">
                  {price.toLocaleString('ru-RU')} ₽
                </span>
                {product.isSale && product.salePrice && (
                  <span className="text-sm text-muted line-through">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                )}
              </div>

              {/* Status Notice */}
              {!product.inStock && (
                <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg mb-6 font-medium">
                  Товар временно распродан, но доступен для предзаказа.
                </div>
              )}

              {/* Color Swatches */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Цвет</span>
                  <span className="text-muted font-normal lowercase">выберите один</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleSelectColor(color)}
                      aria-label={`Выбрать цвет: ${COLOR_NAMES[color.toUpperCase()] || color}`}
                      title={COLOR_NAMES[color.toUpperCase()] || color}
                      className={`w-8 h-8 rounded-full border border-gray-200 transition-all ${
                        selectedColor === color 
                          ? 'ring-2 ring-offset-2 ring-accent scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              {product.sizes[0] !== 'ONE SIZE' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2">
                    <span>Размер</span>
                    <button onClick={() => setShowSizeGuide(!showSizeGuide)} className="text-muted font-normal underline hover:text-accent transition-colors cursor-pointer">
                      таблица размеров
                    </button>
                  </div>
                  
                  {showSizeGuide && (
                    <div className="mb-3 p-3.5 bg-white border border-border/60 rounded-xl text-[10px] text-muted overflow-x-auto">
                       <table className="w-full text-left font-sans">
                         <thead><tr className="border-b border-border/40"><th className="pb-1.5">Стандарт</th><th className="pb-1.5">Пододеяльник</th><th className="pb-1.5">Простыня</th><th className="pb-1.5">Наволочки</th></tr></thead>
                         <tbody>
                           <tr><td className="py-1 font-semibold">1.5-СП</td><td>150х200 см</td><td>160х210 см</td><td>50х70 см (2 шт)</td></tr>
                           <tr><td className="py-1 font-semibold">Евро</td><td>200х220 см</td><td>240х260 см</td><td>50х70 см (2 шт)</td></tr>
                           <tr><td className="py-1 font-semibold">Семейный</td><td>150х200 см (2 шт)</td><td>240х260 см</td><td>70х70 см (2 шт)</td></tr>
                         </tbody>
                       </table>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSelectSize(size)}
                        className={`min-w-12 h-10 px-3 flex items-center justify-center text-xs font-medium border rounded-xl transition-all ${
                          selectedSize === size 
                            ? 'bg-accent text-white border-accent shadow-md scale-105' 
                            : 'bg-white border-border text-main hover:border-main'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab navigation (Description vs Specs) */}
              <div className="border-b border-border flex gap-6 text-xs font-semibold uppercase tracking-wider mb-4">
                <button 
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2 ${activeTab === 'desc' ? 'border-b-2 border-accent text-accent' : 'text-muted hover:text-main'}`}
                >
                  Описание
                </button>
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 ${activeTab === 'specs' ? 'border-b-2 border-accent text-accent' : 'text-muted hover:text-main'}`}
                >
                  Характеристики
                </button>
              </div>

              {/* Tab Content */}
              <div className="text-sm text-muted font-light leading-relaxed mb-6">
                {activeTab === 'desc' ? (
                  <p>{product.description}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <React.Fragment key={key}>
                        <span className="font-medium text-main text-xs">{key}</span>
                        <span className="text-xs">{value}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Interactive Actions */}
            <div className="relative pt-4 pb-4 border-t border-border/60 mt-6">
              {errorMsg && (
                <div className="text-red-600 text-xs font-medium mb-3">
                  {errorMsg}
                </div>
              )}

              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-4 text-white rounded-xl text-sm font-semibold transition-colors shadow-[0_8px_16px_rgba(0,0,0,0.08)] active:scale-[0.99] ${isAdded ? 'bg-green-600' : 'bg-accent hover:bg-accent-hover'}`}
              >
                {isAdded ? 'Добавлено!' : (!product.inStock ? 'Оформить предзаказ' : 'Добавить в корзину')}
              </button>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/40 text-[10px] text-muted font-light text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span>Доставка<br/>по России</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span>Безопасная<br/>оплата</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <span>Возврат<br/>14 дней</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
