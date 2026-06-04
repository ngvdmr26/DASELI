import React from 'react';
import { Home, LayoutGrid, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';

export const MobileBottomNav = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'categories', label: 'Категории', icon: LayoutGrid },
    { id: 'profile', label: 'Профиль', icon: User },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-border/80 z-40 px-8 py-2.5 lg:hidden flex justify-around items-center pb-safe shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="relative flex flex-col items-center justify-center gap-1 w-20 h-11 transition-all"
            id={`bottom-tab-${tab.id}`}
          >
            {isActive && (
              <motion.span
                layoutId="activeTabIndicator"
                className="absolute -top-2.5 w-12 h-1 bg-accent rounded-full"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <motion.div
              animate={{
                scale: isActive ? 1.15 : 1,
                y: isActive ? -1 : 0
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`relative ${isActive ? 'text-accent' : 'text-[#9CA3AF]'}`}
            >
              <Icon className="w-5.5 h-5.5" strokeWidth={isActive ? 2.2 : 1.7} />
            </motion.div>
            <span
              className={`text-[9.5px] font-medium tracking-wide transition-colors duration-200 ${
                isActive ? 'text-accent font-semibold' : 'text-[#6B7280]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

