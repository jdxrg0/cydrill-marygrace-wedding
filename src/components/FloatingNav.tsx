import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, MailOpen, Menu, X, Sparkles, ChevronUp, ChevronDown, Music2 } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { soundManager } from '../utils/sound';
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

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({
  isPlayingMusic,
  onToggleMusic,
  onReplayEnvelope,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLyricsCardOpen, setIsLyricsCardOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(222.35);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState<number | null>(null);

  const { couple, schedule, music } = weddingConfig;
  const lyrics = music.lyrics;

  // Subscribe to real-time playback timestamps from soundManager
  useEffect(() => {
    const unsubscribe = soundManager.subscribeTime((time, dur) => {
      setCurrentTime(time);
      if (dur > 0) setDuration(dur);
    });
    return unsubscribe;
  }, []);

  // Close expanded lyrics popover when muted
  useEffect(() => {
    if (!isPlayingMusic) {
      setIsLyricsCardOpen(false);
    }
  }, [isPlayingMusic]);

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

  // Find active lyric index based on current audio playback time
  const activeLyricIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [currentTime, lyrics]);

  const currentLyric = lyrics[activeLyricIndex] || lyrics[0];
  const prevLyric = activeLyricIndex > 0 ? lyrics[activeLyricIndex - 1] : null;
  const nextLyric = activeLyricIndex < lyrics.length - 1 ? lyrics[activeLyricIndex + 1] : null;
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  // Effective playback time shown on the scrubber (frozen to scrubTime during user drag to prevent audio engine lag)
  const displayTime = isScrubbing && scrubTime !== null ? scrubTime : currentTime;
  const scrubberPercent = duration > 0 ? Math.min(100, Math.max(0, (displayTime / duration) * 100)) : 0;

  const handleScrubStart = () => {
    setIsScrubbing(true);
    setScrubTime(currentTime);
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScrubTime(val);
  };

  const handleScrubCommit = () => {
    if (scrubTime !== null && !Number.isNaN(scrubTime)) {
      soundManager.seek(scrubTime);
    }
    setIsScrubbing(false);
    setScrubTime(null);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* EXPANDED LIVE LYRICS POPOVER CARD (When user taps the Syncing Lyric Pill) */}
      <AnimatePresence>
        {isPlayingMusic && isLyricsCardOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-20 right-3 sm:right-6 z-[60] w-[calc(100vw-24px)] sm:w-96 bg-alabaster border-2 border-blush rounded-3xl shadow-2xl p-4 sm:p-5 paper-grain"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-sand">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-blush-light flex items-center justify-center text-blush-deep shrink-0">
                  <Music2 className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold tracking-wide text-espresso truncate">
                    {music.title}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-rust/75">
                    {music.artist} • Live Synced Lyrics
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLyricsCardOpen(false)}
                aria-label="Minimize lyrics card"
                className="w-7 h-7 rounded-full bg-sand-light hover:bg-sand text-espresso flex items-center justify-center transition-colors shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* 3-Line Karaoke Synced Stage (Previous, Current, Next) - Fixed Height Stage */}
            <div className="py-2 px-1 text-center h-32 flex flex-col justify-between overflow-hidden">
              {/* Previous Line */}
              <button
                type="button"
                disabled={!prevLyric}
                onClick={() => prevLyric && soundManager.seek(prevLyric.time)}
                className="text-xs font-serif italic text-espresso/50 hover:text-espresso/80 transition-colors line-clamp-1 h-5 flex items-center justify-center disabled:pointer-events-none"
              >
                {prevLyric ? prevLyric.text : ' '}
              </button>

              {/* Active Highlighted Line */}
              <div className="h-14 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeLyricIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="font-serif text-sm sm:text-base font-bold text-terracotta leading-snug px-2 line-clamp-2"
                  >
                    “{currentLyric.text}”
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Next Upcoming Line */}
              <button
                type="button"
                disabled={!nextLyric}
                onClick={() => nextLyric && soundManager.seek(nextLyric.time)}
                className="text-xs font-serif italic text-espresso/50 hover:text-espresso/80 transition-colors line-clamp-1 h-5 flex items-center justify-center disabled:pointer-events-none"
              >
                {nextLyric ? nextLyric.text : ' '}
              </button>
            </div>

            {/* Interactive Progress Scrubber (Butter-Smooth 60FPS Dragging with No Audio Lag) */}
            <div className="pt-2.5 pb-0.5 border-t border-sand/70">
              <div className="relative py-1 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={displayTime}
                  onPointerDown={handleScrubStart}
                  onTouchStart={handleScrubStart}
                  onMouseDown={handleScrubStart}
                  onChange={handleScrubChange}
                  onPointerUp={handleScrubCommit}
                  onTouchEnd={handleScrubCommit}
                  onMouseUp={handleScrubCommit}
                  onKeyUp={(e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                      handleScrubCommit();
                    }
                  }}
                  aria-label="Seek song timeline"
                  style={{
                    background: `linear-gradient(to right, #DF7F66 0%, #DF7F66 ${scrubberPercent}%, #E7DED3 ${scrubberPercent}%, #E7DED3 100%)`,
                  }}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-terracotta touch-pan-x"
                />
              </div>
              <div className="flex justify-between text-[10px] font-medium text-espresso/60 mt-1 select-none">
                <span className={isScrubbing ? 'text-terracotta font-bold tabular-nums' : 'tabular-nums'}>
                  {formatTime(displayTime)}
                </span>
                <span className="uppercase tracking-widest text-terracotta/80">
                  {isScrubbing ? 'Release to jump' : 'Tap any line or drag to seek'}
                </span>
                <span className="tabular-nums">{formatTime(duration)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UNIFIED FLOATING DOCK (Bottom-Right on All Screen Sizes): Syncing Lyrics Pill + Mute Button + Menu */}
      <div className="fixed bottom-4 sm:bottom-5 right-3 sm:right-6 z-[60] flex items-center justify-end gap-2 max-w-[calc(100vw-24px)] pointer-events-auto">
        {/* LIVE SYNCING LYRICS PILL ALONGSIDE THE MUTE BUTTON (100% Solid Opaque) */}
        <AnimatePresence>
          {isPlayingMusic && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsLyricsCardOpen((prev) => !prev);
              }}
              title="Click to expand live synced lyrics"
              aria-label="Expand live synced lyrics"
              className="relative overflow-hidden w-[calc(100vw-132px)] sm:w-72 md:w-80 shrink-0 h-11 px-3.5 rounded-full bg-alabaster hover:bg-sand-light text-espresso border border-blush shadow-xl flex items-center gap-2.5 text-left transition-colors duration-150 cursor-pointer select-none"
            >
              {/* Animated Mini Equalizer Bars */}
              <span className="flex items-end gap-[2px] h-3.5 shrink-0 pointer-events-none" aria-hidden="true">
                <span className="w-[2.5px] bg-terracotta rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-3.5" />
                <span className="w-[2.5px] bg-blush-rose rounded-full animate-[pulse_1.3s_ease-in-out_infinite] h-2" />
                <span className="w-[2.5px] bg-terracotta rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3" />
              </span>

              {/* Smoothly Cross-Fading Synced Lyric Line */}
              <div className="flex-1 min-w-0 overflow-hidden pointer-events-none">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.p
                    key={activeLyricIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="font-serif italic text-xs sm:text-sm font-semibold text-espresso truncate"
                  >
                    {currentLyric.text}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Expand Chevron Indicator */}
              <ChevronUp
                className={`w-3.5 h-3.5 text-terracotta shrink-0 pointer-events-none transition-transform duration-200 ${
                  isLyricsCardOpen ? 'rotate-180' : ''
                }`}
              />

              {/* Subtle Bottom Song Progress Bar */}
              <span
                style={{ width: `${progressPercent}%` }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-terracotta via-blush-rose to-champagne pointer-events-none"
              />
            </motion.button>
          )}
        </AnimatePresence>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
