import React, { useState, useRef, useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
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



  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      {/* Toast OUTSIDE the frame */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 flex items-center gap-2.5 rounded-full bg-white/[0.12] px-5 py-2.5 text-[12px] font-medium text-white/90 shadow-lg backdrop-blur-xl pointer-events-none border border-white/[0.08]"
          >
            <HelpCircle className="h-4 w-4 text-[#C9A0FF]" />
            <span>Раздвигайте двумя пальцами для приближения</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient border wrapper */}
      <div
        ref={containerRef}
        className="relative rounded-[28px] p-[5px] shadow-[0_24px_60px_rgba(61,13,107,0.45),0_0_80px_rgba(123,47,190,0.15)] max-w-[90vw] max-h-[80vh]"
        style={{
          background: 'linear-gradient(135deg, #3D0D6B 0%, #7B2FBE 25%, #3D0D6B 45%, #9B4DDB 65%, #3D0D6B 85%, #6A1FB0 100%)',
        }}
      >
        {/* Inner content with its own bg */}
        <div className="relative rounded-[24px] overflow-hidden bg-slate-900 flex flex-col items-center justify-center">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/70 active:scale-95 border border-white/10 cursor-pointer"
            aria-label="Закрыть инструкцию"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Gesture Image Container */}
          <div
            className={`relative overflow-hidden touch-none select-none ${
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
              className="block max-w-full max-h-[78vh] w-auto h-auto object-contain pointer-events-none select-none"
              animate={{
                scale: scale,
                x: position.x,
                y: position.y
              }}
              transition={{ type: "spring", stiffness: 350, damping: 35, mass: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
