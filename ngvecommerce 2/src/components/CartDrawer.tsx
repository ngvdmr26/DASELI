import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer = () => {
  const { isCartOpen, setCartOpen, cart, updateCartQuantity, removeFromCart } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckoutFinished, setIsCheckoutFinished] = useState(false);

  if (!isCartOpen) return null;

  const totalBeforeDiscount = cart.reduce((acc, item) => {
    const activePrice = item.product.salePrice ?? item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);

  const discountAmount = Math.round(totalBeforeDiscount * discount);
  const total = Math.max(0, totalBeforeDiscount - discountAmount);
  const freeShippingThreshold = 10000;
  const isFreeShipping = total >= freeShippingThreshold;
  const deliveryCost = isFreeShipping ? 0 : 490;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'FA10') {
      setDiscount(0.10);
      setPromoSuccess('Промокод FA10 успешно применен! Скидка 10%');
      setPromoError('');
    } else if (promoCode.toUpperCase() === 'SPRING') {
      setDiscount(0.15);
      setPromoSuccess('Промокод SPRING успешно применен! Скидка 15%');
      setPromoError('');
    } else {
      setPromoError('Неверный промокод');
      setPromoSuccess('');
    }
  };

  const handleCheckout = () => {
    setIsCheckoutFinished(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden text-[#1A1A1A]">
        {/* Backdrop overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Drawer container: full width on mobile, max-w-md on larger screens */}
        <div className="absolute inset-y-0 right-0 w-full sm:max-w-md flex">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="w-full bg-[#F6F4F0] shadow-2xl flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between bg-[#F6F4F0]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h2 className="text-base sm:text-lg font-semibold font-serif">Корзина</h2>
                <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-white border border-transparent hover:border-border transition-all active:scale-95 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Switcher: Checkout Success or Cart List */}
            {isCheckoutFinished ? (
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent text-white rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-lg">
                  <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-3">Заказ успешно оформлен!</h3>
                <p className="text-xs sm:text-sm text-muted mb-6 sm:mb-8 max-w-xs font-light leading-relaxed">
                  Благодарим за покупку! Наш персональный менеджер свяжется с вами в течение 10 минут для уточнения адреса доставки. На ваш e-mail отправлена квитанция.
                </p>
                <button 
                  onClick={() => {
                    setIsCheckoutFinished(false);
                    setCartOpen(false);
                    // Clear cart
                    cart.forEach(item => removeFromCart(item.product.id, item.selectedSize, item.selectedColor));
                  }}
                  className="px-6 py-3 bg-accent text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-accent-hover transition-colors shadow-md active:scale-95"
                >
                  Продолжить шопинг
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col items-center justify-center text-center">
                <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-muted mb-4" strokeWidth={1} />
                <p className="text-base sm:text-lg font-serif mb-1">Ваша корзина пуста</p>
                <p className="text-xs sm:text-sm text-muted mb-6 sm:mb-8 max-w-[200px] font-light">Добавьте понравившиеся вещи из каталога.</p>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="px-6 py-3 bg-accent text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-accent-hover transition-colors shadow-md active:scale-95"
                >
                  В каталог
                </button>
              </div>
            ) : (
              <>
                {/* Scrollable List of Items */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {/* Free Shipping tracker */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-border shadow-sm text-[11px] sm:text-xs">
                    {isFreeShipping ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">✨ Поздравляем! Вам доступна бесплатная доставка.</span>
                    ) : (
                      <span> Добавьте еще товаров на сумму <strong className="text-accent font-semibold">{(freeShippingThreshold - total).toLocaleString('ru-RU')} ₽</strong> для бесплатной доставки.</span>
                    )}
                    <div className="w-full bg-border h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full ${isFreeShipping ? 'bg-green-500' : 'bg-accent'} transition-all duration-500`}
                        style={{ width: `${Math.min(100, (total / freeShippingThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {cart.map((item, idx) => {
                    const activePrice = item.product.salePrice ?? item.product.price;
                    return (
                      <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="bg-white p-2.5 sm:p-3 rounded-2xl border border-border/60 flex gap-3 sm:gap-4 shadow-sm items-center">
                        {/* Thumbnail Image */}
                        <div className="w-16 h-20 sm:w-20 sm:h-24 bg-[#F6F4F0] rounded-xl overflow-hidden shrink-0">
                          <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>

                        {/* Middle Item info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <h4 className="text-xs sm:text-sm font-semibold truncate text-[#1A1A1A] pr-1">
                            {item.product.title}
                          </h4>
                          
                          <div className="flex flex-wrap gap-1.5 text-[9px] sm:text-[10px] text-muted font-medium mt-1">
                            <span className="bg-[#F6F4F0] px-1.5 py-0.5 rounded uppercase">Р: {item.selectedSize}</span>
                            <span className="bg-[#F6F4F0] px-1.5 py-0.5 rounded flex items-center gap-1">
                              Цвет: <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" style={{ backgroundColor: item.selectedColor }} />
                            </span>
                          </div>

                          {/* Quantizer */}
                          <div className="flex items-center gap-2 sm:gap-3 mt-2.5">
                            <div className="flex items-center border border-border rounded-lg bg-[#F6F4F0] overflow-hidden">
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                                className="p-2 sm:p-1.5 px-3 sm:px-2.5 text-main hover:bg-white transition-colors active:bg-white/80"
                                aria-label="Уменьшить количество"
                              >
                                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <span className="text-[11px] sm:text-xs font-semibold px-1 w-5 sm:w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                                className="p-2 sm:p-1.5 px-3 sm:px-2.5 text-main hover:bg-white transition-colors active:bg-white/80"
                                aria-label="Увеличить количество"
                              >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                              className="text-muted/75 hover:text-red-600 transition-colors p-2.5 lg:p-2 active:scale-95 ml-auto sm:ml-0"
                              title="Удалить"
                              aria-label="Удалить из корзины"
                            >
                              <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Right: Price */}
                        <div className="text-xs sm:text-sm font-bold text-right shrink-0">
                          {(activePrice * item.quantity).toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom checkout widget */}
                <div className="p-4 sm:p-6 bg-white border-t border-border space-y-3 sm:space-y-4 shadow-[0_-4px_24px_rgba(0,0,0,0.03)] pb-safe">
                  {/* Promo Code input form */}
                  {discount > 0 ? (
                    <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-xl">
                       <span className="text-xs font-semibold text-green-700">Промокод применен ({discount*100}%)</span>
                       <button onClick={() => { setDiscount(0); setPromoCode(''); setPromoSuccess(''); }} className="text-[10px] text-green-700 underline hover:text-green-800">Удалить скидку</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Введите промокод (например, FA10)" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 border border-border/80 px-3 py-2 text-xs rounded-xl focus:outline-none focus:border-accent text-main bg-[#F6F4F0] min-w-0"
                      />
                      <button 
                        type="submit"
                        className="px-3 sm:px-4 py-2 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl hover:bg-accent transition-colors active:scale-95 shrink-0"
                      >
                        Применить
                      </button>
                    </form>
                  )}

                  {promoError && <p className="text-[10px] sm:text-xs text-red-600 font-semibold">{promoError}</p>}
                  {promoSuccess && <p className="text-[10px] sm:text-xs text-green-600 font-semibold">{promoSuccess}</p>}

                  {/* Pricing recap */}
                  <div className="space-y-1.5 text-[11px] sm:text-xs font-light text-[#1A1A1A]">
                    <div className="flex justify-between">
                      <span className="text-muted">Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                      <span className="font-medium">{totalBeforeDiscount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-accent font-semibold">
                        <span>Промокод (скидка {discount*100}%)</span>
                        <span>-{discountAmount.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted">Доставка</span>
                      <span className="font-medium">{isFreeShipping ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs sm:text-sm font-bold pt-2 border-t border-border">
                      <span className="text-sm sm:text-base font-serif font-semibold">Итого к оплате</span>
                      <span className="text-sm sm:text-base text-accent">{(total + (isFreeShipping ? 0 : deliveryCost)).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="pb-16 lg:pb-0">
                    <button 
                      onClick={handleCheckout}
                      className="w-full py-3 sm:py-4 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg active:scale-[0.98] cursor-pointer"
                    >
                      Перейти к оплате <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
