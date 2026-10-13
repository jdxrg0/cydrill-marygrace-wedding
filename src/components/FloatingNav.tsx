import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MailOpen, Menu, X, Sparkles } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { BohoSunDivider } from './Dividers';

interface FloatingNavProps {
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onReplayEnvelope: () => void;
}

const navLinks = [
  { num: '01', label: 'Welcome', href: '#home' },
  { num: '02', label: 'Save the Date', href: '#save-the-date' },
  { num: '03', label: 'Location Guide', href: '#location' },
  { num: '04', label: 'Wedding Timeline', href: '#timeline' },
  { num: '05', label: 'The Entourage', href: '#entourage' },
  { num: '06', label: 'Dress Code', href: '#dress-code' },
  { num: '07', label: 'Our Gallery', href: '#gallery' },
  { num: '08', label: 'RSVP & Wishes', href: '#rsvp' },
];

export const FloatingNav: React.FC<FloatingNavProps> = ({
  isPlayingMusic,
  onToggleMusic,
  onReplayEnvelope,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { couple, schedule, music } = weddingConfig;

  // Prevent background scrolling when Chapters Menu modal is open
  useEffect(() => {
    if (isMenuOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Prevent non-passive touchmove scrolling on window/body while menu is open
      const preventTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && target.closest('.allow-scroll')) {
          return;
        }
        e.preventDefault();
      };

      window.addEventListener('touchmove', preventTouchMove, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalBodyTouchAction;
        window.removeEventListener('touchmove', preventTouchMove);
      };
    }
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* FLOATING ACTION DOCK (Bottom-Right on All Screen Sizes): Mute Button + Menu */}
      <div className="fixed bottom-4 sm:bottom-5 right-3 sm:right-6 z-[60] flex items-center justify-end gap-2.5 pointer-events-auto">
        {/* Mute / Unmute Toggle Button (Circular Icon-Only) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMusic();
          }}
          title={`${isPlayingMusic ? 'Mute' : 'Play'} ${music.displayLabel}`}
          aria-label={`${isPlayingMusic ? 'Mute' : 'Play'} ${music.displayLabel}`}
          className={`flex items-center justify-center rounded-full w-11 h-11 shadow-xl border transition-all duration-200 active:scale-95 shrink-0 cursor-pointer ${
            isPlayingMusic
              ? 'bg-terracotta text-alabaster border-terracotta-light'
              : 'bg-alabaster text-espresso border-champagne'
          }`}
        >
          {isPlayingMusic ? (
            <Volume2 className="w-4 h-4 animate-pulse pointer-events-none" />
          ) : (
            <VolumeX className="w-4 h-4 text-terracotta pointer-events-none" />
          )}
        </button>

        {/* Editorial "Chapters" Menu Button (Circular Icon-Only) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(true);
          }}
          title="Open invitation chapters menu"
          aria-label="Open invitation chapters menu"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-espresso hover:bg-espresso/95 text-sand-light border border-champagne/50 shadow-xl transition-all duration-200 active:scale-95 shrink-0 cursor-pointer"
        >
          <Menu className="w-4 h-4 text-blush pointer-events-none" />
        </button>
      </div>

      {/* EDITORIAL CHAPTERS MODAL / BOTTOM SHEET (Works on Both Mobile & Desktop!) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-[70] bg-espresso/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 touch-none overscroll-none"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[88vh] overflow-y-auto overscroll-contain allow-scroll bg-alabaster paper-grain rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-champagne/60 shadow-2xl px-6 pt-6 pb-8 relative"
            >
              {/* Top Drag Handle & Close Button */}
              <div className="w-12 h-1 rounded-full bg-sand-dark/60 mx-auto mb-4 sm:hidden" />

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-sand-light hover:bg-sand text-espresso flex items-center justify-center border border-champagne/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Sheet Header */}
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-semibold">
                  {schedule.shortDate}
                </span>
                <h3 className="font-serif text-2xl font-bold uppercase tracking-widest text-espresso mt-0.5">
                  {couple.displayTitle}
                </h3>
                <BohoSunDivider className="my-3 scale-75" />
              </div>

              {/* 2-Column Editorial Chapter Cards */}
              <div className="grid grid-cols-2 gap-2.5 mt-2">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="group flex items-center gap-2.5 p-3 rounded-2xl bg-sand-light/75 hover:bg-terracotta hover:text-alabaster border border-champagne/40 transition-all"
                  >
                    <span className="font-serif text-sm font-bold text-terracotta group-hover:text-champagne">
                      {item.num}
                    </span>
                    <span className="text-xs font-semibold tracking-wide text-espresso group-hover:text-alabaster">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>

              {/* Bottom Actions Inside Menu: Replay Envelope + Music Toggle */}
              <div className="mt-5 pt-4 border-t border-sand grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onReplayEnvelope();
                  }}
                  className="h-11 inline-flex items-center justify-center gap-1.5 px-3 rounded-full bg-sand hover:bg-sand-dark/60 text-espresso text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors"
                >
                  <MailOpen className="w-3.5 h-3.5 text-terracotta shrink-0" />
                  <span>Replay Envelope</span>
                </button>

                <button
                  type="button"
                  onClick={onToggleMusic}
                  className={`h-11 inline-flex items-center justify-center gap-1.5 px-3 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isPlayingMusic
                      ? 'bg-terracotta text-alabaster'
                      : 'bg-sand-light border border-champagne/60 text-espresso'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{isPlayingMusic ? 'Music: On' : 'Music: Off'}</span>
                </button>
              </div>

              {/* Background Music Track Note */}
              <p className="text-[11px] text-center text-espresso/60 mt-3 font-serif italic truncate">
                ♪ {music.displayLabel}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
