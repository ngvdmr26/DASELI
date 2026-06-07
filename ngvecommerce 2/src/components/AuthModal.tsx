import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Phone, ArrowRight, CheckCircle, Sparkles,
  ChevronLeft, RefreshCw, ShieldCheck,
} from 'lucide-react';

// ─── Config (замените на реальные значения) ───────────────────────────────────
// Google: https://console.cloud.google.com → OAuth 2.0 Client ID (Web application)
// В Authorised origins добавьте ваш домен (например http://localhost:5173 для dev)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Telegram: создайте бота через @BotFather, затем в настройках бота разрешите
// Telegram Login Widget и укажите домен сайта
const TELEGRAM_BOT_NAME = import.meta.env.VITE_TELEGRAM_BOT || '';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  name: string;
  phone?: string;
  email?: string;
  avatar?: string;
  provider: 'phone' | 'google' | 'telegram';
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

type AuthView = 'welcome' | 'phone' | 'otp' | 'success';

// ─── Google GSI types ─────────────────────────────────────────────────────────
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: object) => void;
          prompt: (cb?: (n: { isNotDisplayed(): boolean; isSkippedMoment(): boolean }) => void) => void;
          renderButton: (el: HTMLElement, cfg: object) => void;
          disableAutoSelect: () => void;
        };
      };
    };
    handleTelegramAuth?: (user: TelegramUser) => void;
    onGoogleLibraryLoad?: () => void;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

// ─── Google SVG ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// ─── Phone formatter ──────────────────────────────────────────────────────────
function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const d = digits.startsWith('7') ? digits : '7' + digits;
  let r = '+7';
  if (d.length > 1) r += ' (' + d.slice(1, 4);
  if (d.length > 4) r += ') ' + d.slice(4, 7);
  if (d.length > 7) r += '-' + d.slice(7, 9);
  if (d.length > 9) r += '-' + d.slice(9, 11);
  return r;
}

function phoneDigits(v: string) { return v.replace(/\D/g, ''); }

