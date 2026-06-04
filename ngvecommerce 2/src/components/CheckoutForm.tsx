import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CreditCard, Check, Loader2, MapPin, User, Phone, Mail, MessageSquare, Building2, Truck, Store, Lock, AlertCircle } from 'lucide-react';
import { CartItem, OrderData, CustomerInfo } from '../types';
import { useApp } from '../context/AppContext';

interface CheckoutFormProps {
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  discount: number;
  deliveryCost: number;
}

const STEPS = ['Контакты', 'Доставка', 'Оплата', 'Готово'];

// ─── Phone Mask Helper ───
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  const d = digits.startsWith('7') ? digits : '7' + digits;
  let result = '+7';
  if (d.length > 1) result += ' (' + d.slice(1, 4);
  if (d.length > 4) result += ') ' + d.slice(4, 7);
  if (d.length > 7) result += '-' + d.slice(7, 9);
  if (d.length > 9) result += '-' + d.slice(9, 11);
  return result;
}

function unformatPhone(value: string): string {
  return value.replace(/\D/g, '');
}

// ─── Card Number Formatter ───
function formatCard(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

// ─── Slide Variants ───
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onClose,
  cartItems,
  totalAmount,
  discount,
  deliveryCost,
}) => {
  const { createOrder, removeFromCart } = useApp();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderError, setOrderError] = useState('');

  // ─── Form State ───
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+7');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Москва');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup'>('courier');
  const [comment, setComment] = useState('');

  // Payment fields (fake)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grandTotal = totalAmount + deliveryCost;

  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!name.trim()) newErrors.name = 'Введите имя';
      const phoneDigits = unformatPhone(phone);
      if (phoneDigits.length < 11) newErrors.phone = 'Введите корректный номер';
    }

    if (step === 1) {
      if (!city.trim()) newErrors.city = 'Введите город';
      if (deliveryMethod === 'courier' && !address.trim()) {
        newErrors.address = 'Введите адрес доставки';
      }
    }

    if (step === 2) {
      const cardDigits = cardNumber.replace(/\D/g, '');
      if (cardDigits.length < 16) newErrors.cardNumber = 'Введите 16 цифр карты';
      const expiryDigits = cardExpiry.replace(/\D/g, '');
      if (expiryDigits.length < 4) newErrors.cardExpiry = 'Введите срок действия';
      if (cardCvv.length < 3) newErrors.cardCvv = 'Введите CVV';
      if (!cardHolder.trim()) newErrors.cardHolder = 'Введите имя владельца';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [step, name, phone, city, address, deliveryMethod, cardNumber, cardExpiry, cardCvv, cardHolder]);

  const goNext = useCallback(async () => {
    if (!validateStep()) return;

    if (step === 2) {
      // Process payment (fake)
      setIsProcessing(true);
      setOrderError('');

      // Simulate 2s payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        const customer: CustomerInfo = {
          name,
          phone: unformatPhone(phone),
          email,
          address,
          city,
          deliveryMethod,
          comment,
        };

        const orderData: OrderData = {
          customer,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            moySkladId: item.product.moySkladId,
            quantity: item.quantity,
            price: item.product.salePrice ?? item.product.price,
            size: item.selectedSize,
            color: item.selectedColor,
            title: item.product.title,
          })),
          discount,
          deliveryCost,
          totalAmount: grandTotal,
        };

        const result = await createOrder(orderData);
        if (result.success) {
          setOrderNumber(result.orderNumber || `WEB-${Math.floor(10000 + Math.random() * 90000)}`);
          // Clear cart
          cartItems.forEach((item) =>
            removeFromCart(item.product.id, item.selectedSize, item.selectedColor),
          );
          setDirection(1);
          setStep(3);
        } else {
          setOrderError(result.error || 'Ошибка оформления заказа');
        }
      } catch (err: any) {
        setOrderError(err.message || 'Непредвиденная ошибка');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setDirection(1);
    setStep((s) => s + 1);
  }, [step, validateStep, name, phone, email, address, city, deliveryMethod, comment, cartItems, discount, deliveryCost, grandTotal, createOrder, removeFromCart]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 11) {
      setPhone(formatPhone(raw));
    }
    setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-white border ${
      errors[field] ? 'border-red-400 ring-1 ring-red-200' : 'border-[#E6E0E9]'
    } rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:border-[#9E7B9B] focus:ring-1 focus:ring-[#9E7B9B]/30 transition-all placeholder:text-[#8E8691]`;

  // ─── Step Renderers ───

  const renderContactStep = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#9E7B9B]" /> Имя и фамилия *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
          placeholder="Анна Иванова"
          className={inputClass('name')}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#9E7B9B]" /> Телефон *
        </label>
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="+7 (___) ___-__-__"
          className={inputClass('phone')}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-[#9E7B9B]" /> Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="anna@example.com"
          className={inputClass('email')}
        />
      </div>
    </div>
  );

  const renderDeliveryStep = () => (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#9E7B9B]" /> Город
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => { setCity(e.target.value); setErrors((p) => ({ ...p, city: '' })); }}
          placeholder="Москва"
          className={inputClass('city')}
        />
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
      </div>

      <div>
        <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2 block">Способ доставки</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDeliveryMethod('courier')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              deliveryMethod === 'courier'
                ? 'border-[#9E7B9B] bg-[#9E7B9B]/5 shadow-sm'
                : 'border-[#E6E0E9] hover:border-[#9E7B9B]/40'
            }`}
          >
            <Truck className={`w-5 h-5 ${deliveryMethod === 'courier' ? 'text-[#9E7B9B]' : 'text-[#8E8691]'}`} />
            <span className={`text-xs font-semibold ${deliveryMethod === 'courier' ? 'text-[#9E7B9B]' : 'text-[#8E8691]'}`}>Курьер</span>
          </button>
          <button
            type="button"
            onClick={() => setDeliveryMethod('pickup')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              deliveryMethod === 'pickup'
                ? 'border-[#9E7B9B] bg-[#9E7B9B]/5 shadow-sm'
                : 'border-[#E6E0E9] hover:border-[#9E7B9B]/40'
            }`}
          >
            <Store className={`w-5 h-5 ${deliveryMethod === 'pickup' ? 'text-[#9E7B9B]' : 'text-[#8E8691]'}`} />
            <span className={`text-xs font-semibold ${deliveryMethod === 'pickup' ? 'text-[#9E7B9B]' : 'text-[#8E8691]'}`}>Самовывоз</span>
          </button>
        </div>
      </div>

      {deliveryMethod === 'courier' && (
        <div>
          <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#9E7B9B]" /> Адрес доставки *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: '' })); }}
            placeholder="ул. Примерная, д. 1, кв. 10"
            className={inputClass('address')}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
      )}

      {deliveryMethod === 'pickup' && (
        <div className="p-4 bg-white border border-[#E6E0E9] rounded-xl text-xs text-[#8E8691]">
          <p className="font-semibold text-[#1A1A1A] mb-1">Пункт выдачи</p>
          <p>г. Москва, ул. Тверская, д. 15, стр. 2</p>
          <p className="text-[10px] mt-1">Пн–Пт: 10:00–20:00, Сб–Вс: 11:00–18:00</p>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-[#9E7B9B]" /> Комментарий
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Любые пожелания к доставке..."
          rows={3}
          className={`${inputClass('comment')} resize-none`}
        />
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-5">
      {/* Card visual */}
      <div className="relative bg-gradient-to-br from-[#1A1A1A] via-[#2d2d2d] to-[#4A5568] rounded-2xl p-5 text-white shadow-xl aspect-[1.7/1] max-h-[180px] flex flex-col justify-between overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="flex justify-between items-start relative z-10">
          <div className="w-10 h-7 bg-gradient-to-r from-amber-300 to-amber-500 rounded-md" />
          <CreditCard className="w-6 h-6 text-white/60" />
        </div>
        <div className="relative z-10">
          <p className="text-sm tracking-[0.2em] font-mono mb-2">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>
          <div className="flex justify-between text-[10px] text-white/70 uppercase">
            <span>{cardHolder || 'CARDHOLDER NAME'}</span>
            <span>{cardExpiry || 'MM/YY'}</span>
          </div>
        </div>
      </div>

      {/* Card inputs */}
      <div>
        <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-[#9E7B9B]" /> Номер карты
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => { setCardNumber(formatCard(e.target.value)); setErrors((p) => ({ ...p, cardNumber: '' })); }}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          className={`${inputClass('cardNumber')} font-mono tracking-wider`}
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 block">Срок</label>
          <input
            type="text"
            value={cardExpiry}
            onChange={(e) => { setCardExpiry(formatExpiry(e.target.value)); setErrors((p) => ({ ...p, cardExpiry: '' })); }}
            placeholder="MM/YY"
            maxLength={5}
            className={`${inputClass('cardExpiry')} font-mono`}
          />
          {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 block">CVV</label>
          <input
            type="password"
            value={cardCvv}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 3);
              setCardCvv(v);
              setErrors((p) => ({ ...p, cardCvv: '' }));
            }}
            placeholder="•••"
            maxLength={3}
            className={`${inputClass('cardCvv')} font-mono tracking-[0.3em]`}
          />
          {errors.cardCvv && <p className="text-red-500 text-xs mt-1">{errors.cardCvv}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5 block">Имя владельца</label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => { setCardHolder(e.target.value.toUpperCase()); setErrors((p) => ({ ...p, cardHolder: '' })); }}
          placeholder="ANNA IVANOVA"
          className={`${inputClass('cardHolder')} uppercase tracking-wider`}
        />
        {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
      </div>

      <div className="flex items-center gap-2 text-[10px] text-[#8E8691]">
        <Lock className="w-3.5 h-3.5" />
        <span>Данные защищены 256-bit SSL шифрованием</span>
      </div>

      {orderError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{orderError}</span>
        </div>
      )}
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="flex flex-col items-center justify-center text-center py-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="relative mb-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
        >
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 rounded-full border-2 border-green-400"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0.4 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="absolute inset-0 rounded-full border-2 border-green-300"
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl font-serif mb-2"
      >
        Заказ №{orderNumber} оформлен!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="text-xs text-[#8E8691] mb-6 max-w-xs font-light leading-relaxed"
      >
        Благодарим за покупку! Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full bg-white border border-[#E6E0E9] rounded-xl p-4 text-left text-xs space-y-2 mb-6"
      >
        <div className="flex justify-between text-[#8E8691]">
          <span>Имя</span>
          <span className="font-medium text-[#1A1A1A]">{name}</span>
        </div>
        <div className="flex justify-between text-[#8E8691]">
          <span>Телефон</span>
          <span className="font-medium text-[#1A1A1A]">{phone}</span>
        </div>
        <div className="flex justify-between text-[#8E8691]">
          <span>Доставка</span>
          <span className="font-medium text-[#1A1A1A]">{deliveryMethod === 'courier' ? 'Курьер' : 'Самовывоз'}</span>
        </div>
        <div className="border-t border-[#E6E0E9] pt-2 flex justify-between font-semibold text-sm">
          <span className="font-serif">Итого</span>
          <span className="text-[#9E7B9B]">{grandTotal.toLocaleString('ru-RU')} ₽</span>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        onClick={onClose}
        className="px-6 py-3 bg-[#9E7B9B] text-white rounded-xl text-sm font-semibold hover:bg-[#8A6B87] transition-colors shadow-md active:scale-95"
      >
        Вернуться к покупкам
      </motion.button>
    </div>
  );

  const stepRenderers = [renderContactStep, renderDeliveryStep, renderPaymentStep, renderConfirmationStep];

  return (
    <div className="flex flex-col h-full">
      {step < 3 && (
        <div className="px-4 sm:px-6 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < step
                        ? 'bg-[#9E7B9B] text-white'
                        : i === step
                        ? 'bg-[#9E7B9B] text-white shadow-md shadow-[#9E7B9B]/30 scale-110'
                        : 'bg-[#E6E0E9] text-[#8E8691]'
                    }`}
                  >
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[9px] font-medium ${i <= step ? 'text-[#9E7B9B]' : 'text-[#8E8691]'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mt-[-14px] rounded-full transition-all ${i < step ? 'bg-[#9E7B9B]' : 'bg-[#E6E0E9]'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {stepRenderers[step]()}
              </motion.div>
            </AnimatePresence>
          </div>

          {step < 3 && (
            <div className="hidden lg:block w-64 shrink-0">
              <div className="bg-white border border-[#E6E0E9] rounded-xl p-4 sticky top-0">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] mb-3">Ваш заказ</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 text-[10px]">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-[#F6F4F0] shrink-0">
                        <img src={item.product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1A1A1A] truncate">{item.product.title}</p>
                        <p className="text-[#8E8691]">{item.quantity} × {(item.product.salePrice ?? item.product.price).toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E6E0E9] pt-3 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-[#8E8691]">
                    <span>Товары</span>
                    <span className="font-medium text-[#1A1A1A]">{totalAmount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#9E7B9B]">
                      <span>Скидка</span>
                      <span>-{Math.round(totalAmount * discount / (1 - discount)).toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#8E8691]">
                    <span>Доставка</span>
                    <span className="font-medium text-[#1A1A1A]">{deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#E6E0E9]">
                    <span className="font-serif">Итого</span>
                    <span className="text-[#9E7B9B]">{grandTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {step < 3 && (
        <div className="p-4 sm:p-6 bg-white border-t border-[#E6E0E9] shadow-[0_-4px_24px_rgba(0,0,0,0.03)] pb-safe">
          <div className="lg:hidden flex justify-between text-sm font-bold mb-3">
            <span className="font-serif">Итого</span>
            <span className="text-[#9E7B9B]">{grandTotal.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex gap-3 pb-16 lg:pb-0">
            {step > 0 && (
              <button
                onClick={goBack}
                disabled={isProcessing}
                className="px-4 py-3 border border-[#E6E0E9] rounded-xl text-sm font-medium text-[#1A1A1A] hover:bg-[#F6F4F0] transition-colors active:scale-95 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={goNext}
              disabled={isProcessing}
              className="flex-1 py-3 bg-[#9E7B9B] hover:bg-[#8A6B87] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Обработка платежа...
                </>
              ) : step === 2 ? (
                <>
                  <Lock className="w-4 h-4" />
                  Оплатить {grandTotal.toLocaleString('ru-RU')} ₽
                </>
              ) : (
                'Продолжить'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
