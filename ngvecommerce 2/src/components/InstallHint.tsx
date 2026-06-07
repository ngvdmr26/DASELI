import React, { useEffect, useState } from 'react';
import { Download, MonitorDown, Share, Smartphone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { IosInstallModal } from './IosInstallModal';
import { detectBrowser, browserNames, browserSupportsNativeInstall } from './IosInstallModal';

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as any).standalone;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export const InstallHint: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [browser] = useState(() => detectBrowser());

  // Browsers that need the manual guide (no native beforeinstallprompt)
  const needsManualGuide = !browserSupportsNativeInstall(browser);

  useEffect(() => {
    const standalone = isStandalone();
    setInstalled(standalone);

    if (needsManualGuide && !standalone) {
      setVisible(true);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      if (!needsManualGuide && !standalone) {
        setVisible(true);
      }
    };

    const handleInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, [needsManualGuide]);

  const handleInstall = async () => {
    if (needsManualGuide) {
      setIsModalOpen(true);
      return;
    }
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') setVisible(false);
    setInstallPrompt(null);
  };

  const browserLabel = browserNames[browser] ?? 'браузере';

  // Hint subtitle text — adapted per browser type
  const hintSubtitle = (() => {
    if (needsManualGuide) {
      if (browser === 'safari') {
        return (
          <span className="inline-flex flex-wrap items-center gap-1">
            Нажмите <Share className="h-3.5 w-3.5" /> и выберите «На экран Домой»
          </span>
        );
      }
      return `Покажем инструкцию для ${browserLabel} — займёт 3 секунды`;
    }
    if (installPrompt) {
      return 'Добавьте магазин на рабочий стол в один шаг.';
    }
    return 'Кнопка появится, когда браузер подтвердит готовность PWA.';
  })();

  if (isInstalled && !isModalOpen) return null;

  return (
    <>
      <AnimatePresence>
        {visible && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 left-3 right-3 z-40 rounded-2xl border border-border bg-white/95 p-3 shadow-[0_18px_50px_rgba(45,37,46,0.16)] backdrop-blur-md lg:bottom-6 lg:left-auto lg:right-6 lg:w-[360px]"
          >
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="absolute right-2 top-2 rounded-full p-1.5 text-muted transition-colors hover:bg-primary hover:text-main"
              aria-label="Закрыть установку приложения"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex gap-3 pr-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                {needsManualGuide ? <Smartphone className="h-5 w-5" /> : <MonitorDown className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-sm font-semibold text-main">Установить DASELI</div>
                <div className="text-xs leading-relaxed text-muted">{hintSubtitle}</div>
                <button
                  type="button"
                  onClick={handleInstall}
                  disabled={!needsManualGuide && !installPrompt}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-accent-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {needsManualGuide ? 'Показать инструкцию' : 'Установить'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <IosInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
