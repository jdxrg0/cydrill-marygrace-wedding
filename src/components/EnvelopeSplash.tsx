import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX, Heart, MailOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingConfig } from '../config/weddingConfig';
import { soundManager } from '../utils/sound';

interface EnvelopeSplashProps {
  onOpenComplete: (startAudio: boolean) => void;
  onStartAudio?: () => void;
  variant?: 'boho' | 'stationery';
}

/**
 * Extracts optional personalized recipient name from URL (?to=..., ?guest=...)
 */
function getGuestRecipient(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const raw =
    params.get('to') ||
    params.get('guest') ||
    params.get('for') ||
    params.get('name') ||
    params.get('recipient') ||
    '';
  const decoded = decodeURIComponent(raw.replace(/\+/g, ' ')).trim();
  return decoded.length > 0 ? decoded : null;
}

/**
 * Light romantic floating petals in the background
 */
const SubtlePetals: React.FC = () => {
  const petals = useMemo(
    () => [
      { id: 1, left: '8%', delay: 0, duration: 10, size: 14, isPetal: true },
      { id: 2, left: '22%', delay: 2.5, duration: 11, size: 16, isPetal: false },
      { id: 3, left: '50%', delay: 1.2, duration: 9.5, size: 13, isPetal: true },
      { id: 4, left: '76%', delay: 3.4, duration: 12, size: 15, isPetal: true },
      { id: 5, left: '90%', delay: 0.8, duration: 10.5, size: 14, isPetal: false },
    ],
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute -top-6 pointer-events-none select-none opacity-0"
          style={{
            left: p.left,
            animation: `floatPetal ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.isPetal ? (
            <svg width={p.size} height={p.size * 1.3} viewBox="0 0 24 32" fill="none">
              <path
                d="M12 0 C22 10, 24 24, 12 32 C0 24, 2 10, 12 0 Z"
                fill="#E8C5C8"
                fillOpacity="0.5"
              />
            </svg>
          ) : (
            <svg width={p.size} height={p.size * 1.2} viewBox="0 0 20 28" fill="none">
              <path
                d="M10 0 C18 8, 18 20, 10 28 C2 20, 2 8, 10 0 Z"
                fill="#6B8467"
                fillOpacity="0.35"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export const EnvelopeSplash: React.FC<EnvelopeSplashProps> = ({
  onOpenComplete,
  onStartAudio,
  variant = 'boho',
}) => {
  const [stage, setStage] = useState<'closed' | 'opening' | 'card-revealed'>('closed');
  const [withMusic, setWithMusic] = useState(true);

  const recipientName = useMemo(() => getGuestRecipient(), []);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const { couple, schedule, location, music, photos } = weddingConfig;
  const isStationery = variant === 'stationery';
  const isOpening = stage !== 'closed';

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  /**
   * 1-Tap Open:
   * Tapping the wax seal, envelope, or button starts music,
   * folds open the flap, glides the card up, and smoothly reveals the site.
   */
  const handleOpen = () => {
    if (stage !== 'closed') {
      // Tap again while card is revealing -> enters immediately
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      onOpenComplete(withMusic);
      return;
    }

    // 1. Synchronously trigger audio on user gesture for iOS/Android permissions
    if (withMusic) {
      if (onStartAudio) {
        onStartAudio();
      } else {
        soundManager.playEnvelopeChime();
        soundManager.start();
      }
    }

    // 2. Confetti burst from seal
    try {
      let x = 0.5;
      let y = 0.5;
      if (sealRef.current) {
        const rect = sealRef.current.getBoundingClientRect();
        x = (rect.left + rect.width / 2) / window.innerWidth;
        y = (rect.top + rect.height / 2) / window.innerHeight;
      }
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x, y },
        colors: ['#E8C5C8', '#D49499', '#C8A97E', '#6B8467', '#FAFBF9'],
        gravity: 0.9,
      });
    } catch {
      // Confetti fallback
    }

    // 3. Flap folds open
    setStage('opening');

    // 4. Card slides up
    setTimeout(() => {
      setStage('card-revealed');
      soundManager.playCardSlideSound();
    }, 300);

    // 5. Enter website after card reveals (~1.1s)
    transitionTimerRef.current = window.setTimeout(() => {
      onOpenComplete(withMusic);
    }, 1150);
  };

  const handleSkipDirectly = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (withMusic && onStartAudio) {
      onStartAudio();
    }
    onOpenComplete(withMusic);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className={`fixed inset-0 h-[100dvh] w-full z-50 flex flex-col justify-between items-center overflow-x-hidden overflow-y-auto px-4 py-3 sm:px-6 sm:py-5 select-none ${
        isStationery
          ? 'bg-[#FAFBF9] bg-gradient-to-br from-[#FAFBF9] via-[#F2F5F0] to-[#E2EAE0]'
          : 'bg-[#F5F8F4] bg-gradient-to-br from-[#F5F8F4] via-[#EAF0E8] to-[#DCE5D8]'
      }`}
    >
      {/* Textured Paper Grain */}
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-35 z-0" />

      {/* Floating Petals */}
      <SubtlePetals />

      {/* Soft Ambient Glow Orbs */}
      <div className="pointer-events-none absolute top-10 left-10 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-blush/20 blur-3xl z-[1]" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-sage-light/20 blur-3xl z-[1]" />

      {/* =========================================================================
          TOP: HEADER BAR (Mobile-friendly, no text truncation)
          ========================================================================= */}
      <header className="w-full max-w-md flex items-center justify-between z-20 shrink-0 pt-1 px-1">
        <div className="text-left">
          <span className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-rust/90 font-semibold block leading-tight">
            {couple.nuptialTitle}
          </span>
          <span className="text-[9px] sm:text-[11px] tracking-[0.14em] uppercase text-espresso/65 font-medium block mt-0.5">
            <span className="sm:hidden">21 Dec 2026 • San Fabian</span>
            <span className="hidden sm:inline">{schedule.dateFormatted} • {location.addressLine2}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleSkipDirectly}
          className="text-[9.5px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-espresso/80 hover:text-espresso bg-alabaster/90 hover:bg-white px-3 py-1.5 sm:px-3.5 rounded-full border border-terracotta/25 shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 touch-manipulation cursor-pointer shrink-0"
        >
          <span>Skip to Website</span>
          <ArrowRight className="w-3 h-3 text-terracotta" />
        </button>
      </header>

      {/* =========================================================================
          CENTER: GREETING & ENVELOPE (Naturally centered in viewport)
          ========================================================================= */}
      <div className="w-full max-w-md flex flex-col items-center justify-center z-10 my-auto py-2">
        {/* Top Greeting */}
        <div className="text-center mb-2.5 sm:mb-3.5 pointer-events-none">
          <p className="text-[9px] sm:text-xs uppercase tracking-[0.3em] text-rust/90 font-semibold mb-0.5">
            Wedding Invitation
          </p>
          <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-espresso drop-shadow-sm leading-tight">
            {couple.groomFirstName} & {couple.brideFirstName}
          </h1>
          <p className="text-[9px] sm:text-xs text-espresso/70 tracking-[0.18em] uppercase mt-0.5">
            {schedule.dayOfWeek} • {schedule.dateFormatted}
          </p>
        </div>

        {/* =========================================================================
            THE ENVELOPE (Optimized for Mobile Touch)
            ========================================================================= */}
        <div
          onClick={handleOpen}
          className="relative w-[90vw] max-w-[440px] aspect-[1.46/1] z-20 cursor-pointer group active:scale-[0.99] transition-transform touch-manipulation select-none"
          title="Tap to open invitation"
        >
          {/* LAYER 0: ENVELOPE BACK JACKET & BOTANICAL INNER LINER */}
          <div
            className={`absolute inset-0 z-0 rounded-2xl shadow-envelope border overflow-hidden ${
              isStationery
                ? 'bg-[#EAEFE8] border-[#CAD5C6]'
                : 'bg-[#D2DDD0] border-[#BAC7B6]'
            }`}
          >
            {/* Inner Liner */}
            <div className="absolute inset-1.5 sm:inset-2 rounded-xl overflow-hidden bg-[#FAFBF9] border border-champagne/40">
              <svg
                className="absolute inset-0 w-full h-full opacity-35"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="botanicalLinerPatternMobile"
                    x="0"
                    y="0"
                    width="60"
                    height="60"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M10 50 C20 40, 30 25, 45 10"
                      stroke="#6B8467"
                      strokeWidth="1.2"
                      fill="none"
                    />
                    <path
                      d="M20 40 C14 36, 12 28, 20 26 C24 30, 24 36, 20 40 Z"
                      fill="#6B8467"
                      fillOpacity="0.35"
                    />
                    <path
                      d="M32 28 C38 32, 44 28, 42 22 C36 22, 34 26, 32 28 Z"
                      fill="#6B8467"
                      fillOpacity="0.3"
                    />
                    <circle cx="16" cy="44" r="1.5" fill="#D49499" fillOpacity="0.6" />
                    <circle cx="42" cy="12" r="1.5" fill="#D49499" fillOpacity="0.6" />
                    <circle cx="52" cy="48" r="1.8" fill="#C8A97E" fillOpacity="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#botanicalLinerPatternMobile)" />
              </svg>

              {/* Stamped Gold Monogram on Inner Liner */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-35">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-champagne flex flex-col items-center justify-center">
                  <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-widest text-espresso">
                    {couple.monogram}
                  </span>
                  <span className="text-[7.5px] uppercase tracking-[0.25em] text-terracotta mt-0.5">
                    {schedule.shortDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LAYER 1: TAPERED TOP FLAP */}
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{
              scaleY: isOpening ? -1 : 1,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              transformOrigin: 'top center',
              zIndex: isOpening ? 5 : 30,
            }}
            className="absolute inset-x-0 top-0 h-[48%] pointer-events-none"
          >
            <svg
              viewBox="0 0 540 180"
              className="w-full h-full overflow-visible drop-shadow-[0_6px_14px_rgba(34,43,35,0.14)]"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,8 Q 0,0 8,0 L 532,0 Q 540,0 540,8 L 282,168 Q 270,176 258,168 Z"
                fill={isOpening ? '#FAFBF9' : '#E3EBE0'}
                stroke="#BAC7B6"
                strokeWidth="1.5"
              />
              <path
                d="M 16,8 L 260,158 Q 270,164 280,158 L 524,8"
                fill="none"
                stroke="#C8A97E"
                strokeOpacity="0.65"
                strokeWidth="1.3"
              />
            </svg>
          </motion.div>

          {/* LAYER 2: ELEGANT INVITATION CARD (Glides out of envelope) */}
          <motion.div
            initial={{ y: 12, scale: 0.95 }}
            animate={
              stage === 'card-revealed'
                ? { y: -85, scale: 1.02 }
                : stage === 'opening'
                ? { y: -25, scale: 0.97 }
                : { y: 12, scale: 0.95 }
            }
            transition={{
              duration: stage === 'card-revealed' ? 0.5 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              zIndex: stage === 'card-revealed' ? 35 : 10,
            }}
            className="absolute inset-x-2 sm:inset-x-4 top-2 bottom-2 rounded-xl bg-alabaster border border-[#D5E0D2] shadow-xl p-2 sm:p-3.5 flex flex-col items-center justify-between text-center overflow-hidden"
          >
            <div className="border border-champagne/60 rounded-lg w-full h-full flex flex-col items-center justify-between p-2 sm:p-3 relative bg-gradient-to-b from-[#FFFFFF] via-[#FAFBF9] to-[#F5F8F4] overflow-hidden">
              <div className="w-full">
                <span className="text-[8px] sm:text-[9.5px] uppercase tracking-[0.35em] text-terracotta font-semibold">
                  Save The Date
                </span>
                <h2 className="font-serif text-base sm:text-xl font-semibold tracking-wide text-espresso uppercase leading-snug">
                  {couple.displayTitle}
                </h2>
              </div>

              {/* Couple Cameo & Schedule */}
              <div className="my-0.5 flex items-center justify-center gap-3 px-2">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full p-0.5 border-2 border-champagne shadow-md overflow-hidden bg-sand-light shrink-0">
                  <img
                    src={photos.cameoPortrait || '/photos/grace-cydrill-04.jpg'}
                    alt={couple.displayTitle}
                    className="w-full h-full object-cover rounded-full"
                    style={{ objectPosition: 'center 6%' }}
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-left">
                  <p className="text-[9px] sm:text-xs font-semibold tracking-[0.2em] text-rust uppercase">
                    {schedule.dayOfWeek}
                  </p>
                  <p className="text-xs sm:text-sm font-serif font-bold tracking-wider text-espresso">
                    {schedule.dateFormatted}
                  </p>
                  <p className="text-[8.5px] sm:text-[10px] text-espresso/70 mt-0.5">
                    {schedule.timeFormatted}
                  </p>
                </div>
              </div>

              {/* Venue */}
              <div className="w-full">
                <p className="text-[8.5px] sm:text-[10.5px] text-espresso/80 font-medium tracking-wide">
                  {location.venueName} • {location.addressLine2}
                </p>
              </div>
            </div>
          </motion.div>

          {/* LAYER 3: FRONT ENVELOPE POCKET & VELLUM BELLY BAND */}
          <div
            style={{ zIndex: 20 }}
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
          >
            {/* Pocket Linen Cardstock */}
            <div
              className={`absolute inset-0 shadow-inner ${
                isStationery
                  ? 'bg-gradient-to-b from-[#EAEFE8] via-[#E2EAE0] to-[#D5E0D2]'
                  : 'bg-gradient-to-b from-[#D4DFD1] via-[#C8D6C4] to-[#BCCDB8]'
              }`}
            />

            {/* Translucent Vellum Belly Band */}
            <motion.div
              animate={{ opacity: stage === 'card-revealed' ? 0.6 : 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-2 sm:bottom-3 h-[66px] sm:h-[74px] z-20 bg-[#FAFBF9]/60 backdrop-blur-md border-y border-[#C8A97E]/40 shadow-xs flex items-center justify-center px-3"
            >
              <div className="w-full flex flex-col items-center justify-center text-center">
                <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.28em] text-rust font-semibold mb-0.5">
                  {recipientName ? 'SPECIALLY PREPARED FOR' : 'CORDIALLY INVITED'}
                </span>
                <p className="font-script text-2xl sm:text-3xl text-espresso font-medium leading-none drop-shadow-sm px-2 truncate max-w-full">
                  {recipientName || 'Our Beloved Family & Friends'}
                </p>
                <span className="text-[7px] sm:text-[7.5px] uppercase tracking-[0.2em] text-terracotta font-medium mt-1">
                  TO CELEBRATE OUR WEDDING
                </span>
              </div>
            </motion.div>
          </div>

          {/* LAYER 4: VINTAGE POSTAGE STAMP & CANCELLATION (Neatly aligned in corner) */}
          <motion.div
            animate={{ opacity: isOpening ? 0 : 1, scale: isOpening ? 0.9 : 1 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 45 }}
            className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 pointer-events-none select-none"
          >
            <div className="relative rotate-2">
              {/* Circular Date Postmark */}
              <div className="absolute -left-[30px] sm:-left-[36px] -top-1 pointer-events-none z-20">
                <div className="relative w-[38px] h-[38px] sm:w-[44px] sm:h-[44px] rounded-full border-[1.1px] border-rust/55 flex flex-col items-center justify-center text-center -rotate-12 opacity-85">
                  <div className="absolute inset-0.5 rounded-full border border-dashed border-rust/40" />
                  <span className="text-[4px] sm:text-[5px] tracking-[0.14em] uppercase font-bold text-rust whitespace-nowrap">
                    SAN FABIAN
                  </span>
                  <span className="text-[5px] sm:text-[6px] font-mono font-bold text-rust tracking-wider my-0.2 whitespace-nowrap">
                    21•12•26
                  </span>
                  <span className="text-[3.5px] sm:text-[4px] uppercase tracking-[0.12em] text-rust/80 font-medium whitespace-nowrap">
                    PANGASINAN
                  </span>
                </div>
              </div>

              {/* Perforated Postage Stamp */}
              <div className="relative w-[54px] h-[72px] sm:w-[62px] sm:h-[82px] drop-shadow-md bg-white rounded-xs border border-champagne/70 p-1 flex flex-col items-center justify-between text-center overflow-hidden">
                <span className="text-[6px] uppercase tracking-[0.14em] text-rust font-bold pt-0.5 whitespace-nowrap">
                  PHILIPPINES
                </span>
                <div className="flex flex-col items-center my-auto">
                  <span className="font-serif text-xs sm:text-sm font-bold tracking-widest text-espresso whitespace-nowrap">
                    {couple.monogram}
                  </span>
                  <Heart className="w-1.5 h-1.5 text-blush-rose fill-blush/60 mt-0.5" />
                </div>
                <div className="pb-0.5">
                  <span className="font-serif text-[6.5px] uppercase tracking-[0.18em] font-semibold text-espresso block whitespace-nowrap">
                    FOREVER
                  </span>
                  <span className="text-[5.5px] text-rust/80 font-medium block whitespace-nowrap">
                    2026
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LAYER 5: WAX SEAL WITH "TAP TO OPEN" */}
          <div
            style={{ zIndex: 40 }}
            className={`absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 ${
              isOpening ? 'pointer-events-none' : ''
            }`}
          >
            <div className="relative flex flex-col items-center" ref={sealRef}>
              {/* Tap to Open Callout */}
              <AnimatePresence>
                {!isOpening && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: [0, -3, 0] }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    className="absolute -top-11 sm:-top-13 flex flex-col items-center pointer-events-none select-none z-30"
                  >
                    <span className="font-script text-xl sm:text-2xl text-espresso font-medium -rotate-2 drop-shadow-sm whitespace-nowrap">
                      Tap to open
                    </span>
                    <svg
                      width="26"
                      height="18"
                      viewBox="0 0 34 26"
                      fill="none"
                      className="text-espresso/70 drop-shadow-sm -mt-0.5"
                    >
                      <path
                        d="M 8 2 C 16 3, 24 7, 22 19"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 16 15 L 21.5 20 L 26 14.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Realistic Wax Seal (Fixed Pixel Dimensions & No Text Wrap) */}
              <motion.div
                animate={
                  isOpening
                    ? { scale: [1, 1.25, 0.2], opacity: [1, 1, 0], rotate: 12 }
                    : { scale: [1, 1.04, 1] }
                }
                transition={
                  isOpening
                    ? { duration: 0.32, ease: 'easeOut' }
                    : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                }
                className="relative w-[74px] h-[74px] sm:w-[84px] sm:h-[84px] flex items-center justify-center cursor-pointer select-none group active:scale-95 transition-transform shrink-0"
              >
                {/* Organic Wax SVG */}
                <svg
                  viewBox="0 0 120 120"
                  className="absolute inset-0 w-full h-full drop-shadow-[0_4px_12px_rgba(140,66,73,0.35)]"
                >
                  <defs>
                    <radialGradient id="luxWaxGradMobile" cx="35%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#FCE8EB" />
                      <stop offset="25%" stopColor="#E29DA3" />
                      <stop offset="65%" stopColor="#BD626A" />
                      <stop offset="100%" stopColor="#82383F" />
                    </radialGradient>
                    <linearGradient id="goldRimGradMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF2D6" />
                      <stop offset="50%" stopColor="#C8A97E" />
                      <stop offset="100%" stopColor="#8F7249" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 60,3 C 76,2 92,8 101,18 C 111,28 118,44 117,59 C 116,75 110,91 99,102 C 88,113 72,118 57,117 C 41,116 26,110 16,98 C 6,86 1,70 2,55 C 3,39 10,24 22,14 C 34,4 47,4 60,3 Z"
                    fill="url(#luxWaxGradMobile)"
                    stroke="#FAF0F1"
                    strokeOpacity="0.65"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="43"
                    fill="none"
                    stroke="url(#goldRimGradMobile)"
                    strokeWidth="1.3"
                    strokeDasharray="2,3"
                    strokeOpacity="0.85"
                  />
                </svg>

                {/* Stamped Center with Monogram (Single-line guaranteed) */}
                <div className="relative z-10 w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] rounded-full border border-[#FAF0F1]/70 bg-gradient-to-tl from-[#82383F] via-[#BD626A] to-[#E29DA3] flex flex-col items-center justify-center shadow-inner">
                  <span className="font-serif text-sm sm:text-base font-bold tracking-widest text-[#FFFBF9] whitespace-nowrap leading-none select-none drop-shadow-xs">
                    {couple.monogram}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 opacity-90">
                    <span className="w-1.5 h-[0.8px] bg-champagne" />
                    <Heart className="w-2 h-2 text-champagne fill-champagne" />
                    <span className="w-1.5 h-[0.8px] bg-champagne" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM: ACTIONS IN MOBILE THUMB ZONE (No empty space)
          ========================================================================= */}
      <div className="w-full max-w-md flex flex-col items-center gap-2 z-20 shrink-0 pb-3 sm:pb-5">
        {/* Prominent Action Button */}
        <button
          type="button"
          onClick={handleOpen}
          className="w-full max-w-[280px] sm:max-w-[310px] py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-terracotta via-terracotta to-terracotta-dark hover:brightness-105 active:scale-95 text-alabaster font-sans text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase shadow-[0_4px_16px_rgba(62,82,59,0.2)] transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
        >
          <MailOpen className="w-4 h-4 text-alabaster" />
          <span>{isOpening ? 'Opening Invitation...' : 'Open Invitation'}</span>
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setWithMusic(!withMusic);
          }}
          className="inline-flex items-center gap-2 text-[10px] sm:text-xs text-espresso/75 hover:text-espresso cursor-pointer bg-white/80 hover:bg-white px-3.5 py-1.5 rounded-full border border-terracotta/20 shadow-xs transition-all touch-manipulation"
        >
          {withMusic ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-terracotta" />
              <span className="font-medium">Music: {music.title} (On)</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-espresso/50" />
              <span className="font-medium">Music: Muted</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default EnvelopeSplash;
