import React, { useEffect, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

const zoomLevels = [1, 1.35, 1.75, 2.2];

export const DownloadPrompt = () => {
  const [zoomIndex, setZoomIndex] = useState(0);
  const zoom = zoomLevels[zoomIndex];
  const canDrag = zoom > 1;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, []);

  return (
    <main className="fixed inset-0 flex h-[100dvh] w-full touch-none select-none items-center justify-center overflow-hidden bg-[#FAF7FC]">
      <motion.div
        className="flex h-full w-full items-center justify-center overflow-hidden"
        initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.img
          src="/ios-install-guide.png"
          alt="Как добавить сайт DASELI на главный экран iPhone"
          drag={canDrag}
          dragMomentum={false}
          dragElastic={0.08}
          onDoubleClick={() => setZoomIndex((current) => (current === 0 ? 2 : 0))}
          animate={{ scale: zoom, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className={`block h-auto max-h-[100dvh] w-auto max-w-full object-contain ${
            canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
          }`}
        />
      </motion.div>

      <div className="fixed bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/70 bg-white/88 p-1.5 shadow-[0_14px_40px_rgba(45,37,46,0.16)] backdrop-blur-md">
        <button
          type="button"
          onClick={() => setZoomIndex((current) => Math.max(0, current - 1))}
          disabled={zoomIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#9e7b9b] transition-colors hover:bg-[#9e7b9b]/10 disabled:pointer-events-none disabled:opacity-35"
          aria-label="Уменьшить"
        >
          <Minus className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setZoomIndex(0)}
          className="flex h-10 min-w-14 items-center justify-center gap-1 rounded-xl px-2 text-xs font-semibold text-[#9e7b9b] transition-colors hover:bg-[#9e7b9b]/10"
          aria-label="Сбросить масштаб"
        >
          <RotateCcw className="h-4 w-4" />
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={() => setZoomIndex((current) => Math.min(zoomLevels.length - 1, current + 1))}
          disabled={zoomIndex === zoomLevels.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-[#9e7b9b] transition-colors hover:bg-[#9e7b9b]/10 disabled:pointer-events-none disabled:opacity-35"
          aria-label="Увеличить"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
};
