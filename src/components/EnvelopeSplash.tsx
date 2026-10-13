import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  Heart,
  CalendarPlus,
  Copy,
  Check,
  RotateCw,
  Edit3,
  X,
  Share2,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingConfig } from '../config/weddingConfig';
import { soundManager } from '../utils/sound';
import { getGoogleCalendarUrl, openGoogleCalendarApp } from '../utils/calendar';
import { BotanicalSprig } from './Dividers';

interface EnvelopeSplashProps {
  onOpenComplete: (startAudio: boolean) => void;
  onStartAudio?: () => void;
  variant?: 'boho' | 'stationery';
}

type OpenStage =
  | 'idle'
  | 'unsealing'
  | 'flap-open'
  | 'card-peeking'
  | 'card-presented'
  | 'transitioning';

/**
 * Extracts optional personalized recipient name from URL
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
 * Romantic ambient floating particles: blush petals, sage leaves & gold dust
 */
const FloatingPetals: React.FC = () => {
  const petals = useMemo(
    () => [
      { id: 1, left: '6%', delay: 0, duration: 9.5, size: 14, type: 'petal' },
      { id: 2, left: '16%', delay: 3.2, duration: 11.2, size: 18, type: 'leaf' },
      { id: 3, left: '26%', delay: 1.5, duration: 8.8, size: 8, type: 'sparkle' },
      { id: 4, left: '38%', delay: 5.1, duration: 10.4, size: 16, type: 'petal' },
      { id: 5, left: '49%', delay: 2.1, duration: 12.0, size: 12, type: 'leaf' },
      { id: 6, left: '59%', delay: 4.4, duration: 9.1, size: 9, type: 'sparkle' },
      { id: 7, left: '71%', delay: 0.8, duration: 10.8, size: 17, type: 'petal' },
      { id: 8, left: '83%', delay: 3.9, duration: 11.5, size: 13, type: 'leaf' },
      { id: 9, left: '92%', delay: 1.9, duration: 8.5, size: 8, type: 'sparkle' },
      { id: 10, left: '12%', delay: 6.2, duration: 10.0, size: 15, type: 'petal' },
      { id: 11, left: '78%', delay: 5.7, duration: 9.7, size: 16, type: 'petal' },
    ],
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[2]">
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
          {p.type === 'petal' ? (
            <svg
              width={p.size}
              height={p.size * 1.3}
              viewBox="0 0 24 32"
              fill="none"
              className="rotate-12"
            >
              <path
                d="M12 0 C22 10, 24 24, 12 32 C0 24, 2 10, 12 0 Z"
                fill="#E8C5C8"
                fillOpacity="0.55"
              />
            </svg>
          ) : p.type === 'leaf' ? (
            <svg
              width={p.size}
              height={p.size * 1.2}
              viewBox="0 0 20 28"
              fill="none"
              className="-rotate-45"
            >
              <path
                d="M10 0 C18 8, 18 20, 10 28 C2 20, 2 8, 10 0 Z"
                fill="#6B8467"
                fillOpacity="0.45"
              />
            </svg>
          ) : (
            <div
              style={{ width: p.size, height: p.size }}
              className="rounded-full bg-champagne/60 shadow-[0_0_8px_rgba(200,169,126,0.8)]"
            />
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
  const [stage, setStage] = useState<OpenStage>('idle');
  const [withMusic, setWithMusic] = useState(true);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [copiedHashtag, setCopiedHashtag] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 3D Parallax tilt
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Wax seal tap-and-hold charge (0-100)
  const [holdProgress, setHoldProgress] = useState(0);
  const [showHoldHint, setShowHoldHint] = useState(false);
  const holdIntervalRef = useRef<number | null>(null);
  const holdHintTimeoutRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const quickTapCountRef = useRef<number>(0);

  // Stamp click feedback animation
  const [stampSquash, setStampSquash] = useState(false);

  // Recipient Personalization
  const initialGuest = useMemo(() => getGuestRecipient(), []);
  const [recipientName, setRecipientName] = useState<string>(initialGuest || '');
  const [isEditingRecipient, setIsEditingRecipient] = useState(false);
  const [editInputValue, setEditInputValue] = useState(initialGuest || '');

  const sealRef = useRef<HTMLDivElement | null>(null);
  const autoProceedTimerRef = useRef<number | null>(null);

  const { couple, schedule, location, music, photos } = weddingConfig;
  const isStationery = variant === 'stationery';
  const isOpening = stage !== 'idle';
  const isFlapBehindCard =
    stage === 'flap-open' ||
    stage === 'card-peeking' ||
    stage === 'card-presented' ||
    stage === 'transitioning';

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current !== null) {
        clearInterval(holdIntervalRef.current);
      }
      if (holdHintTimeoutRef.current !== null) {
        clearTimeout(holdHintTimeoutRef.current);
      }
      if (autoProceedTimerRef.current !== null) {
        window.clearTimeout(autoProceedTimerRef.current);
      }
    };
  }, []);

  // 3D Tilt calculation on mouse move (only active before opening starts)
  const handleEnvelopeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpening) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -(y * 8),
      y: x * 10,
    });
  };

  const handleEnvelopeMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Celebratory confetti burst originating from the wax seal
  const fireConfetti = () => {
    try {
      let x = 0.5;
      let y = 0.55;

      if (sealRef.current) {
        const rect = sealRef.current.getBoundingClientRect();
        x = (rect.left + rect.width / 2) / window.innerWidth;
        y = (rect.top + rect.height / 2) / window.innerHeight;
      }

      confetti({
        particleCount: 50,
        spread: 65,
        origin: { x, y },
        colors: ['#E8C5C8', '#D49499', '#C8A97E', '#6B8467', '#FAFBF9'],
        ticks: 200,
        gravity: 0.85,
        scalar: 1.05,
      });

      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 85,
          origin: { x, y: Math.max(0.1, y - 0.04) },
          colors: ['#FAFBF9', '#C8A97E', '#E8C5C8', '#B8C7B4'],
          ticks: 160,
          gravity: 0.9,
          scalar: 0.85,
        });
      }, 140);
    } catch {
      // Confetti fallback
    }
  };

  // Action: Open Envelope Sequence
  const handleOpen = () => {
    if (isOpening) return;

    setTilt({ x: 0, y: 0 });

    if (withMusic && onStartAudio) {
      onStartAudio();
    }

    fireConfetti();
    setStage('unsealing');

    // Flap folds backward
    setTimeout(() => {
      setStage('flap-open');
    }, 300);

    // Card smoothly glides out into full presentation
    setTimeout(() => {
      handleRevealCard();
    }, 620);
  };

  // Action: Reveal the card to presented state (drag or tap)
  const handleRevealCard = () => {
    if (stage === 'card-presented' || stage === 'transitioning') return;

    soundManager.playCardSlideSound();
    setStage('card-presented');

    confetti({
      particleCount: 22,
      spread: 50,
      origin: { y: 0.4 },
      colors: ['#C8A97E', '#FAFBF9', '#D49499'],
      scalar: 0.8,
    });

    // Auto-proceed into website after 10 seconds of card presentation
    if (autoProceedTimerRef.current !== null) {
      window.clearTimeout(autoProceedTimerRef.current);
    }
    autoProceedTimerRef.current = window.setTimeout(() => {
      handleProceed();
    }, 10000);
  };

  // Action: Proceed smoothly into main wedding website
  const handleProceed = () => {
    if (stage === 'transitioning') return;
    if (autoProceedTimerRef.current !== null) {
      window.clearTimeout(autoProceedTimerRef.current);
    }
    setStage('transitioning');
    setTimeout(() => {
      onOpenComplete(withMusic);
    }, 550);
  };

  const handleDirectSkip = () => {
    if (withMusic && onStartAudio) {
      onStartAudio();
    }
    handleProceed();
  };

  // Action: Interactive Wax Seal Tap-and-Hold with Quick Tap Fallback
  const handleSealClick = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
  };

  const handleSealPointerDown = () => {
    if (isOpening) return;

    // Synchronously unlock audio on user gesture
    if (withMusic && onStartAudio) {
      onStartAudio();
    }

    if (holdHintTimeoutRef.current !== null) {
      clearTimeout(holdHintTimeoutRef.current);
      holdHintTimeoutRef.current = null;
    }
    setShowHoldHint(false);

    holdStartTimeRef.current = Date.now();
    const duration = 850; // Deliberate, tactile 850ms tap-and-hold melt
    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setHoldProgress(progress);
      if (progress >= 100) {
        if (holdIntervalRef.current !== null) {
          clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
        }
        setHoldProgress(0);
        handleOpen();
      }
    }, 16);
  };

  const handleSealPointerUp = () => {
    if (holdIntervalRef.current !== null) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }

    if (isOpening) {
      setHoldProgress(0);
      return;
    }

    const elapsed = Date.now() - (holdStartTimeRef.current || 0);

    // If held for majority of the duration (600ms+), complete the open!
    if (elapsed >= 600 || holdProgress >= 70) {
      setHoldProgress(0);
      handleOpen();
      return;
    }

    // Double tap fallback: second tap opens immediately
    quickTapCountRef.current += 1;
    if (quickTapCountRef.current >= 2) {
      quickTapCountRef.current = 0;
      setHoldProgress(0);
      handleOpen();
      return;
    }

    // First quick tap: nudge user with gentle wiggle & prompt
    setHoldProgress(0);
    setShowHoldHint(true);
    if (holdHintTimeoutRef.current !== null) {
      clearTimeout(holdHintTimeoutRef.current);
    }
    holdHintTimeoutRef.current = window.setTimeout(() => {
      setShowHoldHint(false);
      quickTapCountRef.current = 0;
    }, 2200);
  };

  const handleSealPointerCancel = () => {
    if (holdIntervalRef.current !== null) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setHoldProgress(0);
  };

  // Action: Interactive Postage Stamp Tap
  const handleStampClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playStampSound();
    setStampSquash(true);

    confetti({
      particleCount: 16,
      spread: 45,
      origin: { x: 0.72, y: 0.38 },
      colors: ['#D49499', '#E8C5C8', '#C8A97E'],
      scalar: 0.8,
    });

    setTimeout(() => setStampSquash(false), 200);
  };

  // Action: Flip 3D Invitation Card
  const handleFlipCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (autoProceedTimerRef.current !== null) {
      window.clearTimeout(autoProceedTimerRef.current);
      autoProceedTimerRef.current = null;
    }
    soundManager.playFlipSound();
    setIsCardFlipped((prev) => !prev);
  };

  // Action: Copy Hashtag
  const handleCopyHashtag = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(couple.hashtag);
    setCopiedHashtag(true);
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#6B8467', '#D49499', '#C8A97E'],
    });
    setTimeout(() => setCopiedHashtag(false), 2200);
  };

  // Action: Save Personalized Name
  const handleSaveRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editInputValue.trim();
    setRecipientName(trimmed);
    setIsEditingRecipient(false);

    confetti({
      particleCount: 20,
      spread: 45,
      origin: { x: 0.45, y: 0.5 },
      colors: ['#E8C5C8', '#C8A97E'],
    });
  };

  // Action: Copy Personalized Share Link
  const handleCopyShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = new URL(window.location.href);
    if (recipientName.trim()) {
      url.searchParams.set('to', recipientName.trim());
    }
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
      className={`fixed inset-0 h-[100dvh] w-full z-50 flex flex-col items-center justify-between overflow-hidden px-4 py-3 sm:px-6 sm:py-6 select-none ${
        isStationery
          ? 'bg-[#FAFBF9] bg-gradient-to-br from-[#FAFBF9] via-[#F2F5F0] to-[#E2EAE0]'
          : 'bg-[#F5F8F4] bg-gradient-to-br from-[#F5F8F4] via-[#EAF0E8] to-[#DCE5D8]'
      }`}
    >
      {/* Textured Cotton Paper Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 paper-grain opacity-40 z-0" />

      {/* Ambient Floating Rose Petals & Gold Dust */}
      <FloatingPetals />

      {/* Ambient Sage & Blush Glow Orbs */}
      <div className="pointer-events-none absolute top-10 left-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blush/25 blur-3xl z-[1]" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-terracotta/15 blur-3xl z-[1]" />

      {/* Corner Botanicals (Subtly framed in corners so they never cut across header text) */}
      <BotanicalSprig
        className="fixed -top-14 -left-14 sm:-top-12 sm:-left-12 w-32 h-32 sm:w-72 sm:h-72 rotate-90 opacity-20 sm:opacity-40 pointer-events-none z-[1] hidden sm:block"
        color={isStationery ? '#6B8467' : '#465943'}
      />
      <BotanicalSprig
        className="fixed -bottom-16 -right-14 sm:-bottom-14 sm:-right-12 w-36 h-36 sm:w-80 sm:h-80 -rotate-90 opacity-20 sm:opacity-40 pointer-events-none z-[1]"
        color="#6B8467"
      />

      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between z-20 pt-1 sm:pt-2 px-1">
        <div className="text-left">
          <span className="text-[9.5px] sm:text-xs tracking-[0.22em] sm:tracking-[0.28em] uppercase text-rust/90 font-semibold block leading-tight">
            {couple.nuptialTitle}
          </span>
          <span className="text-[8px] sm:text-[11px] tracking-[0.12em] sm:tracking-[0.18em] uppercase text-espresso/65 font-medium block truncate max-w-[200px] xs:max-w-[240px] sm:max-w-none leading-tight mt-0.5">
            <span className="sm:hidden">21 Dec 2026 • San Fabian, Pangasinan</span>
            <span className="hidden sm:inline">{schedule.dateFormatted} • {location.addressLine2}</span>
          </span>
        </div>

        <button
          onClick={handleDirectSkip}
          className="text-[9.5px] sm:text-xs uppercase tracking-[0.18em] font-semibold text-espresso/80 hover:text-espresso bg-alabaster/90 hover:bg-white px-3.5 py-1.5 rounded-full border border-terracotta/25 shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95 touch-manipulation"
          aria-label="Skip splash screen to view wedding details"
        >
          <span>Skip to Website</span>
          <ArrowRight className="w-3 h-3 text-terracotta" />
        </button>
      </header>

      {/* =========================================================================
          MIDDLE SECTION: SCRIPT HEADING + 3D PARALLAX TILT ENVELOPE
          ========================================================================= */}
      <div className="w-full flex-1 flex flex-col items-center justify-center z-10 perspective-1000 py-1 sm:py-3">
        {/* Top Script Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={
            isOpening
              ? { opacity: 0, y: -30, scale: 0.95 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center mb-2.5 sm:mb-4 z-10 pointer-events-none"
        >
          <p className="text-[9.5px] sm:text-xs uppercase tracking-[0.35em] text-rust/90 font-semibold mb-0.5">
            Formal Wedding Invitation
          </p>
          <h1 className="font-script text-4xl sm:text-6xl md:text-7xl text-espresso drop-shadow-sm leading-tight">
            {couple.envelopeGreeting}
          </h1>
          <p className="text-[9.5px] sm:text-xs text-espresso/70 tracking-[0.18em] uppercase mt-0.5">
            {couple.displayTitle}
          </p>
        </motion.div>

        {/* =========================================================================
            3D PARALLAX ENVELOPE CONTAINER (Optimized aspect ratio for mobile & desktop)
            ========================================================================= */}
        <div
          onMouseMove={handleEnvelopeMouseMove}
          onMouseLeave={handleEnvelopeMouseLeave}
          style={{
            transform: isOpening ? 'none' : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: isOpening ? 'transform 0.4s ease-out' : 'transform 0.15s ease-out',
          }}
          className="relative w-[92vw] max-w-[480px] aspect-[1.42/1] sm:aspect-[1.48/1] z-20 overflow-visible preserve-3d"
        >
          <div className="relative w-full h-full select-none">
            {/* LAYER 0 (z-0): ENVELOPE BACK JACKET & BOTANICAL INNER LINER */}
            <div
              className={`absolute inset-0 z-0 rounded-2xl shadow-envelope border overflow-hidden transition-colors ${
                isStationery
                  ? 'bg-[#EAEFE8] border-[#CAD5C6]'
                  : 'bg-[#D2DDD0] border-[#BAC7B6]'
              }`}
            >
              {/* Botanical Seamless Liner Pattern */}
              <div className="absolute inset-1.5 sm:inset-2 rounded-xl overflow-hidden bg-[#FAFBF9] border border-champagne/40">
                <svg
                  className="absolute inset-0 w-full h-full opacity-35"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="botanicalLinerPatternClean"
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
                  <rect width="100%" height="100%" fill="url(#botanicalLinerPatternClean)" />
                </svg>

                <div
                  className={`absolute inset-0 ${
                    isStationery
                      ? 'bg-gradient-to-b from-[#8FA68B]/35 via-transparent to-[#52674E]/30'
                      : 'bg-gradient-to-b from-[#6B8467]/35 via-transparent to-[#3E523B]/30'
                  }`}
                />

                {/* Stamped Gold Monogram Emblem on Back Pocket */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-champagne flex flex-col items-center justify-center">
                    <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-widest text-espresso">
                      {couple.monogram}
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.25em] text-terracotta mt-0.5">
                      {schedule.shortDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LAYER 1 (z-30 when closed, z-[5] when opened):
                ELEGANT TAPERED TOP FLAP (Tip rests exactly at the wax seal top rim) */}
            <motion.div
              initial={{ scaleY: 1 }}
              animate={{
                scaleY:
                  stage === 'idle'
                    ? 1
                    : stage === 'unsealing'
                    ? 0.05
                    : -1,
              }}
              transition={{
                duration: stage === 'unsealing' ? 0.3 : 0.36,
                ease: stage === 'unsealing' ? 'easeIn' : 'easeOut',
              }}
              style={{
                transformOrigin: 'top center',
                zIndex: isFlapBehindCard ? 5 : 30,
              }}
              className="absolute inset-x-0 top-0 h-[48%] pointer-events-none"
            >
              <svg
                viewBox="0 0 540 180"
                className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(34,43,35,0.16)]"
                preserveAspectRatio="none"
              >
                {/* Tapered V-Flap */}
                <path
                  d="M 0,8 Q 0,0 8,0 L 532,0 Q 540,0 540,8 L 282,168 Q 270,176 258,168 Z"
                  fill={
                    isFlapBehindCard
                      ? isStationery
                        ? '#FAFBF9'
                        : '#F5F8F4'
                      : isStationery
                      ? '#F5F8F4'
                      : '#E3EBE0'
                  }
                  stroke={isStationery ? '#CAD5C6' : '#BAC7B6'}
                  strokeWidth="1.6"
                />

                {/* Delicate Gold/Rose Foil Embossed Border Line */}
                <path
                  d="M 16,8 L 260,158 Q 270,164 280,158 L 524,8"
                  fill="none"
                  stroke={isFlapBehindCard ? '#C8A97E' : '#D49499'}
                  strokeOpacity={isFlapBehindCard ? '0.7' : '0.55'}
                  strokeWidth="1.4"
                />
              </svg>
            </motion.div>

            {/* =========================================================================
                LAYER 2 (z-10 during rise, z-35 when presented):
                DRAGGABLE & 3D FLIPPABLE LUXURY INVITATION CARD
                ========================================================================= */}
            <motion.div
              drag={stage === 'card-peeking' ? 'y' : false}
              dragConstraints={{ top: -110, bottom: 0 }}
              dragElastic={0.12}
              onDragEnd={(_e, info) => {
                if (info.offset.y < -30 || info.velocity.y < -80) {
                  handleRevealCard();
                }
              }}
              initial={{ y: 16, scale: 0.94 }}
              animate={
                stage === 'card-peeking'
                  ? { y: -38, scale: 0.96 }
                  : stage === 'card-presented' || stage === 'transitioning'
                  ? { y: -110, scale: 1.01 }
                  : { y: 16, scale: 0.94 }
              }
              transition={{
                duration: stage === 'card-peeking' ? 0.45 : 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                zIndex:
                  stage === 'card-presented' || stage === 'transitioning' ? 35 : 10,
              }}
              className={`absolute inset-x-2 sm:inset-x-4 top-2 bottom-2 rounded-xl bg-transparent ${
                stage === 'card-peeking'
                  ? 'cursor-grab active:cursor-grabbing'
                  : stage === 'card-presented'
                  ? 'shadow-2xl'
                  : ''
              }`}
            >
              {/* Pulsing Drag-Up Tab Hint when card is peeking */}
              <AnimatePresence>
                {stage === 'card-peeking' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={handleRevealCard}
                    className="absolute -top-10 inset-x-0 flex items-center justify-center cursor-pointer z-50"
                  >
                    <div className="bg-espresso/90 text-alabaster text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.2em] uppercase px-3 py-1 rounded-full shadow-lg border border-champagne flex items-center gap-1.5 animate-bounce">
                      <ChevronUp className="w-3.5 h-3.5 text-champagne" />
                      <span>Pull Card Up or Tap</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 3D FLIPPABLE CONTAINER */}
              <motion.div
                animate={{ rotateY: isCardFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  transformStyle: 'preserve-3d',
                  WebkitTransformStyle: 'preserve-3d',
                }}
                className="relative w-full h-full rounded-xl"
              >
                {/* =================================================================
                    FRONT FACE: FORMAL INVITATION WITH CAMEO & DETAILS
                    ================================================================= */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    opacity: isCardFlipped ? 0 : 1,
                    zIndex: isCardFlipped ? 1 : 2,
                    pointerEvents: isCardFlipped ? 'none' : 'auto',
                    transition: 'opacity 0.25s ease-in-out',
                  }}
                  className="absolute inset-0 w-full h-full rounded-xl bg-alabaster border border-[#D5E0D2] shadow-xl p-2.5 sm:p-4 flex flex-col items-center justify-between text-center overflow-hidden"
                >
                  <div className="border border-champagne/60 rounded-lg w-full h-full flex flex-col items-center justify-between p-2 sm:p-3 relative bg-gradient-to-b from-[#FFFFFF] via-[#FAFBF9] to-[#F5F8F4] overflow-hidden">
                    <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-champagne/80" />
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-champagne/80" />
                    <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-champagne/80" />
                    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-champagne/80" />

                    {/* Card Top */}
                    <div className="w-full">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="h-[1px] w-6 bg-champagne/60" />
                        <span className="text-[8.5px] sm:text-[10px] uppercase tracking-[0.35em] text-terracotta font-semibold">
                          Save The Date
                        </span>
                        <span className="h-[1px] w-6 bg-champagne/60" />
                      </div>
                      <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-semibold tracking-wide text-espresso uppercase leading-snug">
                        {couple.displayTitle}
                      </h2>
                    </div>

                    {/* Card Middle: Couple Cameo Portrait & Date */}
                    <div className="my-1 flex items-center justify-center gap-3 sm:gap-4 px-2">
                      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 border-champagne shadow-md overflow-hidden bg-sand-light shrink-0 ring-2 ring-champagne/40 ring-offset-1">
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
                        <p className="text-[9.5px] sm:text-xs font-semibold tracking-[0.22em] text-rust uppercase">
                          {schedule.dayOfWeek}
                        </p>
                        <p className="text-xs sm:text-base font-serif font-bold tracking-wider text-espresso">
                          {schedule.dateFormatted}
                        </p>
                        <p className="text-[9px] sm:text-[11px] text-espresso/70 mt-0.5">
                          {schedule.timeFormatted}
                        </p>
                      </div>
                    </div>

                    {/* Card Bottom: Venue & Interactive Controls */}
                    <div className="w-full">
                      <p className="text-[9px] sm:text-[11px] text-espresso/80 font-medium tracking-wide">
                        {location.venueName} • {location.addressLine2}
                      </p>

                      <div className="mt-2 flex items-center justify-center gap-2 sm:gap-3">
                        {stage === 'card-presented' && (
                          <button
                            type="button"
                            onClick={handleFlipCard}
                            className="px-3 py-1.5 rounded-full bg-sand-light hover:bg-sand text-espresso text-[9.5px] sm:text-xs font-medium tracking-wider border border-terracotta/25 flex items-center gap-1.5 shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
                            title="Flip card to read personal note and add to calendar"
                          >
                            <RotateCw className="w-3 h-3 text-terracotta" />
                            <span>Flip to Note ↺</span>
                          </button>
                        )}

                        {(stage === 'card-presented' || stage === 'transitioning') && (
                          <button
                            type="button"
                            onClick={handleProceed}
                            className="py-1.5 px-4 rounded-full bg-gradient-to-r from-terracotta via-terracotta-dark to-rust text-alabaster font-sans text-[9.5px] sm:text-xs font-semibold tracking-[0.18em] uppercase shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 relative overflow-hidden whitespace-nowrap shrink-0"
                          >
                            <span className="relative z-10">Step Inside</span>
                            <ArrowRight className="w-3.5 h-3.5 relative z-10" />
                            <div className="absolute inset-0 animate-shimmer-sweep pointer-events-none" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================================
                    BACK FACE: PERSONAL NOTE, ADD TO CALENDAR & HASHTAG
                    ================================================================= */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    WebkitTransform: 'rotateY(180deg)',
                    opacity: isCardFlipped ? 1 : 0,
                    zIndex: isCardFlipped ? 2 : 1,
                    pointerEvents: isCardFlipped ? 'auto' : 'none',
                    transition: 'opacity 0.25s ease-in-out',
                  }}
                  className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-b from-[#FFFFFF] via-[#FAFBF9] to-[#F5F8F4] border border-[#D5E0D2] shadow-xl p-2.5 sm:p-4 flex flex-col items-center justify-between text-center overflow-hidden"
                >
                  <div className="border border-champagne/60 rounded-lg w-full h-full flex flex-col items-center justify-between p-2 sm:p-3 relative overflow-hidden">
                    <div className="w-full">
                      <span className="text-[8px] sm:text-[9.5px] uppercase tracking-[0.3em] text-terracotta font-semibold block mb-0.5">
                        A Note From The Couple
                      </span>
                      <h3 className="font-serif text-sm sm:text-xl font-bold text-espresso">
                        With Grateful Hearts
                      </h3>
                    </div>

                    <div className="px-2 my-0.5">
                      <p className="font-editorial text-[10px] sm:text-xs text-espresso/80 italic leading-relaxed">
                        “We prayed for each other long before our paths crossed. Now, as God unites our hearts forever, your prayers and presence will complete our joy.”
                      </p>
                      <p className="text-[9px] sm:text-[10.5px] font-script text-rust font-semibold mt-0.5">
                        — Cydrill & Mary Grace
                      </p>
                    </div>

                    <div className="w-full flex flex-col gap-1.5 pt-0.5">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={getGoogleCalendarUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (autoProceedTimerRef.current !== null) {
                              window.clearTimeout(autoProceedTimerRef.current);
                              autoProceedTimerRef.current = null;
                            }
                            openGoogleCalendarApp(e);
                          }}
                          className="px-2.5 py-1 rounded-full bg-alabaster hover:bg-white text-espresso text-[8.5px] sm:text-[10px] font-medium border border-champagne shadow-sm flex items-center gap-1 transition-all"
                        >
                          <CalendarPlus className="w-3 h-3 text-terracotta" />
                          <span>Add to Calendar</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleCopyHashtag}
                          className="px-2.5 py-1 rounded-full bg-alabaster hover:bg-white text-espresso text-[8.5px] sm:text-[10px] font-medium border border-champagne shadow-sm flex items-center gap-1 transition-all"
                        >
                          {copiedHashtag ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-terracotta" />
                          )}
                          <span>{copiedHashtag ? 'Copied!' : couple.hashtag}</span>
                        </button>
                      </div>

                      <div className="mt-1 flex items-center justify-center gap-2 sm:gap-3">
                        <button
                          type="button"
                          onClick={handleFlipCard}
                          className="px-3 py-1.5 rounded-full bg-sand-light hover:bg-sand text-espresso text-[9.5px] sm:text-xs font-medium tracking-wider border border-terracotta/25 flex items-center gap-1.5 shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
                          title="Flip back to front invitation"
                        >
                          <RotateCw className="w-3 h-3 text-terracotta" />
                          <span>Front Side ↻</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleProceed}
                          className="py-1.5 px-4 rounded-full bg-gradient-to-r from-terracotta via-terracotta-dark to-rust text-alabaster font-sans text-[9.5px] sm:text-xs font-semibold tracking-[0.18em] uppercase shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 relative overflow-hidden whitespace-nowrap shrink-0"
                        >
                          <span className="relative z-10">Step Inside</span>
                          <ArrowRight className="w-3.5 h-3.5 relative z-10" />
                          <div className="absolute inset-0 animate-shimmer-sweep pointer-events-none" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* =========================================================================
                LAYER 3 (z-20): FRONT ENVELOPE POCKET & VELLUM BELLY BAND
                (Clean, seamless luxury pocket with horizontal translucent vellum band)
                ========================================================================= */}
            <div
              style={{ zIndex: 20 }}
              className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
            >
              {/* Pocket Cardstock Body: Soft Textured Linen Sage */}
              <div
                className={`absolute inset-0 pointer-events-none transition-colors shadow-inner ${
                  isStationery
                    ? 'bg-gradient-to-b from-[#EAEFE8] via-[#E2EAE0] to-[#D5E0D2]'
                    : 'bg-gradient-to-b from-[#D4DFD1] via-[#C8D6C4] to-[#BCCDB8]'
                }`}
              >
                {/* Subtle soft paper depth gradient in lower half */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/[0.04] to-transparent pointer-events-none" />
              </div>

              {/* =====================================================================
                  TRANSLUCENT VELLUM BELLY BAND & RECIPIENT CALLIGRAPHY
                  (Frosted translucent parchment sash across lower third: sage cardstock shows through!)
                  ===================================================================== */}
              <motion.div
                animate={
                  isOpening
                    ? {
                        opacity: stage === 'card-presented' ? 0.65 : 0,
                        scaleX: stage === 'card-presented' ? 1 : 1.05,
                      }
                    : { opacity: 1, scaleX: 1 }
                }
                transition={{ duration: 0.35 }}
                className="absolute inset-x-0 bottom-2 sm:bottom-3.5 h-[76px] sm:h-24 z-20 pointer-events-auto bg-[#FAFBF9]/45 backdrop-blur-md border-y border-[#C8A97E]/40 shadow-[0_2px_12px_rgba(34,43,35,0.04)] flex items-center justify-center px-4 sm:px-8"
              >
                {/* Thin gold foil pinstripe top and bottom */}
                <div className="absolute inset-x-0 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-[#C8A97E]/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0.5 h-[1px] bg-gradient-to-r from-transparent via-[#C8A97E]/50 to-transparent" />

                {/* Recipient Calligraphy Presentation */}
                <div className="w-full flex flex-col items-center justify-center text-center py-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.3em] text-rust font-semibold">
                      {recipientName ? 'SPECIALLY PREPARED FOR' : 'CORDIALLY INVITED'}
                    </span>

                    {!isOpening && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditInputValue(recipientName);
                          setIsEditingRecipient(true);
                        }}
                        className="p-1 rounded-full text-rust/70 hover:text-rust hover:bg-black/5 transition-colors"
                        title="Personalize recipient name on envelope"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>

                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isOpening) {
                        setEditInputValue(recipientName);
                        setIsEditingRecipient(true);
                      }
                    }}
                    className="font-script text-2xl sm:text-3xl md:text-4xl text-espresso font-medium leading-none drop-shadow-sm cursor-pointer hover:text-terracotta transition-colors px-2 max-w-full"
                    title="Click to edit name on envelope"
                  >
                    {recipientName || 'Our Beloved Family & Friends'}
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.22em] text-terracotta font-medium">
                      {recipientName ? 'WITH JOY & GRATITUDE' : 'TO CELEBRATE OUR WEDDING'}
                    </span>

                    {recipientName && !isOpening && (
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="text-[7px] sm:text-[8px] text-rust/70 hover:text-rust bg-white/70 px-1.5 py-0.5 rounded border border-terracotta/20 flex items-center gap-0.5"
                        title="Copy link with this name"
                      >
                        {copiedLink ? <Check className="w-2 h-2 text-green-600" /> : <Share2 className="w-2 h-2" />}
                        <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* =========================================================================
                LAYER 4 (z-40): WAX SEAL WITH TAP-AND-HOLD CHARGE
                (Centered right where flap apex lands in the middle of envelope)
                ========================================================================= */}
            <div
              style={{ zIndex: 40 }}
              className={`absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 ${
                isOpening ? 'pointer-events-none' : ''
              }`}
            >
              <div className="relative flex flex-col items-center" ref={sealRef}>
                {/* Artisan Handwritten Calligraphy Instruction & Curved Arrow Pointing to Wax Seal */}
                <AnimatePresence>
                  {stage === 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={
                        showHoldHint
                          ? { opacity: 1, y: 0, scale: [1, 1.06, 1], rotate: [-2, 2, -2, 0] }
                          : { opacity: 1, y: [0, -3, 0], scale: 1 }
                      }
                      exit={{ opacity: 0, y: -6, scale: 0.9 }}
                      transition={
                        showHoldHint
                          ? { duration: 0.35, ease: 'easeInOut' }
                          : { y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' } }
                      }
                      className="absolute -top-14 sm:-top-16 flex flex-col items-center pointer-events-none select-none z-30"
                    >
                      {/* Calligraphic note or progress readout */}
                      <span
                        className={`transition-colors drop-shadow-sm whitespace-nowrap ${
                          holdProgress > 0
                            ? 'font-sans text-[10px] sm:text-xs uppercase tracking-[0.22em] text-terracotta-dark font-bold bg-alabaster/80 px-2.5 py-0.5 rounded-full border border-champagne/50 shadow-sm'
                            : showHoldHint
                            ? 'font-serif text-xs sm:text-sm italic font-semibold text-terracotta-dark'
                            : 'font-script text-xl sm:text-2xl text-espresso/90 font-medium -rotate-2'
                        }`}
                      >
                        {holdProgress > 0
                          ? holdProgress >= 50
                            ? `Breaking... ${holdProgress}%`
                            : `Melting... ${holdProgress}%`
                          : showHoldHint
                          ? 'Hold down to break seal!'
                          : 'Press & hold to open'}
                      </span>

                      {/* Delicate Curved Arrow pointing down to the wax seal */}
                      <svg
                        width="34"
                        height="26"
                        viewBox="0 0 34 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transition-colors drop-shadow-sm -mt-0.5 ${
                          holdProgress > 0 ? 'text-champagne' : 'text-espresso/70'
                        }`}
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

                {/* Wax Seal Button */}
                <motion.button
                  type="button"
                  onClick={handleSealClick}
                  onPointerDown={handleSealPointerDown}
                  onPointerUp={handleSealPointerUp}
                  onPointerCancel={handleSealPointerCancel}
                  aria-label="Tap and hold wax seal to open wedding invitation"
                  animate={
                    isOpening
                      ? { scale: [1, 1.25, 0.4], opacity: [1, 1, 0], rotate: 12 }
                      : showHoldHint
                      ? { rotate: [-5, 5, -5, 5, 0], scale: [1, 1.06, 1] }
                      : { scale: holdProgress > 0 ? 1 + holdProgress * 0.0016 : [1, 1.04, 1] }
                  }
                  transition={
                    isOpening
                      ? { duration: 0.38, ease: 'easeOut' }
                      : showHoldHint
                      ? { duration: 0.35, ease: 'easeInOut' }
                      : { duration: 2.8, repeat: holdProgress > 0 ? 0 : Infinity, ease: 'easeInOut' }
                  }
                  className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center cursor-pointer select-none focus:outline-none group active:scale-95 transition-transform touch-manipulation"
                >
                  {/* Golden Charge Ring when pressing & holding */}
                  {holdProgress > 0 && (
                    <svg className="absolute -inset-2 w-24 h-24 sm:w-28 sm:h-28 -rotate-90 pointer-events-none">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="#C8A97E"
                        strokeWidth="3"
                        strokeDasharray="280"
                        strokeDashoffset={280 - (280 * holdProgress) / 100}
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(200,169,126,0.9)]"
                      />
                    </svg>
                  )}

                  {/* Organic Melted Scalloped Wax Contour SVG */}
                  <svg
                    viewBox="0 0 120 120"
                    className="absolute inset-0 w-full h-full drop-shadow-wax"
                  >
                    <defs>
                      <radialGradient id="luxWaxGradPolished" cx="35%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#F7D4D7" />
                        <stop offset="30%" stopColor="#E2A6AB" />
                        <stop offset="70%" stopColor="#BD6D74" />
                        <stop offset="100%" stopColor="#8C4249" />
                      </radialGradient>
                      <linearGradient id="goldRimGradPolished" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFF2D6" />
                        <stop offset="50%" stopColor="#C8A97E" />
                        <stop offset="100%" stopColor="#8F7249" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 60,3 C 76,2 92,8 101,18 C 111,28 118,44 117,59 C 116,75 110,91 99,102 C 88,113 72,118 57,117 C 41,116 26,110 16,98 C 6,86 1,70 2,55 C 3,39 10,24 22,14 C 34,4 47,4 60,3 Z"
                      fill="url(#luxWaxGradPolished)"
                      stroke="#FAF0F1"
                      strokeOpacity="0.65"
                      strokeWidth="1.8"
                    />

                    <circle
                      cx="60"
                      cy="60"
                      r="43"
                      fill="none"
                      stroke="url(#goldRimGradPolished)"
                      strokeWidth="1.4"
                      strokeDasharray="2,3"
                      strokeOpacity="0.85"
                    />
                  </svg>

                  {/* Inner Stamped Center with Monogram & Heart */}
                  <div className="relative z-10 w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] rounded-full border border-[#FAF0F1]/70 bg-gradient-to-tl from-[#8C4249] via-[#BD6D74] to-[#E2A6AB] flex flex-col items-center justify-center shadow-inner">
                    <span className="font-serif text-base sm:text-xl font-bold tracking-widest text-[#FFFBF9] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      {couple.monogram}
                    </span>
                    <div className="flex items-center gap-1 mt-0.5 opacity-90">
                      <span className="w-1.5 h-[1px] bg-champagne" />
                      <Heart className="w-2.5 h-2.5 text-champagne fill-champagne" />
                      <span className="w-1.5 h-[1px] bg-champagne" />
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* =========================================================================
                LAYER 5 (z-45): LUXURY VINTAGE POSTAGE STAMP & AUTHENTIC POSTMARK
                (Authentic philatelic cancellation with perforated serrated edges & zero text collision)
                ========================================================================= */}
            <motion.div
              animate={
                isOpening
                  ? { opacity: 0, scale: 0.85, y: -10 }
                  : { opacity: 1, scale: stampSquash ? 0.93 : 1, y: 0 }
              }
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{ zIndex: 45 }}
              className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-4 pointer-events-auto cursor-pointer group select-none"
              onClick={handleStampClick}
              title="Tap stamp for postal ink cancellation!"
            >
              {/* Overall Stamp Assembly with subtle romantic tilt */}
              <div className="relative rotate-2 group-hover:rotate-0 transition-transform duration-300">
                {/* 1. AUTHENTIC POSTMARK CANCELLATION (CDS on envelope + wavy killer lines resting above text) */}
                <div className="absolute -left-[38px] sm:-left-[44px] -top-2 sm:-top-2.5 pointer-events-none z-20">
                  {/* Circular Date Postmark (CDS) on envelope paper */}
                  <div className="relative w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] rounded-full border-[1.2px] border-rust/55 flex flex-col items-center justify-center text-center -rotate-12 bg-transparent shadow-[inset_0_0_6px_rgba(62,82,59,0.03)] opacity-85">
                    {/* Inner dashed ring */}
                    <div className="absolute inset-0.5 rounded-full border border-dashed border-rust/40" />

                    {/* Postal Location */}
                    <span className="text-[5px] sm:text-[6px] tracking-[0.18em] uppercase font-bold text-rust relative z-10 whitespace-nowrap">
                      SAN FABIAN
                    </span>

                    {/* Wedding Date in Postal Ink */}
                    <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold text-rust tracking-wider my-0.5 relative z-10 whitespace-nowrap">
                      21•12•26
                    </span>

                    {/* Postal Province */}
                    <span className="text-[4.5px] sm:text-[5px] uppercase tracking-[0.16em] text-rust/80 font-medium relative z-10 whitespace-nowrap">
                      PANGASINAN
                    </span>
                  </div>

                  {/* Wavy Postal Cancellation Killer Bars extending across top margin (above PHILIPPINES) */}
                  <svg
                    viewBox="0 0 46 14"
                    className="absolute left-[36px] sm:left-[42px] top-1 sm:top-1.5 w-11 h-3.5 sm:w-13 sm:h-4 text-rust/40 pointer-events-none opacity-75"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M 0 3 Q 11.5 0, 23 3 T 46 3"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 0 9 Q 11.5 6, 23 9 T 46 9"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* 2. THE POSTAGE STAMP WITH AUTHENTIC SERRATED PERFORATIONS */}
                <div className="relative w-[72px] h-[98px] sm:w-[82px] sm:h-[110px] drop-shadow-[0_4px_10px_rgba(34,43,35,0.14)] filter">
                  {/* SVG Perforated Stamp Base */}
                  <svg
                    viewBox="0 0 72 98"
                    className="absolute inset-0 w-full h-full overflow-visible"
                  >
                    <defs>
                      <mask id="stampPerforationHoles">
                        {/* Solid white base */}
                        <rect width="72" height="98" fill="white" />

                        {/* Top edge circular punch holes (y=0) */}
                        <circle cx="8" cy="0" r="2.4" fill="black" />
                        <circle cx="16" cy="0" r="2.4" fill="black" />
                        <circle cx="24" cy="0" r="2.4" fill="black" />
                        <circle cx="32" cy="0" r="2.4" fill="black" />
                        <circle cx="40" cy="0" r="2.4" fill="black" />
                        <circle cx="48" cy="0" r="2.4" fill="black" />
                        <circle cx="56" cy="0" r="2.4" fill="black" />
                        <circle cx="64" cy="0" r="2.4" fill="black" />

                        {/* Bottom edge circular punch holes (y=98) */}
                        <circle cx="8" cy="98" r="2.4" fill="black" />
                        <circle cx="16" cy="98" r="2.4" fill="black" />
                        <circle cx="24" cy="98" r="2.4" fill="black" />
                        <circle cx="32" cy="98" r="2.4" fill="black" />
                        <circle cx="40" cy="98" r="2.4" fill="black" />
                        <circle cx="48" cy="98" r="2.4" fill="black" />
                        <circle cx="56" cy="98" r="2.4" fill="black" />
                        <circle cx="64" cy="98" r="2.4" fill="black" />

                        {/* Left edge circular punch holes (x=0) */}
                        <circle cx="0" cy="8" r="2.4" fill="black" />
                        <circle cx="0" cy="17" r="2.4" fill="black" />
                        <circle cx="0" cy="26" r="2.4" fill="black" />
                        <circle cx="0" cy="35" r="2.4" fill="black" />
                        <circle cx="0" cy="44" r="2.4" fill="black" />
                        <circle cx="0" cy="53" r="2.4" fill="black" />
                        <circle cx="0" cy="62" r="2.4" fill="black" />
                        <circle cx="0" cy="71" r="2.4" fill="black" />
                        <circle cx="0" cy="80" r="2.4" fill="black" />
                        <circle cx="0" cy="89" r="2.4" fill="black" />

                        {/* Right edge circular punch holes (x=72) */}
                        <circle cx="72" cy="8" r="2.4" fill="black" />
                        <circle cx="72" cy="17" r="2.4" fill="black" />
                        <circle cx="72" cy="26" r="2.4" fill="black" />
                        <circle cx="72" cy="35" r="2.4" fill="black" />
                        <circle cx="72" cy="44" r="2.4" fill="black" />
                        <circle cx="72" cy="53" r="2.4" fill="black" />
                        <circle cx="72" cy="62" r="2.4" fill="black" />
                        <circle cx="72" cy="71" r="2.4" fill="black" />
                        <circle cx="72" cy="80" r="2.4" fill="black" />
                        <circle cx="72" cy="89" r="2.4" fill="black" />
                      </mask>
                    </defs>

                    {/* Stamp Paper Body with Perforations */}
                    <rect
                      width="72"
                      height="98"
                      fill="#FAFBF9"
                      mask="url(#stampPerforationHoles)"
                    />
                  </svg>

                  {/* Stamp Face Interior with Dual Gold Foil Frame */}
                  <div className="absolute inset-1.5 sm:inset-2 bg-gradient-to-b from-[#FFFFFF] via-[#FAFBF9] to-[#F3F6F2] rounded-xs border border-champagne/75 px-1 py-1 flex flex-col items-center justify-between text-center overflow-hidden">
                    {/* Inner delicate pinstripe */}
                    <div className="absolute inset-0.5 border border-[#C8A97E]/30 pointer-events-none" />

                    {/* Top: Country Name (Spaced with breathing room below top frame) */}
                    <div className="w-full pt-1.5 sm:pt-2 flex items-center justify-center">
                      <span className="text-[6.5px] sm:text-[7.5px] uppercase tracking-[0.14em] text-rust font-bold block leading-none whitespace-nowrap text-center">
                        PHILIPPINES
                      </span>
                    </div>

                    {/* Middle: Couple Monogram & Romantic Botanical Heart */}
                    <div className="flex flex-col items-center justify-center my-auto py-0.5">
                      <span className="font-serif text-[14px] sm:text-[16px] font-bold tracking-widest text-espresso leading-none whitespace-nowrap">
                        {couple.monogram}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1 opacity-80">
                        <span className="w-2.5 h-[0.8px] bg-champagne" />
                        <Heart className="w-2.5 h-2.5 text-blush-rose fill-blush/60 shrink-0" />
                        <span className="w-2.5 h-[0.8px] bg-champagne" />
                      </div>
                    </div>

                    {/* Bottom: FOREVER & YEAR */}
                    <div className="w-full pb-0.5">
                      <span className="font-serif text-[8.5px] sm:text-[10px] uppercase tracking-[0.2em] font-semibold text-espresso block leading-none whitespace-nowrap">
                        FOREVER
                      </span>
                      <span className="font-serif text-[7px] sm:text-[8px] tracking-wider text-rust/80 font-medium block mt-1 leading-none whitespace-nowrap">
                        2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* =========================================================================
            SUITE ACTION BUTTONS & AUDIO TOGGLE
            (Directly below envelope in centered flat-lay suite: eliminates bottom void)
            ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={
            isOpening && stage !== 'card-presented'
              ? { opacity: 0, y: 12, pointerEvents: 'none' }
              : { opacity: 1, y: 0, pointerEvents: 'auto' }
          }
          transition={{ duration: 0.35 }}
          className="w-full max-w-md z-20 mt-3 sm:mt-5 flex flex-col items-center gap-2 sm:gap-2.5 text-center"
        >
          {/* Interactive Prompt for subsequent stages */}
          {stage === 'card-peeking' ? (
            <button
              type="button"
              onClick={handleRevealCard}
              className="text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase text-terracotta animate-pulse flex items-center gap-1.5 cursor-pointer touch-manipulation"
            >
              <span>Tap to reveal invitation card ↑</span>
            </button>
          ) : stage === 'card-presented' ? (
            <button
              type="button"
              onClick={handleProceed}
              className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-alabaster bg-terracotta hover:bg-terracotta-dark px-5 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 touch-manipulation"
            >
              <span>Enter Wedding Website</span>
              <ArrowRight className="w-4 h-4 text-alabaster" />
            </button>
          ) : null}

          {/* Audio Toggle Pill with Dancing Equalizer Bars */}
          <label className="inline-flex items-center gap-2.5 text-[10px] sm:text-xs text-espresso/90 cursor-pointer bg-alabaster/90 hover:bg-alabaster px-4 py-1.5 rounded-full border border-terracotta/25 shadow-sm transition-all hover:shadow">
            <input
              type="checkbox"
              checked={withMusic}
              onChange={(e) => setWithMusic(e.target.checked)}
              className="accent-terracotta rounded cursor-pointer w-3.5 h-3.5"
            />

            {withMusic ? (
              <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                <span className="w-0.5 bg-terracotta rounded-full" style={{ animation: 'eqDance1 0.7s infinite alternate' }} />
                <span className="w-0.5 bg-terracotta rounded-full" style={{ animation: 'eqDance2 0.5s infinite alternate' }} />
                <span className="w-0.5 bg-terracotta rounded-full" style={{ animation: 'eqDance3 0.8s infinite alternate' }} />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-espresso/50 shrink-0" />
            )}

            <span className="font-medium">Play {music.displayLabel}</span>
          </label>
        </motion.div>
      </div>

      {/* =========================================================================
          INTERACTIVE MODAL: PERSONALIZE RECIPIENT NAME DIALOG
          ========================================================================= */}
      <AnimatePresence>
        {isEditingRecipient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-espresso/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 10 }}
              className="bg-alabaster rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-champagne relative text-center"
            >
              <button
                onClick={() => setIsEditingRecipient(false)}
                className="absolute top-3.5 right-3.5 p-1 rounded-full text-espresso/60 hover:text-espresso"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[10px] uppercase tracking-[0.28em] text-terracotta font-semibold block mb-1">
                Personalize Your Envelope
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-espresso mb-2">
                Write Your Name
              </h4>
              <p className="text-xs text-espresso/70 mb-4 leading-relaxed">
                Enter your name or family name to see it beautifully hand-lettered on the envelope jacket!
              </p>

              <form onSubmit={handleSaveRecipient} className="space-y-3">
                <input
                  type="text"
                  value={editInputValue}
                  onChange={(e) => setEditInputValue(e.target.value)}
                  placeholder="e.g. Tita Maria & Tito Joey"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-terracotta/30 bg-white text-espresso text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/50 shadow-inner"
                  autoFocus
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setRecipientName('');
                      setIsEditingRecipient(false);
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-medium text-espresso/70 hover:bg-sand-light transition-colors"
                  >
                    Reset to Default
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-terracotta text-alabaster text-xs font-semibold uppercase tracking-wider shadow-sm hover:brightness-110 transition-all"
                  >
                    Save & Preview
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