// ─── FloatingOrb ─────────────────────────────────────────────────────────────
const FloatingOrb = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -18, 0], opacity: [0.25, 0.55, 0.25] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ─── OTP Input Row ────────────────────────────────────────────────────────────
interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange }) => {
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const digits = value.padEnd(6, '').split('').slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const next = value.slice(0, -1);
      onChange(next);
      if (i > 0) refs[i - 1].current?.focus();
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    if (!char) return;
    const arr = value.padEnd(6, '').split('');
    arr[i] = char;
    const next = arr.join('').slice(0, 6).replace(/ /g, '');
    onChange(next.trimEnd() === value.trimEnd() ? next : next);
    if (i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) { onChange(pasted); refs[Math.min(pasted.length, 5)].current?.focus(); }
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center">
      {refs.map((ref, i) => (
        <motion.input
          key={i}
          ref={ref}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] === ' ' ? '' : digits[i]}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          className={`w-11 h-13 text-center text-xl font-bold rounded-2xl border-2 outline-none transition-all bg-white ${
            digits[i] && digits[i] !== ' '
              ? 'border-[#9E7B9B] text-[#2D252E] shadow-[0_0_0_4px_rgba(158,123,155,0.12)]'
              : 'border-[#E8DEEB] text-[#2D252E] focus:border-[#9E7B9B] focus:shadow-[0_0_0_4px_rgba(158,123,155,0.1)]'
          }`}
        />
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [view, setView] = useState<AuthView>('welcome');
  const [phone, setPhone] = useState('+7');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const telegramRef = useRef<HTMLDivElement>(null);
  const gsiLoaded = useRef(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setView('welcome');
      setPhone('+7'); setOtp(''); setOtpError(''); setPhoneError('');
      setIsLoading(false); setCountdown(0);
    }
  }, [isOpen]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // ── Success helper ────────────────────────────────────────────────────────
  const handleSuccess = useCallback((user: AuthUser) => {
    setSuccessUser(user);
    setView('success');
    setIsLoading(false);
    setTimeout(() => { onLogin(user); onClose(); }, 2000);
  }, [onLogin, onClose]);

  // ── Google OAuth (GSI) ────────────────────────────────────────────────────
  const loadGSI = useCallback(() => {
    if (gsiLoaded.current || !GOOGLE_CLIENT_ID) return;
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => {
      gsiLoaded.current = true;
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => {
          // Decode JWT payload (user info)
          try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            handleSuccess({
              name: payload.name || payload.email,
              email: payload.email,
              avatar: payload.picture,
              provider: 'google',
            });
          } catch { /* ignore */ }
        },
        use_fedcm_for_prompt: false,
      });
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: 'standard',
          shape: 'rectangular',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          locale: 'ru',
          width: googleBtnRef.current.offsetWidth || 320,
        });
      }
    };
    document.head.appendChild(s);
  }, [handleSuccess]);

  useEffect(() => {
    if (isOpen) loadGSI();
  }, [isOpen, loadGSI]);

  // ── Telegram Login Widget ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !TELEGRAM_BOT_NAME || !telegramRef.current) return;
    // Clear previous
    telegramRef.current.innerHTML = '';

    window.handleTelegramAuth = (tgUser: TelegramUser) => {
      handleSuccess({
        name: [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' '),
        avatar: tgUser.photo_url,
        provider: 'telegram',
      });
    };

    const s = document.createElement('script');
    s.src = 'https://telegram.org/js/telegram-widget.js?22';
    s.setAttribute('data-telegram-login', TELEGRAM_BOT_NAME);
    s.setAttribute('data-size', 'large');
    s.setAttribute('data-onauth', 'handleTelegramAuth(user)');
    s.setAttribute('data-request-access', 'write');
    s.setAttribute('data-lang', 'ru');
    s.async = true;
    telegramRef.current.appendChild(s);
  }, [isOpen, handleSuccess]);

  // ── Phone send OTP ────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (phoneDigits(phone).length < 11) {
      setPhoneError('Введите корректный номер телефона');
      return;
    }
    setPhoneError('');
    setIsLoading(true);
    // TODO: replace with real SMS API call
    // await fetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) })
    await new Promise(r => setTimeout(r, 800)); // simulated delay
    setIsLoading(false);
    setOtp('');
    setCountdown(60);
    setView('otp');
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length < 6) { setOtpError('Введите 6-значный код'); return; }
    setOtpError('');
    setIsLoading(true);
    // TODO: replace with real verification
    // const res = await fetch('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) })
    await new Promise(r => setTimeout(r, 900));
    // Demo: any 6-digit code works. In production — check server response
    handleSuccess({ name: phone, phone, provider: 'phone' });
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setIsLoading(false);
    setOtp('');
    setCountdown(60);
  };

  // Auto-verify when all 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && view === 'otp' && !isLoading) {
      handleVerifyOtp();
    }
  }, [otp]);

  // ─── View: Welcome ────────────────────────────────────────────────────────
  const renderWelcome = () => (
    <div className="flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-center mb-1">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-[16px] mx-auto mb-3 overflow-hidden shadow-lg ring-2 ring-[#9E7B9B]/20"
        >
          <img src="/icon-192.png" alt="DASELI" className="w-full h-full object-cover" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="text-[21px] font-serif font-semibold text-[#2D252E] mb-1">
          Войдите в DASELI
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
          className="text-xs text-[#827585] font-light leading-relaxed max-w-[260px] mx-auto">
          Для оформления заказов и доступа к персональным предложениям
        </motion.p>
      </motion.div>

      {/* Google Button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {GOOGLE_CLIENT_ID ? (
          <div ref={googleBtnRef} className="w-full overflow-hidden rounded-2xl" style={{ minHeight: 44 }} />
        ) : (
          <button
            onClick={() => alert('VITE_GOOGLE_CLIENT_ID не задан в .env файле')}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 border-[#E8DEEB] bg-white text-sm font-semibold text-[#2D252E] hover:border-[#4285F4] hover:shadow-[0_4px_20px_rgba(66,133,244,0.15)] transition-all cursor-pointer"
          >
            <GoogleIcon />
            <span>Продолжить через Google</span>
            <ArrowRight className="h-4 w-4 ml-auto text-[#4285F4]" />
          </button>
        )}
      </motion.div>

      {/* Telegram Button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        {TELEGRAM_BOT_NAME ? (
          <div ref={telegramRef} className="w-full flex justify-center overflow-hidden rounded-2xl" style={{ minHeight: 44 }} />
        ) : (
          <button
            onClick={() => alert('VITE_TELEGRAM_BOT не задан в .env файле')}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl border-2 border-[#E8DEEB] bg-white text-sm font-semibold text-[#2D252E] hover:border-[#27A7E7] hover:shadow-[0_4px_20px_rgba(39,167,231,0.15)] transition-all cursor-pointer"
          >
            <span className="text-[#27A7E7]"><TelegramIcon /></span>
            <span>Войти через Telegram</span>
            <ArrowRight className="h-4 w-4 ml-auto text-[#27A7E7]" />
          </button>
        )}
      </motion.div>

      {/* Divider */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#E8DEEB]" />
        <span className="text-[10px] font-semibold text-[#C9B0C7] uppercase tracking-widest">или</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#E8DEEB]" />
      </motion.div>

      {/* Phone button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setView('phone')}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#9E7B9B] to-[#7B5778] text-white text-sm font-semibold shadow-lg shadow-[#9E7B9B]/25 hover:shadow-[#9E7B9B]/40 transition-shadow flex items-center justify-center gap-2 cursor-pointer"
      >
        <Phone className="h-4 w-4" />
        Войти по номеру телефона
      </motion.button>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="text-center text-[10px] text-[#C9B0C7] leading-relaxed">
        Входя, вы соглашаетесь с{' '}
        <span className="text-[#9E7B9B] cursor-pointer hover:underline">условиями использования</span>
      </motion.p>
    </div>
  );

  // ─── View: Phone ──────────────────────────────────────────────────────────
  const renderPhone = () => (
    <div className="flex flex-col gap-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9E7B9B]/20 to-[#7B5778]/10 flex items-center justify-center mx-auto mb-3">
          <Phone className="h-6 w-6 text-[#9E7B9B]" />
        </div>
        <h2 className="text-[19px] font-serif font-semibold text-[#2D252E] mb-1">Номер телефона</h2>
        <p className="text-xs text-[#827585] font-light">Отправим SMS с кодом подтверждения</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#9E7B9B] mb-1.5 block">
          Ваш номер
        </label>
        <div className={`flex items-center rounded-2xl border-2 transition-all bg-white ${
          phoneError ? 'border-red-400' : 'border-[#E8DEEB] focus-within:border-[#9E7B9B] focus-within:shadow-[0_0_0_4px_rgba(158,123,155,0.12)]'
        }`}>
          <span className="pl-4 text-[#9E7B9B]"><Phone className="h-4 w-4" /></span>
          <input
            type="tel"
            value={phone}
            onChange={e => {
              const raw = e.target.value.replace(/\D/g, '');
              if (raw.length <= 11) setPhone(formatPhone(raw));
              setPhoneError('');
            }}
            placeholder="+7 (___) ___-__-__"
            className="flex-1 px-3 py-3.5 bg-transparent text-sm text-[#2D252E] placeholder:text-[#C9B0C7] outline-none"
            autoFocus
          />
        </div>
        <AnimatePresence>
          {phoneError && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="text-red-500 text-[11px] mt-1 ml-1">{phoneError}</motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-start gap-2.5 bg-[#F6F2F8] rounded-2xl p-3">
          <ShieldCheck className="h-4 w-4 text-[#9E7B9B] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#827585] leading-relaxed">
            Мы никогда не передаём ваш номер третьим лицам и не отправляем рекламные звонки
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSendOtp}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#9E7B9B] to-[#7B5778] text-white text-sm font-semibold shadow-lg shadow-[#9E7B9B]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {isLoading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
        ) : (
          <>Получить код <ArrowRight className="h-4 w-4" /></>
        )}
      </motion.button>
    </div>
  );

  // ─── View: OTP ────────────────────────────────────────────────────────────
  const renderOtp = () => (
    <div className="flex flex-col gap-5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9E7B9B]/20 to-[#7B5778]/10 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="h-6 w-6 text-[#9E7B9B]" />
        </div>
        <h2 className="text-[19px] font-serif font-semibold text-[#2D252E] mb-1">Код из SMS</h2>
        <p className="text-xs text-[#827585] font-light">
          Отправили на <span className="font-semibold text-[#2D252E]">{phone}</span>
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <OtpInput value={otp} onChange={v => { setOtp(v); setOtpError(''); }} />
        <AnimatePresence>
          {otpError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center text-red-500 text-[11px] mt-2">{otpError}</motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
              className="w-5 h-5 border-2 border-[#E8DEEB] border-t-[#9E7B9B] rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resend */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-center">
        {countdown > 0 ? (
          <p className="text-xs text-[#C9B0C7]">
            Повторная отправка через <span className="font-semibold text-[#9E7B9B]">{countdown} с</span>
          </p>
        ) : (
          <button onClick={handleResendOtp} disabled={isLoading}
            className="text-xs font-semibold text-[#9E7B9B] hover:text-[#7B5778] flex items-center gap-1.5 mx-auto cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5" /> Отправить код снова
          </button>
        )}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleVerifyOtp}
        disabled={otp.length < 6 || isLoading}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#9E7B9B] to-[#7B5778] text-white text-sm font-semibold shadow-lg shadow-[#9E7B9B]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 transition-opacity"
      >
        {isLoading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
        ) : (
          <>Подтвердить <CheckCircle className="h-4 w-4" /></>
        )}
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        onClick={() => { setView('phone'); setOtp(''); setOtpError(''); }}
        className="text-center text-xs text-[#C9B0C7] hover:text-[#9E7B9B] transition-colors cursor-pointer"
      >
        Изменить номер
      </motion.button>
    </div>
  );

  // ─── View: Success ────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9E7B9B] to-[#7B5778] flex items-center justify-center shadow-xl shadow-[#9E7B9B]/30">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        {[1.4, 1.9, 2.4].map((scale, i) => (
          <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-[#9E7B9B]"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale, opacity: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 1 }} />
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-xl font-serif font-semibold text-[#2D252E] mb-1">
          Добро пожаловать{successUser?.name ? `, ${successUser.name.split(/[ (]/)[0]}` : ''}!
        </h3>
        <p className="text-xs text-[#827585] font-light max-w-[200px] mx-auto">Вы успешно вошли в аккаунт DASELI</p>
      </motion.div>
    </div>
  );

  const views: Record<AuthView, React.ReactNode> = {
    welcome: renderWelcome(),
    phone: renderPhone(),
    otp: renderOtp(),
    success: renderSuccess(),
  };

  const canGoBack = view === 'phone' || view === 'otp';
  const handleBack = () => {
    if (view === 'otp') { setView('phone'); setOtp(''); }
    else setView('welcome');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="auth-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div key="auth-panel"
            initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-[390px] pointer-events-auto">
              <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-[#9E7B9B]/20 via-transparent to-[#7B5778]/15 blur-xl pointer-events-none" />

              <div className="relative rounded-[28px] bg-white shadow-[0_32px_80px_rgba(45,37,46,0.18),0_0_0_1px_rgba(232,222,235,0.8)] overflow-hidden">
                {/* Top gradient strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#9E7B9B] via-[#C9A0C7] to-[#7B5778]" />

                {/* Decorative orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <FloatingOrb style={{ width: 110, height: 110, top: -35, right: -25, background: 'radial-gradient(circle, rgba(158,123,155,0.12) 0%, transparent 70%)' }} />
                  <FloatingOrb style={{ width: 70, height: 70, bottom: 10, left: -15, background: 'radial-gradient(circle, rgba(123,87,120,0.08) 0%, transparent 70%)' }} />
                </div>

                {/* Header controls */}
                <div className="relative flex items-center justify-between px-6 pt-5 pb-1">
                  <AnimatePresence>
                    {canGoBack && (
                      <motion.button key="back" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}
                        onClick={handleBack}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#9E7B9B] hover:text-[#7B5778] transition-colors cursor-pointer">
                        <ChevronLeft className="h-4 w-4" /> Назад
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[11px] font-bold tracking-[0.2em] text-[#9E7B9B] uppercase absolute left-1/2 -translate-x-1/2">
                    DASELI
                  </motion.span>

                  <button onClick={onClose}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F2F8] text-[#827585] hover:bg-[#9E7B9B] hover:text-white transition-all cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-7 pt-3 relative">
                  <AnimatePresence mode="wait">
                    <motion.div key={view}
                      initial={{ opacity: 0, x: canGoBack && view !== 'success' ? -16 : 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {views[view]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
