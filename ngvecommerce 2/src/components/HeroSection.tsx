import React from 'react';
import { heroImage } from '../data';
import { useApp } from '../context/AppContext';

export const HeroSection = () => {
  const { setFilters, setActiveTab } = useApp();

  const handleCatalogRedirect = (category: 'all' | 'bedding') => {
    setFilters(prev => ({
      ...prev,
      category,
      gender: 'all',
      isSale: false
    }));
    setActiveTab('catalog');
  };

  return (
    <section className="relative w-full h-[500px] lg:h-[600px] lg:rounded-2xl overflow-hidden bg-[#E8E3DD] mb-8 select-none">
      {/* Background Image */}
      <img 
        src={heroImage} 
        alt="Новая коллекция Daseli" 
        className="absolute inset-0 w-full h-full object-cover object-center"
        referrerPolicy="no-referrer"
      />
      
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/50 to-transparent pointer-events-none"></div>
      
      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 lg:p-12 flex flex-col justify-center max-w-xl z-10">
        <span className="text-accent text-[10px] lg:text-xs font-semibold tracking-widest uppercase mb-3 lg:mb-4 drop-shadow-sm">
          Премиальный домашний текстиль
        </span>
        
        <h1 className="text-4xl lg:text-6xl font-serif text-main leading-[1.1] mb-4 [text-shadow:_0_2px_12px_rgba(255,255,255,0.8)]">
          Гармония и уют<br />в вашем доме
        </h1>
        
        <p className="text-sm lg:text-base text-[#4A4A4A] mb-8 max-w-[280px] lg:max-w-sm">
          Создаем эстетику из благородного умягченного льна, гладкого шелка и мягчайшего длинноволокнистого хлопка.
        </p>
        
        {/* Actions */}
        <div className="flex flex-row gap-3 lg:gap-4 z-10">
          <button 
            onClick={() => handleCatalogRedirect('all')}
            className="px-6 py-3 bg-accent text-white text-sm font-semibold rounded-xl hover:bg-accent-hover transition-all cursor-pointer shadow-md active:scale-95 duration-200"
          >
            Смотреть все
          </button>
          <button 
            onClick={() => handleCatalogRedirect('bedding')}
            className="px-6 py-3 bg-transparent text-main text-sm font-semibold rounded-xl border border-main hover:bg-main hover:text-white transition-all backdrop-blur-sm cursor-pointer active:scale-95 duration-200"
          >
            Постельное белье
          </button>
        </div>

        {/* Pagination Indicators */}
        <div className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12 flex gap-2">
          <div className="w-8 lg:w-10 h-1 bg-accent rounded-full"></div>
          <div className="w-6 lg:w-8 h-1 bg-white/50 hover:bg-white/70 transition-colors cursor-pointer rounded-full" onClick={() => handleCatalogRedirect('all')}></div>
          <div className="w-6 lg:w-8 h-1 bg-white/50 hover:bg-white/70 transition-colors cursor-pointer rounded-full" onClick={() => handleCatalogRedirect('bedding')}></div>
        </div>
      </div>
    </section>
  );
};
