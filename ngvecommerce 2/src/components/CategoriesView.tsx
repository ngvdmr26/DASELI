import React from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';

const homeCategories = [
  {
    key: 'bedding',
    title: 'Постельное белье',
    subtitle: 'Шелковый сатин, умягченный лен, фланель',
    description: 'Изысканные комплекты из благородных эко-материалов для идеального и глубокого сна.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800',
    count: '4 комплекта',
    tag: 'Royal Sleep'
  },
  {
    key: 'decor',
    title: 'Пледы и Шторы',
    subtitle: 'Кашемировые накидки, шторы блэкаут, чехлы',
    description: 'Уютный интерьерный декор для создания гармонии, уединения и тепла в вашем доме.',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=800',
    count: '5 товаров',
    tag: 'Cozy Living'
  },
  {
    key: 'bath',
    title: 'Ванная и Халаты',
    subtitle: 'Вафельные кимоно, бамбуковые полотенца',
    description: 'Легкие фактурные девайсы и махровые полотенца класса делюкс для спа-ритуалов.',
    image: 'https://images.unsplash.com/photo-1563163447-106195c6edb5?auto=format&fit=crop&q=80&w=800',
    count: '3 товара',
    tag: 'SPA Rituals'
  },
  {
    key: 'basics',
    title: 'Подушки и Одеяла',
    subtitle: 'Анатомический шелк, сибирский пух',
    description: 'Инновационные наполнители и премиум чехлы для бережной ортопедической поддержки.',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&q=80&w=800',
    count: '2 товара',
    tag: 'Sweet Dreams'
  },
  {
    key: 'kids',
    title: 'Детский текстиль',
    subtitle: 'Муслиновые комплекты, балдахины, махровые халатики',
    description: 'Нежнейшие сертифицированные гипоаллергенные комплекты и балдахины из премиум-муслина для беззаботного сна малышей.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800',
    count: '3 товара',
    tag: 'Baby & Kids'
  }
];

export const CategoriesView = () => {
  const { setFilters, setActiveTab } = useApp();

  const handleCategoryClick = (categoryKey: any) => {
    setFilters((prev) => ({
      ...prev,
      category: categoryKey,
      gender: 'all',
      isSale: false,
    }));
    setActiveTab('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="py-2.5 max-w-5xl mx-auto px-1 tracking-tight">
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-8">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('home')}
            className="p-1.5 hover:bg-white rounded-full transition-colors shrink-0 group"
          >
            <ArrowLeft className="w-5 h-5 text-muted group-hover:text-main" />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Дасели Текстиль • Коллекции
          </span>
        </div>
        <h2 className="text-2xl lg:text-3.5xl font-serif mt-1">Категории текстиля</h2>
        <p className="text-xs text-muted/80 font-light">
          Выберите нужный раздел для просмотра нашего премиум ассортимента из благородных материалов
        </p>
      </div>

      {/* Main Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16"
      >
        {homeCategories.map((cat) => (
          <motion.div
            key={cat.key}
            variants={itemVariants}
            onClick={() => handleCategoryClick(cat.key)}
            className="bg-white rounded-3xl overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative aspect-[16/10] sm:aspect-[16/9] flex flex-col justify-end"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background image & gradient overlay */}
            <div className="absolute inset-0">
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity group-hover:from-black/90" />
            </div>

            {/* Premium tag */}
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              {cat.tag}
            </div>

            {/* Content card */}
            <div className="relative p-5 lg:p-6 text-white text-left select-none">
              <span className="text-[10px] uppercase font-bold text-accent tracking-widest bg-[#F7F5F0]/90 px-2 py-0.5 rounded-md inline-block mb-1.5 shadow-sm">
                {cat.count}
              </span>
              <h3 className="text-lg lg:text-2xl font-serif leading-tight drop-shadow-sm flex items-center gap-1.5">
                {cat.title}
                <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#E6D5C3]" />
              </h3>
              <p className="text-[11px] text-[#EDE6D6] font-medium tracking-wide mt-1 line-clamp-1 opacity-90">
                {cat.subtitle}
              </p>
              <p className="text-[10px] text-[#E6D5C3]/80 font-light mt-2 line-clamp-2 max-w-sm hidden sm:block">
                {cat.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
