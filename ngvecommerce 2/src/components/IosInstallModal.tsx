import React, { useState } from 'react';
import { X, Share, MoreHorizontal, MoreVertical, Menu, Plus, Check, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IosInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Browser detection ────────────────────────────────────────────────────────
export type BrowserId =
  | 'safari'
  | 'chrome-ios'
  | 'firefox-ios'
  | 'yandex-ios'
  | 'opera-ios'
  | 'chrome-android'
  | 'samsung'
  | 'yandex-android'
  | 'opera-android'
  | 'opera-mini'
  | 'firefox-android'
  | 'vk'
  | 'uc'
  | 'miui'
  | 'atom'
  | 'generic-android'
  | 'generic-desktop'
  | 'generic';

export function detectBrowser(): BrowserId {
  const ua = navigator.userAgent;

  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);

  // ── iOS browsers ──────────────────────────────────────────────────────────
  if (isIOS) {
    if (/YaBrowser/i.test(ua)) return 'yandex-ios';
    if (/CriOS/i.test(ua)) return 'chrome-ios';
    if (/FxiOS/i.test(ua)) return 'firefox-ios';
    if (/OPiOS/i.test(ua)) return 'opera-ios';
    return 'safari';
  }

  // ── Android browsers ──────────────────────────────────────────────────────
  if (isAndroid) {
    if (/VKBrowser/i.test(ua)) return 'vk';
    if (/UCBrowser/i.test(ua)) return 'uc';
    if (/YaBrowser/i.test(ua)) return 'yandex-android';
    if (/SamsungBrowser/i.test(ua)) return 'samsung';
    if (/OPR\//i.test(ua) && !/Mini/i.test(ua)) return 'opera-android';
    if (/Opera Mini/i.test(ua) || /OPiOS/i.test(ua)) return 'opera-mini';
    if (/Firefox/i.test(ua)) return 'firefox-android';
    if (/MiuiBrowser/i.test(ua) || /XiaoMi/i.test(ua)) return 'miui';
    // Atom browser (Mail.ru) — user agent contains "Atom"
    if (/Atom/i.test(ua)) return 'atom';
    if (/Chrome/i.test(ua)) return 'chrome-android';
    return 'generic-android';
  }

  // ── Desktop ───────────────────────────────────────────────────────────────
  return 'generic-desktop';
}

export const browserNames: Record<BrowserId, string> = {
  'safari': 'Safari',
  'chrome-ios': 'Chrome',
  'firefox-ios': 'Firefox',
  'yandex-ios': 'Яндекс Браузер',
  'opera-ios': 'Opera',
  'chrome-android': 'Chrome',
  'samsung': 'Samsung Internet',
  'yandex-android': 'Яндекс Браузер',
  'opera-android': 'Opera',
  'opera-mini': 'Opera Mini',
  'firefox-android': 'Firefox',
  'vk': 'ВК Браузер',
  'uc': 'UC Browser',
  'miui': 'Mi Browser',
  'atom': 'Atom (Mail.ru)',
  'generic-android': 'ваш браузер',
  'generic-desktop': 'ваш браузер',
  'generic': 'ваш браузер',
};

// ── Does this browser support native PWA beforeinstallprompt? ─────────────
export function browserSupportsNativeInstall(id: BrowserId): boolean {
  return [
    'chrome-android',
    'samsung',
    'yandex-android',
    'opera-android',
    'firefox-android',
    'atom',
    'generic-android',
    'generic-desktop',
  ].includes(id);
}

// ─── Steps ────────────────────────────────────────────────────────────────────
interface Step {
  iconEl: React.ReactNode;
  title: string;
  desc: string;
}

const s = {
  share:   <Share className="h-4 w-4" />,
  moreH:   <MoreHorizontal className="h-4 w-4" />,
  moreV:   <MoreVertical className="h-4 w-4" />,
  menu:    <Menu className="h-4 w-4" />,
  plus:    <Plus className="h-4 w-4" />,
  check:   <Check className="h-4 w-4" />,
  down:    <Download className="h-4 w-4" />,
};

export function getSteps(browser: BrowserId): Step[] {
  switch (browser) {

    // ── iOS ──────────────────────────────────────────────────────────────────
    case 'safari':
      return [
        { iconEl: s.share, title: 'Поделиться',        desc: 'Нажмите кнопку «Поделиться» (⎙) внизу Safari' },
        { iconEl: s.plus,  title: 'На экран «Домой»',  desc: 'Прокрутите список и выберите «На экран Домой»' },
        { iconEl: s.check, title: 'Добавить',           desc: 'Нажмите «Добавить» в правом верхнем углу' },
      ];

    case 'chrome-ios':
      return [
        { iconEl: s.moreH, title: 'Меню',              desc: 'Нажмите «⋯» справа от адресной строки' },
        { iconEl: s.down,  title: 'На главный экран',  desc: 'Выберите «Добавить на главный экран»' },
        { iconEl: s.check, title: 'Подтвердить',        desc: 'Нажмите «Добавить» в появившемся диалоге' },
      ];

    case 'firefox-ios':
      return [
        { iconEl: s.menu,  title: 'Меню',              desc: 'Нажмите «☰» в нижней панели Firefox' },
        { iconEl: s.share, title: 'Поделиться',        desc: 'Выберите «Поделиться», затем «На экран Домой»' },
        { iconEl: s.check, title: 'Добавить',           desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'yandex-ios':
      return [
        { iconEl: s.moreH, title: 'Меню',              desc: 'Нажмите «⋯» в нижней части Яндекс Браузера' },
        { iconEl: s.plus,  title: 'На экран Домой',    desc: 'Выберите «Добавить на экран Домой»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'opera-ios':
      return [
        { iconEl: s.share, title: 'Поделиться',        desc: 'Нажмите кнопку «Поделиться» внизу Opera' },
        { iconEl: s.plus,  title: 'На экран Домой',    desc: 'Выберите «На экран Домой» в системном меню' },
        { iconEl: s.check, title: 'Добавить',           desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    // ── Android ───────────────────────────────────────────────────────────────
    case 'chrome-android':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите «⋮» в правом верхнем углу Chrome' },
        { iconEl: s.down,  title: 'Установить',        desc: 'Выберите «Добавить на главный экран» или «Установить»' },
        { iconEl: s.check, title: 'Подтвердить',        desc: 'Нажмите «Установить» в появившемся диалоге' },
      ];

    case 'samsung':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите «⋮» в правом нижнем углу Samsung Internet' },
        { iconEl: s.plus,  title: 'Добавить страницу', desc: 'Выберите «Добавить страницу» → «На главный экран»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'yandex-android':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите «⋮» в правом верхнем углу Яндекс Браузера' },
        { iconEl: s.plus,  title: 'Добавить',          desc: 'Выберите «Добавить ярлык на рабочий стол»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'opera-android':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите «O» → «Главная страница» → меню «⋮»' },
        { iconEl: s.plus,  title: 'На главный экран',  desc: 'Выберите «Добавить на главный экран»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'opera-mini':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите кнопку «O» в нижней части Opera Mini' },
        { iconEl: s.plus,  title: 'На главный экран',  desc: 'Выберите «На главный экран»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Подтвердите добавление ярлыка' },
      ];

    case 'firefox-android':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите «⋮» в правом верхнем углу Firefox' },
        { iconEl: s.plus,  title: 'Установить',        desc: 'Выберите «Установить» или «Добавить на главный экран»' },
        { iconEl: s.check, title: 'Подтвердить',        desc: 'Нажмите «Добавить» в появившемся диалоге' },
      ];

    case 'vk':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите «⋮» в правом верхнем углу ВК Браузера' },
        { iconEl: s.plus,  title: 'На главный экран',  desc: 'Выберите «Добавить на главный экран»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'uc':
      return [
        { iconEl: s.menu,  title: 'Меню',              desc: 'Нажмите «☰» внизу UC Browser' },
        { iconEl: s.plus,  title: 'На главный экран',  desc: 'Выберите «Доб. на гл. экран» или «Ярлык»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'miui':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите «⋮» или «···» в Mi Browser' },
        { iconEl: s.plus,  title: 'На главный экран',  desc: 'Выберите «Добавить на главный экран»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'atom':
      return [
        { iconEl: s.moreV, title: 'Меню',              desc: 'Нажмите «⋮» в Atom (Mail.ru браузере)' },
        { iconEl: s.plus,  title: 'На главный экран',  desc: 'Выберите «Добавить на главный экран»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Нажмите «Добавить» для подтверждения' },
      ];

    case 'generic-desktop':
      return [
        { iconEl: s.moreV, title: 'Адресная строка',   desc: 'Найдите иконку установки (⊕ или ↓) в адресной строке' },
        { iconEl: s.down,  title: 'Установить',        desc: 'Нажмите «Установить» или «Добавить приложение»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Подтвердите установку в диалоге браузера' },
      ];

    default:
      return [
        { iconEl: s.moreV, title: 'Меню браузера',     desc: 'Откройте меню (обычно «⋮» или «⋯»)' },
        { iconEl: s.plus,  title: 'Добавить',          desc: 'Найдите «Добавить на главный экран» или «Установить»' },
        { iconEl: s.check, title: 'Готово',             desc: 'Подтвердите добавление' },
      ];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export const IosInstallModal: React.FC<IosInstallModalProps> = ({ isOpen, onClose }) => {
  const [browser] = useState<BrowserId>(() => detectBrowser());
  const steps = getSteps(browser);
  const browserName = browserNames[browser];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="install-guide-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="install-guide-content"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Gradient border wrapper */}
            <div
              className="relative rounded-[28px] p-[5px] shadow-[0_24px_60px_rgba(61,13,107,0.45),0_0_80px_rgba(123,47,190,0.15)] w-[340px] max-w-[90vw]"
              style={{
                background: 'linear-gradient(135deg, #3D0D6B 0%, #7B2FBE 25%, #3D0D6B 45%, #9B4DDB 65%, #3D0D6B 85%, #6A1FB0 100%)',
              }}
            >
              {/* Close button — on the corner outside */}
              <button
                type="button"
                onClick={onClose}
                className="absolute -top-3 -right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#3D0D6B] shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all hover:scale-110 active:scale-90 cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>

              {/* Inner white card */}
              <div className="rounded-[24px] bg-white px-6 py-7">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-[18px] mx-auto mb-3 overflow-hidden shadow-md ring-1 ring-black/[0.06]">
                    <img src="/icon-192.png" alt="DASELI" className="w-full h-full object-cover" />
                  </div>
                  <h3
                    className="text-[17px] font-semibold text-[#1A1A1A] mb-0.5"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Установите DASELI
                  </h3>
                  <p className="text-[11px] text-[#9E7B9B] font-medium tracking-wider uppercase">
                    Инструкция для {browserName}
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-2.5">
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3 rounded-2xl bg-[#F6F4F0] p-3.5"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #3D0D6B, #7B2FBE)' }}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1A1A]">
                          <span className="text-[#7B2FBE]">{step.iconEl}</span>
                          {step.title}
                        </div>
                        <p className="text-[11px] text-[#888] mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] text-[#9E7B9B] mt-5 leading-relaxed">
                  После установки DASELI появится на главном экране как обычное приложение
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
