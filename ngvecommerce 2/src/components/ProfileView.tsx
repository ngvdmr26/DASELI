import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Bell, ShoppingBag, Truck, MessageSquare, RefreshCw, 
  ChevronRight, Star, CheckCircle, Clock, AlertCircle, Edit2, 
  X, Check, Send, Award, HelpCircle 
} from 'lucide-react';
import { mockProducts } from '../data';

// Mock data for historic purchases
const initialPurchases = [
  {
    id: 'ord_101',
    productId: '1', // Комплект из умягченного льна
    title: 'Комплект из умягченного льна "Pure Linen"',
    price: 14500,
    size: 'Евро',
    color: 'Бежевый',
    date: '12 мая 2026',
    status: 'Доставлен',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=200',
    returned: false
  },
  {
    id: 'ord_102',
    productId: '5', // Набор бамбуковых полотенец
    title: 'Набор бамбуковых полотенец "Soft Bamboo"',
    price: 3800,
    size: 'Набор 3 шт.',
    color: 'Белый',
    date: '28 апреля 2026',
    status: 'Доставлен',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=200',
    returned: false
  }
];

// Mock data for Waiting List / Active shipments
const activeShipments = [
  {
    id: 'ship_201',
    productId: '2', // Шелковое белье "Sateen Gold"
    title: 'Шелковое постельное белье "Sateen Gold"',
    price: 16900,
    size: 'Евро',
    color: 'Золотистый сатин',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=200',
    deliveryStage: 3, // out of 4 (1: Оформлен, 2: Собран, 3: В пути СДЭК, 4: Готов к выдаче)
    location: 'В пути • Транзит Казань',
    eta: 'Завтра, 31 мая'
  }
];

// Mock initial reviews
const initialReviews = [
  {
    id: 'rev_1',
    productId: '1',
    rating: 5,
    text: 'Качество белья просто бесподобное! Лен мягкий, плотный, тактильно спать одно наслаждение. Цвет точно как на фото аккаунта @daseli_textile. Буду заказывать еще!',
    response: 'Благодарим вас за отзыв, Екатерина! Будем рады видеть вас у нас снова!'
  }
];

// Mock questions
const initialQuestions = [
  {
    id: 'q_1',
    productId: '7', // Гусиное одеяло
    question: 'Подойдет ли это одеяло для жаркого лета, или лучше выбрать более тонкое?',
    answer: 'Здравствуйте! Одеяло Cloud Comfort является всесезонным и отлично регулирует температуру, однако для знойного лета мы рекомендуем обратить внимание на комплекты из тонкого умягченного льна.'
  }
];

// Mock Notifications
const initialNotifications = [
  {
    id: 'not_1',
    title: 'Заказ отправлен',
    text: 'Шелковый комплект "Sateen Gold" передан курьеру СДЭК и уже в пути к вам!',
    time: '2 часа назад',
    unread: true
  },
  {
    id: 'not_2',
    title: 'Дарим 1000 бонусов',
    text: 'Бонусы за вступление в Клуб Дасели начислены на ваш баланс. Тратьте на любой декор!',
    time: '3 дня назад',
    unread: false
  }
];

