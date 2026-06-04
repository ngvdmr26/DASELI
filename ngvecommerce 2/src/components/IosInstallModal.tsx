import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface IosInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IosInstallModal: React.FC<IosInstallModalProps> = ({ isOpen, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showToast, setShowToast] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const startRef = useRef({
    x: 0,
    y: 0,
    distance: 0,
    scale: 1,
    position: { x: 0, y: 0 },
    isPinching: false,
    isPanning: false,
  });

  // Reset states when opened
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Touch gesture helpers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      
      startRef.current.distance = dist;
      startRef.current.scale = scale;
      startRef.current.isPinching = true;
      startRef.current.isPanning = false;
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan start
      const t = e.touches[0];
      startRef.current.x = t.clientX;
      startRef.current.y = t.clientY;
      startRef.current.position = { ...position };
      startRef.current.isPanning = true;
      startRef.current.isPinching = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && startRef.current.isPinching) {
      if (e.cancelable) e.preventDefault(); // Prevents page scrolling during pinch-zoom
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      
      if (startRef.current.distance > 0) {
        const ratio = dist / startRef.current.distance;
        let newScale = startRef.current.scale * ratio;
        // Clamp scale from 1 to 4
        newScale = Math.max(1, Math.min(4, newScale));
        setScale(newScale);
      }
    } else if (e.touches.length === 1 && startRef.current.isPanning && scale > 1) {
      if (e.cancelable) e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - startRef.current.x;
      const dy = t.clientY - startRef.current.y;
      
      // Calculate new position
      let newX = startRef.current.position.x + dx;
      let newY = startRef.current.position.y + dy;

      // Bound panning to prevent the image from going completely off screen
      const maxDragX = (scale - 1) * 150;
      const maxDragY = (scale - 1) * 250;
      newX = Math.max(-maxDragX, Math.min(maxDragX, newX));
      newY = Math.max(-maxDragY, Math.min(maxDragY, newY));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleTouchEnd = () => {
    startRef.current.isPinching = false;
    startRef.current.isPanning = false;
    
    // Snap back if scale is below 1 or very close to 1
    if (scale <= 1.05) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Mouse gestures for desktop testing/desktop users
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      startRef.current.x = e.clientX;
      startRef.current.y = e.clientY;
      startRef.current.position = { ...position };
      startRef.current.isPanning = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startRef.current.isPanning && scale > 1) {
      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;
      
      let newX = startRef.current.position.x + dx;
      let newY = startRef.current.position.y + dy;

      const maxDragX = (scale - 1) * 150;
      const maxDragY = (scale - 1) * 250;
      newX = Math.max(-maxDragX, Math.min(maxDragX, newX));
      newY = Math.max(-maxDragY, Math.min(maxDragY, newY));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    startRef.current.isPanning = false;
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(4, prev + 0.5));
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const next = Math.max(1, prev - 0.5);
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        ref={containerRef}
        className="relative bg-white rounded-2xl overflow-hidden border-[6px] border-[#3D0D6B] ring-2 ring-[#9E7B9B]/40 shadow-[0_24px_50px_rgba(61,13,107,0.4)] max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center"
      >
        {/* Floating Help/Toast Indicator */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -10, x: "-50%" }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-[#3D0D6B]/95 text-white text-[11px] font-medium px-4 py-2 rounded-full shadow-lg backdrop-blur-sm pointer-events-none whitespace-nowrap border border-[#9E7B9B]/20"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#9E7B9B]" />
              <span>Раздвигайте двумя пальцами для приближения</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#3D0D6B] shadow-lg backdrop-blur-sm transition-all hover:scale-105 active:scale-95 border border-[#3D0D6B]/15 cursor-pointer"
          aria-label="Закрыть инструкцию"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Gesture Image Container */}
        <div 
          className={`relative overflow-hidden touch-none bg-slate-900 select-none ${
            scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <motion.img
            ref={imageRef}
            src="/ios-install-guide.png"
            alt="Инструкция по установке на iOS"
            className="block max-w-full max-h-[72vh] w-auto h-auto object-contain pointer-events-none select-none"
            animate={{ 
              scale: scale,
              x: position.x,
              y: position.y 
            }}
            transition={{ type: "spring", stiffness: 350, damping: 35, mass: 0.5 }}
          />

          {/* Floating controls overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/65 p-1 rounded-full backdrop-blur-md z-30 border border-white/10 select-none pointer-events-auto">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={scale === 1}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-90"
              title="Уменьшить"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2 text-[10px] font-semibold text-white hover:bg-white/15 rounded-md transition-all h-8 flex items-center justify-center gap-1"
              title="Сбросить масштаб"
            >
              <RotateCcw className="h-3 w-3" />
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={scale === 4}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-90"
              title="Увеличить"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
