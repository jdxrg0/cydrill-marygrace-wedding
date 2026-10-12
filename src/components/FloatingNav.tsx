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
            className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 z-40 sm:w-96 bg-alabaster border-2 border-blush rounded-3xl shadow-2xl p-4 sm:p-5 paper-grain"
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

            {/* 3-Line Karaoke Synced Stage (Previous, Current, Next) */}
            <div className="py-4 px-1 text-center space-y-2.5 min-h-[116px] flex flex-col justify-center">
              {/* Previous Line */}
              <button
                type="button"
                disabled={!prevLyric}
                onClick={() => prevLyric && soundManager.seek(prevLyric.time)}
                className="text-xs font-serif italic text-espresso/50 hover:text-espresso/80 transition-colors line-clamp-1 disabled:pointer-events-none"
              >
                {prevLyric ? prevLyric.text : ' '}
              </button>

              {/* Active Highlighted Line */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeLyricIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-serif text-base sm:text-lg font-bold text-terracotta leading-snug px-2"
                >
                  “{currentLyric.text}”
                </motion.p>
              </AnimatePresence>

              {/* Next Upcoming Line */}
              <button
                type="button"
                disabled={!nextLyric}
                onClick={() => nextLyric && soundManager.seek(nextLyric.time)}
                className="text-xs font-serif italic text-espresso/50 hover:text-espresso/80 transition-colors line-clamp-1 disabled:pointer-events-none"
              >
                {nextLyric ? nextLyric.text : ' '}
              </button>
            </div>

            {/* Interactive Progress Scrubber */}
            <div className="pt-2 border-t border-sand/70">
              <input
                type="range"
                min={0}
                max={duration}
                step={0.5}
                value={currentTime}
                onChange={(e) => soundManager.seek(parseFloat(e.target.value))}
                aria-label="Seek song timeline"
                className="w-full h-1.5 bg-sand rounded-lg appearance-none cursor-pointer accent-terracotta"
              />
              <div className="flex justify-between text-[10px] font-medium text-espresso/60 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span className="uppercase tracking-widest text-terracotta/80">Tap any line to jump</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UNIFIED FLOATING DOCK (Bottom-Right on All Screen Sizes): Syncing Lyrics Pill + Mute Button + Menu */}
      <div className="fixed bottom-4 sm:bottom-5 left-3 right-3 sm:left-auto sm:right-6 z-40 flex items-center justify-end gap-2 pointer-events-none">
        {/* LIVE SYNCING LYRICS PILL ALONGSIDE THE MUTE BUTTON (100% Solid Opaque) */}
        <AnimatePresence>
          {isPlayingMusic && (
            <motion.button
              type="button"
              initial={{ opacity: 0, x: 16, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.92 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => setIsLyricsCardOpen((prev) => !prev)}
              title="Click to expand live synced lyrics"
              className="pointer-events-auto relative overflow-hidden flex-1 sm:flex-initial max-w-[calc(100vw-124px)] sm:max-w-xs md:max-w-sm h-11 px-3.5 rounded-full bg-alabaster hover:bg-sand-light text-espresso border border-blush shadow-xl flex items-center gap-2.5 text-left transition-all active:scale-95"
            >
              {/* Animated Mini Equalizer Bars */}
              <span className="flex items-end gap-[2px] h-3.5 shrink-0" aria-hidden="true">
                <span className="w-[2.5px] bg-terracotta rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-3.5" />
                <span className="w-[2.5px] bg-blush-rose rounded-full animate-[pulse_1.3s_ease-in-out_infinite] h-2" />
                <span className="w-[2.5px] bg-terracotta rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3" />
              </span>

              {/* Smoothly Cross-Fading Synced Lyric Line */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeLyricIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="font-serif italic text-xs sm:text-sm font-semibold text-espresso truncate"
                  >
                    {currentLyric.text}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Expand Chevron Indicator */}
              <ChevronUp
                className={`w-3.5 h-3.5 text-terracotta shrink-0 transition-transform duration-200 ${
                  isLyricsCardOpen ? 'rotate-180' : ''
                }`}
              />

              {/* Subtle Bottom Song Progress Bar */}
              <span
                style={{ width: `${progressPercent}%` }}
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-terracotta via-blush-rose to-champagne transition-all duration-300"
              />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mute / Unmute Toggle Button (Circular Icon-Only) */}
        <motion.button
          layout
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          type="button"
          onClick={onToggleMusic}
          title={`${isPlayingMusic ? 'Mute' : 'Play'} ${music.displayLabel}`}
          aria-label={`${isPlayingMusic ? 'Mute' : 'Play'} ${music.displayLabel}`}
          className={`pointer-events-auto flex items-center justify-center rounded-full w-11 h-11 shadow-xl border transition-colors duration-300 active:scale-95 shrink-0 ${
            isPlayingMusic
              ? 'bg-terracotta text-alabaster border-terracotta-light'
              : 'bg-alabaster text-espresso border-champagne'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isPlayingMusic ? (
              <motion.span
                key="playing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center"
              >
                <Volume2 className="w-4 h-4 animate-pulse" />
              </motion.span>
            ) : (
              <motion.span
                key="muted"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center"
              >
                <VolumeX className="w-4 h-4 text-terracotta" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Editorial "Chapters" Menu Button (Circular Icon-Only) */}
        <motion.button
          layout
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          type="button"
          onClick={() => setIsMenuOpen(true)}
          title="Open invitation chapters menu"
          aria-label="Open invitation chapters menu"
          className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full bg-espresso hover:bg-espresso/95 text-sand-light border border-champagne/50 shadow-xl transition-colors active:scale-95 shrink-0"
        >
          <Menu className="w-4 h-4 text-blush" />
        </motion.button>
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
            className="fixed inset-0 z-50 bg-espresso/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-alabaster paper-grain rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-champagne/60 shadow-2xl px-6 pt-6 pb-8 relative overflow-hidden"
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
