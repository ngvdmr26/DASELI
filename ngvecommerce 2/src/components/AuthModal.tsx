import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Mail, Lock, Eye, EyeOff, User, ArrowRight,
  CheckCircle, Sparkles, ChevronLeft,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}

export interface AuthUser {
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google' | 'telegram';
}

type AuthView = 'welcome' | 'login' | 'register' | 'success';

// ─── Telegram SVG Icon ────────────────────────────────────────────────────────
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

// ─── Google SVG Icon ──────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ─── Floating particles background ───────────────────────────────────────────
const FloatingOrb = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ─── Input Field ─────────────────────────────────────────────────────────────
interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  delay?: number;
  extra?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  label, type, value, onChange, placeholder, icon, error, delay = 0, extra,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <label className="text-[10px] font-bold uppercase tracking-widest text-[#9E7B9B] mb-1.5 flex items-center justify-between">
        <span>{label}</span>
        {extra}
      </label>
      <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 bg-white ${
        error ? 'border-red-400 shadow-red-100 shadow-sm' :
        focused ? 'border-[#9E7B9B] shadow-[0_0_0_4px_rgba(158,123,155,0.12)]' :
        'border-[#E8DEEB] hover:border-[#C9B0C7]'
      }`}>
        <span className={`absolute left-3.5 transition-colors ${focused ? 'text-[#9E7B9B]' : 'text-[#C9B0C7]'}`}>
          {icon}
        </span>
        <input
          type={isPassword && showPwd ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3.5 bg-transparent text-sm text-[#2D252E] placeholder:text-[#C9B0C7] outline-none rounded-2xl"
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd(v => !v)}
            className="absolute right-3.5 text-[#C9B0C7] hover:text-[#9E7B9B] transition-colors"
          >
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-500 text-[11px] mt-1 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── OAuth Button ─────────────────────────────────────────────────────────────
interface OAuthButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
  delay?: number;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ icon, label, onClick, color, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl border-2 border-[#E8DEEB] bg-white text-sm font-semibold text-[#2D252E] transition-all duration-200 overflow-hidden cursor-pointer"
      style={{
        boxShadow: hovered ? `0 4px 20px ${color}30` : '0 2px 8px rgba(45,37,46,0.04)',
        borderColor: hovered ? color : undefined,
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 rounded-2xl"
        style={{ background: `${color}08` }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <span className="relative z-10 flex items-center gap-3 w-full">
        {icon}
        <span>{label}</span>
        <motion.span
          className="ml-auto"
          animate={{ x: hovered ? 2 : 0, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="h-4 w-4" style={{ color }} />
        </motion.span>
      </span>
    </motion.button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [view, setView] = useState<AuthView>('welcome');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [successUser, setSuccessUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setView('welcome');
      setLoginEmail(''); setLoginPassword(''); setLoginErrors({});
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirm('');
      setRegErrors({}); setAgreeTerms(false); setIsLoading(false);
    }
  }, [isOpen]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ── OAuth handlers ────────────────────────────────────────────────────────
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    // Demo simulation — in production replace with real OAuth flow
    await new Promise(r => setTimeout(r, 1200));
    const user: AuthUser = {
      name: 'Google Пользователь',
      email: 'user@gmail.com',
      avatar: `https://api.dicebear.com/8.x/initials/svg?seed=GP&backgroundColor=9E7B9B&textColor=ffffff`,
      provider: 'google',
    };
    setSuccessUser(user);
    setView('success');
    setIsLoading(false);
    setTimeout(() => { onLogin(user); onClose(); }, 2200);
  };

  const handleTelegramAuth = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const user: AuthUser = {
      name: 'Telegram Пользователь',
      email: '',
      avatar: `https://api.dicebear.com/8.x/initials/svg?seed=TP&backgroundColor=27A7E7&textColor=ffffff`,
      provider: 'telegram',
    };
    setSuccessUser(user);
    setView('success');
    setIsLoading(false);
    setTimeout(() => { onLogin(user); onClose(); }, 2200);
  };

  // ── Login handler ─────────────────────────────────────────────────────────
  const handleLogin = async () => {
    const errors: Record<string, string> = {};
    if (!loginEmail.trim() || !/\S+@\S+\.\S+/.test(loginEmail)) errors.email = 'Введите корректный e-mail';
    if (!loginPassword || loginPassword.length < 6) errors.password = 'Пароль — минимум 6 символов';
    setLoginErrors(errors);
    if (Object.keys(errors).length) return;

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const user: AuthUser = { name: loginEmail.split('@')[0], email: loginEmail, provider: 'email' };
    setSuccessUser(user);
    setView('success');
    setIsLoading(false);
    setTimeout(() => { onLogin(user); onClose(); }, 2200);
  };

  // ── Register handler ──────────────────────────────────────────────────────
  const handleRegister = async () => {
    const errors: Record<string, string> = {};
    if (!regName.trim()) errors.name = 'Введите ваше имя';
    if (!regEmail.trim() || !/\S+@\S+\.\S+/.test(regEmail)) errors.email = 'Введите корректный e-mail';
    if (!regPassword || regPassword.length < 6) errors.password = 'Пароль — минимум 6 символов';
    if (regPassword !== regConfirm) errors.confirm = 'Пароли не совпадают';
    if (!agreeTerms) errors.terms = 'Необходимо принять условия';
    setRegErrors(errors);
    if (Object.keys(errors).length) return;

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const user: AuthUser = { name: regName, email: regEmail, provider: 'email' };
    setSuccessUser(user);
    setView('success');
    setIsLoading(false);
    setTimeout(() => { onLogin(user); onClose(); }, 2200);
  };

  // ── Divider ───────────────────────────────────────────────────────────────
  const Divider = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="flex items-center gap-3 my-1"
    >
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#E8DEEB]" />
      <span className="text-[10px] font-semibold text-[#C9B0C7] uppercase tracking-widest">или</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#E8DEEB]" />
    </motion.div>
  );

  // ── View contents ─────────────────────────────────────────────────────────
  const renderWelcome = () => (
    <div className="flex flex-col gap-4">
      {/* Brand header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-center mb-2"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-[18px] mx-auto mb-4 overflow-hidden shadow-lg ring-2 ring-[#9E7B9B]/20"
        >
          <img src="/icon-192.png" alt="DASELI" className="w-full h-full object-cover" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[22px] font-serif font-semibold text-[#2D252E] mb-1"
        >
          Добро пожаловать
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-[#827585] font-light leading-relaxed"
        >
          Войдите или создайте аккаунт, чтобы получать персональные предложения и отслеживать заказы
        </motion.p>
      </motion.div>

      {/* OAuth buttons */}
      <div className="flex flex-col gap-3">
        <OAuthButton
          icon={<GoogleIcon />}
          label="Войти через Google"
          onClick={handleGoogleAuth}
          color="#4285F4"
          delay={0.25}
        />
        <OAuthButton
          icon={<TelegramIcon />}
          label="Войти через Telegram"
          onClick={handleTelegramAuth}
          color="#27A7E7"
          delay={0.3}
        />
      </div>

      <Divider delay={0.35} />

      {/* Email buttons */}
      <div className="flex flex-col gap-2.5">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setView('register')}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#9E7B9B] to-[#7B5778] text-white text-sm font-semibold shadow-lg shadow-[#9E7B9B]/25 hover:shadow-[#9E7B9B]/40 transition-shadow flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          Создать аккаунт
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setView('login')}
          className="w-full py-3.5 rounded-2xl border-2 border-[#E8DEEB] text-[#2D252E] text-sm font-semibold hover:border-[#9E7B9B] hover:bg-[#F6F2F8] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Mail className="h-4 w-4 text-[#9E7B9B]" />
          Войти по e-mail
        </motion.button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-[10px] text-[#C9B0C7] leading-relaxed mt-1"
      >
        Регистрируясь, вы соглашаетесь с{' '}
        <span className="text-[#9E7B9B] cursor-pointer hover:underline">условиями использования</span>
        {' '}и{' '}
        <span className="text-[#9E7B9B] cursor-pointer hover:underline">политикой конфиденциальности</span>
      </motion.p>
    </div>
  );

  const renderLogin = () => (
    <div className="flex flex-col gap-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-center mb-1">
        <h2 className="text-[20px] font-serif font-semibold text-[#2D252E] mb-1">Вход в аккаунт</h2>
        <p className="text-xs text-[#827585] font-light">Рады видеть вас снова</p>
      </motion.div>

      {/* Quick OAuth */}
      <div className="flex gap-2">
        {[
          { icon: <GoogleIcon />, label: 'Google', onClick: handleGoogleAuth, color: '#4285F4' },
          { icon: <TelegramIcon />, label: 'Telegram', onClick: handleTelegramAuth, color: '#27A7E7' },
        ].map((btn, i) => (
          <motion.button
            key={btn.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={btn.onClick}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#E8DEEB] text-xs font-semibold text-[#2D252E] hover:border-[#9E7B9B] hover:bg-[#F6F2F8] transition-all cursor-pointer"
          >
            {btn.icon}
            {btn.label}
          </motion.button>
        ))}
      </div>

      <Divider delay={0.2} />

      <div className="flex flex-col gap-3">
        <InputField
          label="E-mail" type="email" value={loginEmail} onChange={setLoginEmail}
          placeholder="you@example.com" icon={<Mail className="h-4 w-4" />}
          error={loginErrors.email} delay={0.25}
        />
        <InputField
          label="Пароль" type="password" value={loginPassword} onChange={setLoginPassword}
          placeholder="Ваш пароль" icon={<Lock className="h-4 w-4" />}
          error={loginErrors.password} delay={0.3}
          extra={
            <span className="text-[#9E7B9B] cursor-pointer hover:underline normal-case font-normal capitalize">
              Забыли?
            </span>
          }
        />
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full py-3.5 mt-1 rounded-2xl bg-gradient-to-r from-[#9E7B9B] to-[#7B5778] text-white text-sm font-semibold shadow-lg shadow-[#9E7B9B]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          <>Войти <ArrowRight className="h-4 w-4" /></>
        )}
      </motion.button>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }} className="text-center text-xs text-[#827585]">
        Нет аккаунта?{' '}
        <button onClick={() => setView('register')} className="text-[#9E7B9B] font-semibold hover:underline cursor-pointer">
          Зарегистрироваться
        </button>
      </motion.p>
    </div>
  );

  const renderRegister = () => (
    <div className="flex flex-col gap-3.5">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="text-center mb-0.5">
        <h2 className="text-[20px] font-serif font-semibold text-[#2D252E] mb-1">Создать аккаунт</h2>
        <p className="text-xs text-[#827585] font-light">Присоединяйтесь к Клубу DASELI</p>
      </motion.div>

      {/* Quick OAuth */}
      <div className="flex gap-2">
        {[
          { icon: <GoogleIcon />, label: 'Google', onClick: handleGoogleAuth, color: '#4285F4' },
          { icon: <TelegramIcon />, label: 'Telegram', onClick: handleTelegramAuth, color: '#27A7E7' },
        ].map((btn, i) => (
          <motion.button
            key={btn.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={btn.onClick}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#E8DEEB] text-xs font-semibold text-[#2D252E] hover:border-[#9E7B9B] hover:bg-[#F6F2F8] transition-all cursor-pointer"
          >
            {btn.icon}
            {btn.label}
          </motion.button>
        ))}
      </div>

      <Divider delay={0.18} />

      <div className="flex flex-col gap-3">
        <InputField
          label="Ваше имя" type="text" value={regName} onChange={setRegName}
          placeholder="Анна Иванова" icon={<User className="h-4 w-4" />}
          error={regErrors.name} delay={0.22}
        />
        <InputField
          label="E-mail" type="email" value={regEmail} onChange={setRegEmail}
          placeholder="you@example.com" icon={<Mail className="h-4 w-4" />}
          error={regErrors.email} delay={0.27}
        />
        <InputField
          label="Пароль" type="password" value={regPassword} onChange={setRegPassword}
          placeholder="Минимум 6 символов" icon={<Lock className="h-4 w-4" />}
          error={regErrors.password} delay={0.32}
        />
        <InputField
          label="Повторите пароль" type="password" value={regConfirm} onChange={setRegConfirm}
          placeholder="Повторите пароль" icon={<Lock className="h-4 w-4" />}
          error={regErrors.confirm} delay={0.37}
        />
      </div>

      {/* Terms checkbox */}
      <motion.label
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        className="flex items-start gap-2.5 cursor-pointer group"
      >
        <div
          onClick={() => setAgreeTerms(v => !v)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
            agreeTerms ? 'bg-[#9E7B9B] border-[#9E7B9B]' : 'border-[#E8DEEB] group-hover:border-[#9E7B9B]'
          }`}
        >
          <AnimatePresence>
            {agreeTerms && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <CheckCircle className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-[11px] text-[#827585] leading-relaxed">
          Принимаю{' '}
          <span className="text-[#9E7B9B] hover:underline">условия использования</span>
          {' '}и{' '}
          <span className="text-[#9E7B9B] hover:underline">политику конфиденциальности</span>
        </span>
      </motion.label>
      {regErrors.terms && (
        <p className="text-red-500 text-[11px] -mt-2 ml-1">{regErrors.terms}</p>
      )}

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.46 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleRegister}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#9E7B9B] to-[#7B5778] text-white text-sm font-semibold shadow-lg shadow-[#9E7B9B]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
          />
        ) : (
          <><Sparkles className="h-4 w-4" /> Создать аккаунт</>
        )}
      </motion.button>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-xs text-[#827585]">
        Уже есть аккаунт?{' '}
        <button onClick={() => setView('login')} className="text-[#9E7B9B] font-semibold hover:underline cursor-pointer">
          Войти
        </button>
      </motion.p>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9E7B9B] to-[#7B5778] flex items-center justify-center shadow-xl shadow-[#9E7B9B]/30">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        {/* Ripple rings */}
        {[1, 1.6, 2.2].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-[#9E7B9B]"
            initial={{ scale: 0.8, opacity: 0.6 }}
            animate={{ scale, opacity: 0 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 1 }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-serif font-semibold text-[#2D252E] mb-1.5">
          Добро пожаловать{successUser?.name ? `, ${successUser.name.split(' ')[0]}` : ''}!
        </h3>
        <p className="text-xs text-[#827585] font-light leading-relaxed max-w-[220px] mx-auto">
          Вы успешно вошли в свой аккаунт DASELI
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#9E7B9B]/40 to-transparent"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="text-[11px] text-[#C9B0C7]"
      >
        Перенаправление...
      </motion.p>
    </div>
  );

  const viewContent: Record<AuthView, React.ReactNode> = {
    welcome: renderWelcome(),
    login: renderLogin(),
    register: renderRegister(),
    success: renderSuccess(),
  };

  const canGoBack = view === 'login' || view === 'register';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* ── Modal Panel ── */}
          <motion.div
            key="auth-panel"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-[400px] pointer-events-auto">
              {/* Decorative glow */}
              <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-[#9E7B9B]/20 via-transparent to-[#7B5778]/15 blur-xl pointer-events-none" />

              {/* Card */}
              <div className="relative rounded-[28px] bg-white shadow-[0_32px_80px_rgba(45,37,46,0.18),0_0_0_1px_rgba(232,222,235,0.8)] overflow-hidden">

                {/* Top gradient strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#9E7B9B] via-[#C9A0C7] to-[#7B5778]" />

                {/* Floating orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <FloatingOrb style={{ width: 120, height: 120, top: -40, right: -30, background: 'radial-gradient(circle, rgba(158,123,155,0.12) 0%, transparent 70%)' }} />
                  <FloatingOrb style={{ width: 80, height: 80, bottom: 20, left: -20, background: 'radial-gradient(circle, rgba(123,87,120,0.08) 0%, transparent 70%)' }} />
                </div>

                {/* Header controls */}
                <div className="relative flex items-center justify-between px-6 pt-5 pb-1">
                  <AnimatePresence>
                    {canGoBack && (
                      <motion.button
                        key="back-btn"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setView('welcome')}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-[#9E7B9B] hover:text-[#7B5778] transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Назад
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Brand mark */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] font-bold tracking-[0.2em] text-[#9E7B9B] uppercase absolute left-1/2 -translate-x-1/2"
                  >
                    DASELI
                  </motion.span>

                  <button
                    onClick={onClose}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F2F8] text-[#827585] hover:bg-[#9E7B9B] hover:text-white transition-all cursor-pointer"
                    aria-label="Закрыть"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Content with animated view transitions */}
                <div className="px-6 pb-7 pt-3 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={view}
                      initial={{ opacity: 0, x: view === 'welcome' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: view === 'welcome' ? 20 : -20 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {viewContent[view]}
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
