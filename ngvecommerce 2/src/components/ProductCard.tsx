import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

export const ProductCard = ({ product }: { product: Product; key?: React.Key }) => {
  const { toggleFavorite, favorites, setSelectedProduct } = useApp();
  const [activeColor, setActiveColor] = useState(product.colors[0]);
  const isFavorite = favorites.includes(product.id);

  const price = product.salePrice ?? product.price;

  return (
    <motion.div 
      onClick={() => setSelectedProduct(product)}
      className="flex flex-col group cursor-pointer w-full transition-all"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] bg-surface-alt rounded-2xl overflow-hidden mb-3 shadow-sm group-hover:shadow-md transition-shadow">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Hover overlay quick action */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:block bg-gradient-to-t from-black/20 to-transparent">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="w-full py-2.5 bg-white/90 backdrop-blur-sm text-main text-xs font-semibold rounded-xl hover:bg-accent hover:text-white transition-colors shadow-sm active:scale-95 duration-200"
          >
            Быстрый просмотр
          </button>
        </div>

        {/* Mobile quick action icon */}
        <div className="absolute bottom-3 right-3 lg:hidden bg-white/90 backdrop-blur-sm shadow-sm rounded-full p-2 text-main active:scale-90 transition-transform">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </div>

        {/* Labels tag */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded">
            New
          </span>
        )}
        {product.isSale && (
          <span className="absolute top-3 left-3 bg-accent text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-bold">
            Sale
          </span>
        )}

        {/* Out of stock tag */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-white/95 text-main text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm">
              Предзаказ
            </span>
          </div>
        )}
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleFavorite(product.id); 
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/60 hover:bg-white backdrop-blur-md hover:scale-110 active:scale-90 transition-all z-10 shadow-sm"
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart 
            className={`w-4 h-4 lg:w-4.5 lg:h-4.5 transition-colors ${
              isFavorite ? 'text-accent fill-accent' : 'text-main'
            }`} 
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col px-1">
        <h3 className="text-sm font-medium text-main line-clamp-2 min-h-[40px] leading-5 group-hover:text-accent transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm font-bold text-main">
            {price.toLocaleString('ru-RU')} ₽
          </p>
          {product.isSale && product.salePrice && (
            <p className="text-xs text-muted line-through">
              {product.price.toLocaleString('ru-RU')} ₽
            </p>
          )}
        </div>
        
        {/* Color Swatches */}
        <div className="flex items-center gap-2 mt-2.5">
          {product.colors.map((color, index) => (
            <button
              key={index}
              onClick={(e) => { 
                e.stopPropagation(); 
                setActiveColor(color); 
              }}
              className={`w-3.5 h-3.5 rounded-full border border-gray-200 transition-all ${
                activeColor === color 
                  ? 'ring-1 ring-offset-2 ring-accent scale-110' 
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>

        {/* Size Selector Row */}
        <div className="flex items-center gap-2.5 mt-3 flex-wrap">
          {product.sizes.map((size) => (
            <span 
              key={size} 
              className="text-[9.5px] text-muted uppercase font-semibold hover:text-main transition-colors select-none bg-black/5 px-2 py-0.5 rounded"
            >
              {size}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
