import React from 'react';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export const CartAddedToast: React.FC = () => {
  const { cartNotice, setCartOpen } = useApp();

  return (
    <AnimatePresence>
      {cartNotice && (
        <motion.div
          initial={{ opacity: 0, y: -14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-3 right-3 top-20 z-[60] mx-auto max-w-[360px] rounded-2xl border border-accent/20 bg-white/96 p-3 shadow-[0_18px_45px_rgba(45,37,46,0.16)] backdrop-blur-md sm:left-auto sm:right-5 sm:mx-0"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-primary">
              <img
                src={cartNotice.product.image}
                alt={cartNotice.product.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute -right-1 -top-1 rounded-full bg-accent text-white">
                <CheckCircle className="h-4 w-4" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-accent">Добавлено в корзину</div>
              <div className="truncate text-sm font-medium text-main">{cartNotice.product.title}</div>
              <div className="mt-0.5 text-[11px] text-muted">
                {cartNotice.selectedSize} • {cartNotice.quantity} шт.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-white"
              aria-label="Открыть корзину"
            >
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