export const ProfileView = () => {
  const { setActiveTab } = useApp();
  const [profileTab, setProfileTab] = useState<'purchases' | 'waiting' | 'reviews' | 'returns' | 'notifications'>('purchases');
  
  // States to make them fully dynamic/interactive
  const [userName, setUserName] = useState('Мадина Нагоева');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('Мадина Нагоева');

  const [purchases, setPurchases] = useState(initialPurchases);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [reviews, setReviews] = useState(initialReviews);
  const [questions, setQuestions] = useState(initialQuestions);

  // Return interaction states
  const [selectedProductForReturn, setSelectedProductForReturn] = useState<string>('');
  const [returnReason, setReturnReason] = useState('Не подошел размер/цвет');
  const [returnDetails, setReturnDetails] = useState('');
  const [returnSuccess, setReturnSuccess] = useState(false);

  // Read all notification action
  const markAllRead = () => {
    setNotifications(prev => prev.map(not => ({ ...not, unread: false })));
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      setIsEditingName(false);
    }
  };

  const handleInitReturn = (productId: string) => {
    setSelectedProductForReturn(productId);
    setProfileTab('returns');
    setReturnSuccess(false);
  };

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForReturn) return;
    
    // Mark order as returned
    setPurchases(prev => 
      prev.map(p => p.productId === selectedProductForReturn ? { ...p, returned: true } : p)
    );
    setReturnSuccess(true);
    setTimeout(() => {
      setSelectedProductForReturn('');
      setReturnDetails('');
      setProfileTab('purchases');
    }, 3000);
  };

  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  return (
    <div className="py-2.5 max-w-5xl mx-auto px-1 tracking-tight">
      {/* Profile Header Block */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-border/40 shadow-sm mb-8 relative overflow-hidden">
        {/* Aesthetic background mesh glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 border-2 border-accent text-accent rounded-full flex items-center justify-center text-2xl font-serif font-bold shadow-sm relative">
              {userName.substring(0, 2).toUpperCase()}
              <div className="absolute bottom-0 right-0 bg-accent text-white p-1 rounded-full border border-white shadow-sm">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                {isEditingName ? (
                  <div className="flex items-center gap-2 bg-[#F7F5F0] px-2 py-1 rounded-xl">
                    <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="text-lg font-serif outline-none bg-transparent w-40"
                      autoFocus
                    />
                    <button onClick={handleSaveName} className="p-1 hover:text-green-600">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsEditingName(false)} className="p-1 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl font-serif font-medium">{userName}</h2>
                    <button 
                      onClick={() => { setTempName(userName); setIsEditingName(true); }}
                      className="text-muted hover:text-accent p-1 transition-colors"
                      title="Редактировать имя"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-muted font-light mt-1">Клиент Daseli Textile с мая 2026 г.</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-3.5 justify-center sm:justify-start">
                <span className="text-[10px] bg-accent/10 text-accent font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  ★ Особый статус: VIP Клуб
                </span>
                <span className="text-[10px] bg-orange-100 text-orange-800 font-semibold px-2.5 py-0.5 rounded-full">
                  Золотая скидка клиента 15%
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 sm:gap-8 w-full md:w-auto border-t md:border-t-0 border-border/50 pt-4 md:pt-0 justify-around text-center shrink-0">
            <div>
              <span className="text-lg font-serif font-bold text-accent">14 500 ₽</span>
              <p className="text-[10px] text-muted font-light mt-0.5">Всего покупок</p>
            </div>
            <div className="border-l border-border/50 h-8 self-center" />
            <div>
              <span className="text-lg font-serif font-bold text-accent">1 000</span>
              <p className="text-[10px] text-muted font-light mt-0.5">Бонусный баланс</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="sticky top-16 z-10 mb-6 rounded-[26px] border border-[#E8E0E8] bg-[#F6F1F6] px-3 py-2.5 shadow-[0_8px_24px_rgba(45,37,46,0.05)]">
        <div className="flex w-full items-center justify-between gap-2">
        {[
          { id: 'purchases', label: 'Покупки', icon: ShoppingBag },
          { id: 'waiting', label: 'Лист ожидания', icon: Truck, alertCount: activeShipments.length },
          { id: 'reviews', label: 'Отзывы и вопросы', icon: MessageSquare },
          { id: 'returns', label: 'Возврат товара', icon: RefreshCw },
          { id: 'notifications', label: 'Уведомления', icon: Bell, alertCount: unreadNotificationsCount },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = profileTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setProfileTab(tab.id as any);
                setReturnSuccess(false);
              }}
              aria-label={tab.label}
              title={tab.label}
              className={`relative flex h-12 w-12 items-center justify-center rounded-[18px] transition-all cursor-pointer shrink-0 sm:h-[52px] sm:w-[52px] ${
                isActive
                  ? 'bg-white text-accent shadow-[0_5px_14px_rgba(158,123,155,0.2)] ring-1 ring-accent/35'
                  : 'text-[#8F8390] hover:bg-white/70 hover:text-accent'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {tab.alertCount !== undefined && tab.alertCount > 0 ? (
                <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-accent px-1 py-0.5 text-center text-[9px] font-bold leading-none text-white">
                  {tab.alertCount}
                </span>
              ) : null}
            </button>
          );
        })}
        </div>
      </div>

      {/* Profile Active Tab View Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={profileTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="min-h-[300px]"
        >
          {/* TAB 1: PURCHASES */}
          {profileTab === 'purchases' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">История ваших заказов</h3>
              {purchases.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border font-serif">Ничего не куплено ранее</div>
              ) : (
                purchases.map((ord) => (
                  <div key={ord.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-border/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={ord.image} alt={ord.title} className="w-14 h-14 object-cover rounded-xl" />
                      <div>
                        <span className="text-[9px] text-muted font-light block">ЗАКАЗ {ord.id} • {ord.date}</span>
                        <h4 className="text-sm font-serif font-semibold mt-0.5">{ord.title}</h4>
                        <div className="flex items-center gap-3 text-[11px] text-muted mt-1 font-light">
                          <span>Размер: <strong className="text-main font-semibold">{ord.size}</strong></span>
                          <span>|</span>
                          <span>Цвет: <strong className="text-main font-semibold">{ord.color}</strong></span>
                          <span>|</span>
                          <strong className="text-accent font-semibold">{ord.price.toLocaleString()} ₽</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 justify-between sm:justify-end shrink-0">
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Доставлен
                      </span>
                      {ord.returned ? (
                        <span className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-semibold">
                          Оформлен возврат
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleInitReturn(ord.productId)}
                          className="text-xs text-muted hover:text-accent font-semibold flex items-center gap-1.5 border border-border px-3 py-1.5 rounded-xl hover:bg-[#F7F5F0]"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Возврат
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: WAITING LIST */}
          {profileTab === 'waiting' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-2">Отслеживание активных заказов</h3>
              {activeShipments.map((ship) => (
                <div key={ship.id} className="bg-white rounded-3xl p-5 lg:p-6 border border-border/50 shadow-sm">
                  {/* Delivery header details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-border/45">
                    <div>
                      <span className="text-[10px] text-accent uppercase font-bold tracking-widest bg-accent/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                        ЭКСПРЕСС-ДОСТАВКА СДЭК
                      </span>
                      <h4 className="text-sm font-serif font-bold mt-1">ОТПРАВЛЕНИЕ {ship.id}</h4>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className="text-xs text-muted font-light block">Планируемая дата получения</span>
                      <span className="text-sm font-serif font-bold text-accent">{ship.eta}</span>
                    </div>
                  </div>

                  {/* Product card */}
                  <div className="flex gap-4 items-center mb-6">
                    <img src={ship.image} alt={ship.title} className="w-12 h-12 object-cover rounded-xl" />
                    <div>
                      <h5 className="text-xs font-semibold leading-tight">{ship.title}</h5>
                      <span className="text-[10px] text-muted font-light mt-0.5 block">{ship.size} • {ship.color}</span>
                    </div>
                  </div>

                  {/* Stepper with state-indicators */}
                  <div>
                    <div className="flex justify-between text-center relative mb-4">
                      {/* Stepper Connector Bar backgrounds */}
                      <div className="absolute top-[13px] left-8 right-8 h-0.5 bg-border -z-0" />
                      <div 
                        className="absolute top-[13px] left-8 h-0.5 bg-accent -z-0 transition-all duration-700" 
                        style={{ width: `${(ship.deliveryStage - 1) * 33}%` }} 
                      />

                      {[
                        { title: 'Оформлен', status: 'Принят', icon: Clock },
                        { title: 'Собран', status: 'Упакован', icon: Award },
                        { title: 'В пути', status: 'В СДЭК', icon: Truck },
                        { title: 'Выдача', status: 'Ждет вас', icon: CheckCircle },
                      ].map((step, idx) => {
                        const stepNum = idx + 1;
                        const isDone = stepNum <= ship.deliveryStage;
                        const isCurrent = stepNum === ship.deliveryStage;
                        const StepIcon = step.icon;

                        return (
                          <div key={idx} className="flex flex-col items-center w-20 relative z-10 select-none">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                              isDone 
                                ? 'bg-accent border-accent text-white shadow-sm' 
                                : 'bg-white border-border text-muted/60'
                            }`}>
                              <StepIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-[10px] font-bold mt-2 ${isDone ? 'text-accent' : 'text-muted'}`}>
                              {step.title}
                            </span>
                            <span className="text-[8px] text-muted/75 font-light mt-0.5">{step.status}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-[#F7F5F0] rounded-2xl p-3.5 mt-2 flex items-center gap-2.5 text-xs">
                      <AlertCircle className="w-4 h-4 text-accent shrink-0" />
                      <p className="font-light text-muted">
                        Текущий статус: <strong className="text-main font-semibold">{ship.location}</strong>. Ссылка для отслеживания отправлена на почту и СМС.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: REVIEWS & QUESTIONS */}
          {profileTab === 'reviews' && (
            <div className="flex flex-col gap-8">
              {/* Reviews Block */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Ваши отзывы на товары</h3>
                <div className="flex flex-col gap-4">
                  {reviews.map((rev) => {
                    const matchedProd = mockProducts.find(p => p.id === rev.productId);
                    return (
                      <div key={rev.id} className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm text-left">
                        {matchedProd && (
                          <div className="flex gap-3 items-center mb-3 pb-2 border-b border-border/30">
                            <img src={matchedProd.image} alt={matchedProd.title} className="w-9 h-9 object-cover rounded-lg" />
                            <div>
                              <h4 className="text-xs font-serif font-bold leading-tight">{matchedProd.title}</h4>
                              <span className="text-[9px] text-muted">{matchedProd.price.toLocaleString()} ₽</span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-1.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                            />
                          ))}
                        </div>

                        <p className="text-xs text-muted leading-relaxed font-light font-sans">{rev.text}</p>
                        
                        {rev.response && (
                          <div className="mt-3 bg-[#F7F5F0] rounded-xl p-3 text-xs">
                            <p className="text-[10px] uppercase font-bold text-accent tracking-wider mb-1">Ответ представителя бренда Daseli:</p>
                            <p className="font-light text-muted italic">"{rev.response}"</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Questions Block */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">История ваших вопросов по товарам</h3>
                <div className="flex flex-col gap-4">
                  {questions.map((q) => {
                    const matchedProd = mockProducts.find(p => p.id === q.productId);
                    return (
                      <div key={q.id} className="bg-white rounded-2xl p-4 border border-border/50 shadow-sm text-left">
                        {matchedProd && (
                          <div className="flex gap-3 items-center mb-3 pb-2 border-b border-border/30">
                            <img src={matchedProd.image} alt={matchedProd.title} className="w-9 h-9 object-cover rounded-lg" />
                            <h4 className="text-xs font-serif font-semibold leading-tight">{matchedProd.title}</h4>
                          </div>
                        )}

                        <div className="flex items-start gap-1.5 mb-2 text-xs">
                          <HelpCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <p className="font-medium text-main">{q.question}</p>
                        </div>
                        
                        <div className="bg-[#F7F5F0] rounded-xl p-3 text-xs">
                          <p className="text-[10px] uppercase font-bold text-accent tracking-wider mb-1">Служба заботы Daseli:</p>
                          <p className="font-light text-muted">{q.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RETURN OF GOODS */}
          {profileTab === 'returns' && (
            <div className="bg-white rounded-3xl p-5 lg:p-6 border border-border/50 shadow-sm max-w-lg mx-auto">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent text-center mb-6">Заявка на возврат товара</h3>
              
              {returnSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce" />
                  <h4 className="text-base font-serif font-bold mb-1">Заявка успешно принята!</h4>
                  <p className="text-xs text-muted font-light max-w-sm mx-auto leading-relaxed">
                    Наш менеджер по работе с рекламациями рассмотрит заявку в течение 24 часов. Инструкция СДЭК отправлена вам на почту.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReturn} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted uppercase block mb-1">Выберите товар для возврата</label>
                    <select 
                      value={selectedProductForReturn} 
                      onChange={(e) => setSelectedProductForReturn(e.target.value)}
                      className="w-full bg-[#F7F5F0] p-3 rounded-xl text-xs font-medium border-none outline-none focus:ring-1 focus:ring-accent"
                      required
                    >
                      <option value="">Выберите изделие из покупок...</option>
                      {purchases.map(ord => (
                        <option key={ord.productId} value={ord.productId}>
                          {ord.title} (куплено {ord.date})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted uppercase block mb-1">Причина возврата</label>
                    <select 
                      value={returnReason} 
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full bg-[#F7F5F0] p-3 rounded-xl text-xs font-medium border-none outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="Не подошел размер/цвет">Не подошел размер / цветовая гамма</option>
                      <option value="Производственный брак">Производственный дефект / брак по утку</option>
                      <option value="Не понравился материал">Фактура ткани отличается от ожидаемой</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted uppercase block mb-1">Подробные замечания</label>
                    <textarea 
                      value={returnDetails}
                      onChange={(e) => setReturnDetails(e.target.value)}
                      placeholder="Опишите ваши комментарии или дефекты для ускорения одобрения СДЭК..."
                      className="w-full bg-[#F7F5F0] p-3 rounded-xl text-xs font-light font-sans min-h-[100px] border-none outline-none focus:ring-1 focus:ring-accent h-24 duration-250"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3 bg-accent text-white rounded-xl text-xs font-semibold hover:bg-accent-hover transition-colors shadow-sm active:scale-95 duration-200 mt-2 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Отправить заявку на возврат
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {profileTab === 'notifications' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Ваши новые оповещения</h3>
                <button 
                  onClick={markAllRead} 
                  className="text-xs font-medium text-accent hover:text-accent-hover"
                >
                  Прочитать все
                </button>
              </div>

              {notifications.map((not) => (
                <div 
                  key={not.id} 
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 text-left transition-all shadow-sm ${
                    not.unread 
                      ? 'bg-white border-accent/30 ring-1 ring-accent/10' 
                      : 'bg-white/80 border-border/55 opacity-75'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${not.unread ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-500'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wide">{not.title}</h4>
                      <span className="text-[9.5px] text-muted font-light">{not.time}</span>
                    </div>
                    <p className="text-xs text-muted/90 font-light mt-1 leading-relaxed">{not.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
