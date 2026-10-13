import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarPlus,
  MapPin,
  ExternalLink,
  Compass,
  Music,
  Heart,
  PawPrint,
  Check,
  Gift,
  PhoneOff,
  Hash,
  Copy,
  CreditCard,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Send,
  Users,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingConfig, TimelineItem, ColorSwatch, GuestWish } from '../../config/weddingConfig';
import { getGoogleCalendarUrl, openGoogleCalendarApp, openGoogleMapsApp } from '../../utils/calendar';
import { BotanicalSprig } from '../Dividers';

const STORAGE_KEY = 'ate_grace_cydrill_wedding_wishes_v2';

/**
 * Fine-line Sage & Blush Ornamental Divider for the Stationery Theme
 */
const StationeryOrnament: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 my-5 select-none ${className}`}>
    <div className="h-[1px] w-14 sm:w-24 bg-gradient-to-r from-transparent via-terracotta/50 to-terracotta" />
    <svg width="28" height="16" viewBox="0 0 28 16" fill="none" className="text-blush-rose">
      <path
        d="M14 1 L17 8 L14 15 L11 8 Z"
        stroke="currentColor"
        strokeWidth="1.1"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <circle cx="4" cy="8" r="1.5" fill="#6B8467" fillOpacity="0.65" />
      <circle cx="24" cy="8" r="1.5" fill="#6B8467" fillOpacity="0.65" />
    </svg>
    <div className="h-[1px] w-14 sm:w-24 bg-gradient-to-l from-transparent via-terracotta/50 to-terracotta" />
  </div>
);

/**
 * Custom Architectural Garden Pavilion & Botanical Line-Art Illustration
 * (Replaces the 2 venue photos in the Location section with fine-art stationery engraving)
 */
const VenueLineArtArch: React.FC = () => (
  <svg
    viewBox="0 0 320 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-[290px] mx-auto text-[#6B8467]"
  >
    {/* Outer Arched Frame */}
    <path
      d="M40 185 V95 A120 110 0 0 1 280 95 V185"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeOpacity="0.55"
    />
    <path
      d="M48 185 V97 A112 102 0 0 1 272 97 V185"
      stroke="currentColor"
      strokeWidth="0.7"
      strokeDasharray="3 3"
      strokeOpacity="0.45"
    />
    {/* Horizon Blush Sun & Rays */}
    <circle
      cx="160"
      cy="88"
      r="24"
      fill="#E8C5C8"
      fillOpacity="0.28"
      stroke="#D49499"
      strokeWidth="1.1"
      strokeOpacity="0.7"
    />
    <line x1="160" y1="50" x2="160" y2="57" stroke="#D49499" strokeWidth="1" strokeOpacity="0.6" />
    <line x1="128" y1="62" x2="133" y2="67" stroke="#D49499" strokeWidth="1" strokeOpacity="0.6" />
    <line x1="192" y1="62" x2="187" y2="67" stroke="#D49499" strokeWidth="1" strokeOpacity="0.6" />
    {/* Rolling Tagaytay Ridge Hills */}
    <path
      d="M48 145 Q105 118 165 138 T272 132"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="#E4EBE1"
      fillOpacity="0.45"
    />
    <path
      d="M48 160 Q125 140 195 154 T272 150"
      stroke="#6B8467"
      strokeWidth="1.1"
      fill="#6B8467"
      fillOpacity="0.14"
    />
    {/* Classical Ceremony Archway Centerpiece */}
    <path
      d="M132 185 V122 A28 28 0 0 1 188 122 V185"
      stroke="#465943"
      strokeWidth="1.4"
      strokeOpacity="0.8"
    />
    {/* Hanging Blush & Sage Floral Garland on Ceremony Arch */}
    <circle cx="136" cy="112" r="3.5" fill="#D49499" fillOpacity="0.65" />
    <circle cx="144" cy="103" r="4" fill="#E8C5C8" fillOpacity="0.85" />
    <circle cx="154" cy="98" r="3.5" fill="#6B8467" fillOpacity="0.65" />
    <circle cx="184" cy="112" r="3.5" fill="#D49499" fillOpacity="0.65" />
    <circle cx="176" cy="103" r="4" fill="#6B8467" fillOpacity="0.65" />
    {/* Base Ground Line */}
    <line x1="25" y1="185" x2="295" y2="185" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" />
  </svg>
);

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

/**
 * Custom Fine-Line Botanical & Wedding Stationery Engravings for the Program
 */
const renderTimelineIcon = (icon: TimelineItem['icon']) => {
  switch (icon) {
    case 'rings':
      return (
        <svg viewBox="0 0 72 72" fill="none" className="w-14 h-14 sm:w-16 sm:h-16">
          {/* Soft blush watercolor aura */}
          <circle cx="36" cy="38" r="22" fill="#E8C5C8" fillOpacity="0.22" />
          {/* Botanical sage sprig behind rings */}
          <path
            d="M14 48 Q36 56 58 46"
            stroke="#6B8467"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path d="M22 50 C18 46, 18 42, 23 44 C25 46, 24 49, 22 50 Z" fill="#6B8467" fillOpacity="0.35" stroke="#6B8467" strokeWidth="1" />
          <path d="M50 49 C54 45, 54 41, 49 43 C47 45, 48 48, 50 49 Z" fill="#6B8467" fillOpacity="0.35" stroke="#6B8467" strokeWidth="1" />
          {/* Interlocking Wedding Bands */}
          <circle cx="29" cy="38" r="11.5" stroke="#C8A97E" strokeWidth="1.8" />
          <circle cx="43" cy="38" r="11.5" stroke="#6B8467" strokeWidth="1.8" />
          {/* Solitaire Blush Diamond & Rays */}
          <path
            d="M29 26.5 L24 20 L29 16 L34 20 Z"
            fill="#E8C5C8"
            fillOpacity="0.45"
            stroke="#D49499"
            strokeWidth="1.3"
          />
          <line x1="29" y1="10" x2="29" y2="13" stroke="#C8A97E" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="20" y1="14" x2="22" y2="16" stroke="#C8A97E" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="38" y1="14" x2="36" y2="16" stroke="#C8A97E" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'camera':
      return (
        <svg viewBox="0 0 72 72" fill="none" className="w-14 h-14 sm:w-16 sm:h-16">
          <circle cx="36" cy="38" r="22" fill="#6B8467" fillOpacity="0.11" />
          {/* Sun rays behind vintage camera */}
          <path d="M20 22 L16 17 M36 17 L36 12 M52 22 L56 17" stroke="#D49499" strokeWidth="1.2" strokeLinecap="round" />
          {/* Vintage Rangefinder Body */}
          <rect
            x="16"
            y="26"
            width="40"
            height="26"
            rx="4"
            fill="#FAFBF9"
            stroke="#6B8467"
            strokeWidth="1.6"
          />
          <path d="M25 26 L28 21 H40 L43 26" stroke="#6B8467" strokeWidth="1.5" fill="#F2F5F0" />
          <rect x="46" y="23" width="5" height="3" rx="1" fill="#D49499" />
          {/* Camera Lens */}
          <circle cx="36" cy="39" r="8.5" stroke="#6B8467" strokeWidth="1.6" fill="#E8C5C8" fillOpacity="0.28" />
          <circle cx="36" cy="39" r="4" stroke="#465943" strokeWidth="1.2" />
          <circle cx="23" cy="32" r="1.8" fill="#D49499" />
          {/* Corner botanical leaf accent */}
          <path d="M52 52 C58 50, 62 43, 55 41 C51 44, 51 49, 52 52 Z" fill="#6B8467" fillOpacity="0.3" stroke="#6B8467" strokeWidth="1.1" />
        </svg>
      );
    case 'utensils':
      return (
        <svg viewBox="0 0 72 72" fill="none" className="w-14 h-14 sm:w-16 sm:h-16">
          <circle cx="36" cy="38" r="22" fill="#E8C5C8" fillOpacity="0.2" />
          {/* Left Clinking Champagne Flute */}
          <path
            d="M23 18 H33 L31 35 C30.5 39 25.5 39 25 35 Z"
            fill="#E8C5C8"
            fillOpacity="0.35"
            stroke="#6B8467"
            strokeWidth="1.5"
            transform="rotate(10 28 30)"
          />
          <line x1="27" y1="38" x2="25" y2="52" stroke="#6B8467" strokeWidth="1.5" />
          <line x1="20" y1="52" x2="30" y2="53" stroke="#6B8467" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right Clinking Champagne Flute */}
          <path
            d="M39 18 H49 L47 35 C46.5 39 41.5 39 41 35 Z"
            fill="#C8A97E"
            fillOpacity="0.22"
            stroke="#D49499"
            strokeWidth="1.5"
            transform="rotate(-10 44 30)"
          />
          <line x1="45" y1="38" x2="47" y2="52" stroke="#D49499" strokeWidth="1.5" />
          <line x1="42" y1="53" x2="52" y2="52" stroke="#D49499" strokeWidth="1.5" strokeLinecap="round" />
          {/* Effervescent Star Sparkle at Top */}
          <path d="M36 9 L37.5 13 L41.5 14.5 L37.5 16 L36 20 L34.5 16 L30.5 14.5 L34.5 13 Z" fill="#D49499" fillOpacity="0.8" />
        </svg>
      );
    case 'cake':
      return (
        <svg viewBox="0 0 72 72" fill="none" className="w-14 h-14 sm:w-16 sm:h-16">
          <circle cx="36" cy="40" r="22" fill="#6B8467" fillOpacity="0.11" />
          {/* Cake Pedestal Stand */}
          <line x1="16" y1="52" x2="56" y2="52" stroke="#6B8467" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M32 52 L29 58 H43 L40 52" stroke="#6B8467" strokeWidth="1.5" fill="#E4EBE1" />
          {/* Bottom Tier */}
          <rect x="21" y="38" width="30" height="14" rx="2" fill="#FAFBF9" stroke="#6B8467" strokeWidth="1.5" />
          {/* Top Tier */}
          <rect x="26" y="26" width="20" height="12" rx="2" fill="#F2F5F0" stroke="#6B8467" strokeWidth="1.5" />
          {/* Botanical Blush & Sage Floral Cascade on Cake */}
          <circle cx="31" cy="26" r="3" fill="#D49499" fillOpacity="0.8" />
          <circle cx="36" cy="38" r="3.2" fill="#E8C5C8" fillOpacity="0.9" />
          <circle cx="41" cy="39" r="2.5" fill="#6B8467" fillOpacity="0.75" />
          {/* Delicate Blush Topper */}
          <path d="M36 14 L38 19 L36 24 L34 19 Z" stroke="#D49499" strokeWidth="1.3" fill="#E8C5C8" fillOpacity="0.45" />
        </svg>
      );
    case 'music':
      return (
        <svg viewBox="0 0 72 72" fill="none" className="w-14 h-14 sm:w-16 sm:h-16">
          <circle cx="36" cy="38" r="22" fill="#E8C5C8" fillOpacity="0.2" />
          {/* String Light Garland Swag */}
          <path d="M14 20 Q36 32 58 18" stroke="#6B8467" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="24" cy="26" r="2.5" fill="#E8C5C8" stroke="#D49499" strokeWidth="1" />
          <circle cx="36" cy="28" r="2.5" fill="#6B8467" fillOpacity="0.7" />
          <circle cx="48" cy="25" r="2.5" fill="#E8C5C8" stroke="#D49499" strokeWidth="1" />
          {/* Twin Sixteenth Musical Notes */}
          <path d="M29 48 V33 L45 30 V45" stroke="#465943" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 37 L45 34" stroke="#465943" strokeWidth="1.5" />
          <ellipse cx="26" cy="49" rx="4" ry="3" transform="rotate(-15 26 49)" fill="#6B8467" />
          <ellipse cx="42" cy="46" rx="4" ry="3" transform="rotate(-15 42 46)" fill="#D49499" />
        </svg>
      );
    case 'sparkles':
    default:
      return (
        <svg viewBox="0 0 72 72" fill="none" className="w-14 h-14 sm:w-16 sm:h-16">
          <circle cx="36" cy="38" r="22" fill="#6B8467" fillOpacity="0.11" />
          {/* Crescent Moon */}
          <path
            d="M42 20 A16 16 0 1 0 52 46 A13 13 0 1 1 42 20 Z"
            fill="#E8C5C8"
            fillOpacity="0.4"
            stroke="#6B8467"
            strokeWidth="1.5"
          />
          {/* Four-Point Starlight Sparkles */}
          <path
            d="M48 16 L50 22 L56 24 L50 26 L48 32 L46 26 L40 24 L46 22 Z"
            fill="#D49499"
            fillOpacity="0.85"
          />
          <path
            d="M22 24 L23 27 L26 28 L23 29 L22 32 L21 29 L18 28 L21 27 Z"
            fill="#6B8467"
          />
          <circle cx="52" cy="38" r="1.8" fill="#D49499" />
          <circle cx="24" cy="46" r="1.5" fill="#6B8467" />
        </svg>
      );
  }
};

export const MinimalInvitationView: React.FC = () => {
  const { couple, schedule, location, timeline, entourage, dressCode, reminders, photos, initialWishes } =
    weddingConfig;

  // Curated 3 Portrait Highlights for the Minimalist Version (+ 1 Hero Cameo Portrait = 4 featured photos)
  const curatedPortraits = [
    photos.saveTheDateTriptych[0],
    photos.gallery.find((p) => p.id === 'photo-46') || photos.saveTheDateTriptych[1],
    photos.saveTheDateTriptych[2],
  ];

  // Live Countdown State
  const calculateTimeLeft = () => {
    const target = new Date(schedule.isoDate).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, target - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [selectedSwatch, setSelectedSwatch] = useState<ColorSwatch>(dressCode.swatches[0]);
  const [copiedHashtag, setCopiedHashtag] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // RSVP & Guestbook State (Shares storage with main design so wishes stay synced)
  const [wishes, setWishes] = useState<GuestWish[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialWishes;
    } catch {
      return initialWishes;
    }
  });
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'regrets'>('attending');
  const [guestsCount, setGuestsCount] = useState(1);
  const [songRequest, setSongRequest] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [schedule.isoDate]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishes]);

  const handleCopyHashtag = () => {
    navigator.clipboard.writeText(couple.hashtag);
    setCopiedHashtag(true);
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.75 },
      colors: ['#6B8467', '#465943', '#E8C5C8', '#D49499', '#C8A97E'],
    });
    setTimeout(() => setCopiedHashtag(false), 2600);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newWish: GuestWish = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      relationship: relationship.trim() || 'Loved One & Guest',
      message:
        message.trim() ||
        `So excited to celebrate with you, ${couple.displayTitle}!${
          songRequest ? ` (Song request: ${songRequest})` : ''
        }`,
      attendance,
      guestsCount: attendance === 'attending' ? guestsCount : 0,
      createdAt: 'Just now',
    };

    setWishes([newWish, ...wishes]);
    setSubmitted(true);
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#6B8467', '#465943', '#E8C5C8', '#D49499', '#C8A97E'],
    });
    setName('');
    setRelationship('');
    setSongRequest('');
    setMessage('');
  };

  return (
    <div className="bg-alabaster text-espresso paper-grain">
      {/* =====================================================================
          1. EDITORIAL MAGAZINE SPREAD HERO SECTION (1 Arched Portrait + Wax Seal)
         ===================================================================== */}
      <section
        id="home"
        className="relative min-h-[100dvh] flex flex-col justify-between pt-5 pb-16 sm:pt-8 sm:pb-12 lg:pt-20 lg:pb-8 px-5 sm:px-10 lg:px-16 overflow-hidden bg-gradient-to-br from-[#FAFBF9] via-[#F2F5F0] to-[#E4EBE1]"
      >
        {/* Subtle Architectural Viewport Hairline Frame */}
        <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-terracotta/30 rounded-2xl z-0" />

        {/* Soft Ambient Sage & Blush Glow + Botanical Corner Engravings */}
        <div className="pointer-events-none absolute -top-20 right-1/4 w-96 h-96 rounded-full bg-blush/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 w-80 h-80 rounded-full bg-terracotta/15 blur-3xl" />
        <BotanicalSprig
          className="hidden lg:block absolute top-6 -left-10 w-44 h-44 sm:w-64 sm:h-64 rotate-45 opacity-25 pointer-events-none"
          color="#465943"
        />
        <BotanicalSprig
          className="hidden lg:block absolute -bottom-8 -right-10 w-48 h-48 sm:w-68 sm:h-68 -rotate-135 opacity-25 pointer-events-none"
          color="#6B8467"
        />

        {/* Top Editorial Masthead Strip */}
        <div className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.32em] text-rust font-semibold border-b border-terracotta/30 pb-2.5">
          <span>{couple.nuptialTitle} Nuptials</span>
          <span className="hidden sm:inline text-blush-rose">•</span>
          <span style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}>
            {schedule.shortDate}
          </span>
        </div>

        {/* Main Asymmetric Magazine Spread (2-Column on Desktop, Balanced Editorial Cover on Mobile) */}
        <div className="relative z-10 max-w-6xl w-full mx-auto my-auto py-3 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* LEFT COLUMN: Sweeping Editorial Typography & Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1"
          >
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.38em] text-rust font-semibold mb-1.5 sm:mb-3">
              Together With Their Families
            </p>

            {/* Staggered Editorial Display Headline */}
            <h1 className="font-serif uppercase text-espresso font-semibold tracking-[0.06em] leading-[0.98]">
              <span className="block text-5xl sm:text-7xl xl:text-[84px]">
                {couple.groomFirstName}
              </span>
              <span className="block text-4xl sm:text-6xl xl:text-[70px] mt-0.5 sm:mt-1 lg:pl-6">
                <span className="font-script text-blush-deep lowercase text-4xl sm:text-6xl xl:text-[74px] pr-2 sm:pr-3 font-normal">
                  and
                </span>
                {couple.brideFirstName}
              </span>
            </h1>

            <p className="font-script text-3xl sm:text-5xl text-terracotta mt-1 sm:mt-2 lg:pl-2">
              {couple.tagline}
            </p>

            {/* Editorial Hairline Divider */}
            <div className="flex items-center justify-center lg:justify-start gap-3 my-3.5 sm:my-6">
              <div className="h-[1px] w-16 sm:w-28 bg-terracotta/50" />
              <div className="w-2 h-2 rotate-45 border border-blush-rose bg-blush" />
              <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-terracotta/50 to-transparent" />
            </div>

            {/* 2-Column Date & Venue Editorial Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div className="sm:border-r border-terracotta/30 sm:pr-5">
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-terracotta font-semibold">
                  The Date &amp; Time
                </span>
                <p
                  style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}
                  className="font-serif text-lg sm:text-2xl font-bold text-rust uppercase tracking-[0.1em] mt-0.5"
                >
                  {schedule.dateFormatted}
                </p>
                <p className="font-serif italic text-xs sm:text-sm text-espresso/75">
                  {schedule.dayOfWeek}, {schedule.timeFormatted}
                </p>
              </div>

              <div>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-terracotta font-semibold">
                  The Venue
                </span>
                <p className="font-serif text-lg sm:text-2xl font-bold text-espresso uppercase tracking-[0.08em] mt-0.5">
                  {location.venueName}
                </p>
                <p className="font-serif italic text-xs sm:text-sm text-espresso/75">
                  {location.addressLine2}
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Layered Arch Portrait + Floating Blush Wax Seal & Botanical Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.85 }}
            className="lg:col-span-5 flex justify-center order-1 lg:order-2"
          >
            <div className="relative w-44 sm:w-64 lg:w-80">
              {/* Offset Soft Blush & Sage Backdrop Arch */}
              <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 sm:translate-x-4 sm:translate-y-4 rounded-t-full rounded-b-2xl bg-blush-light border border-blush-rose/50" />

              {/* Main Arched Couple Portrait (Photo #1 of 4) */}
              <div className="relative bg-alabaster p-2 sm:p-3 rounded-t-full rounded-b-2xl border border-terracotta/45 shadow-[0_20px_50px_-15px_rgba(34,43,35,0.18)]">
                <div className="overflow-hidden rounded-t-full rounded-b-xl aspect-[4/4.9] bg-sand-light relative">
                  <img
                    src={photos.heroPortrait}
                    alt={couple.displayTitle}
                    className="w-full h-full object-cover object-[50%_25%] hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/30 rounded-t-full rounded-b-xl pointer-events-none" />
                </div>
              </div>

              {/* Floating Embossed Blush Rose Wax Seal Stamp Overlapping Bottom-Left */}
              <div className="absolute -bottom-3 -left-4 sm:-bottom-5 sm:-left-6 z-20">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#EBBEC2] via-[#D49499] to-[#9E5B61] p-1 shadow-lg border border-[#FAF0F1]/75 flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-[#FAF0F1]/60 flex flex-col items-center justify-center text-[#FAFBF9]">
                    <span className="font-serif text-xs sm:text-base font-bold tracking-[0.12em] whitespace-nowrap drop-shadow-sm">
                      {couple.monogram}
                    </span>
                    <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-[#FAF0F1]/90 hidden sm:block">
                      2026
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Botanical Sprig Badge on Top-Right */}
              <BotanicalSprig
                className="absolute -top-6 -right-7 w-20 h-20 sm:w-28 sm:h-28 rotate-12 opacity-80 pointer-events-none"
                color="#465943"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="relative z-10 text-center">
          <a
            href="#save-the-date"
            className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-rust hover:text-terracotta transition-colors"
          >
            <span>Scroll to Invitation</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce text-blush-deep" />
          </a>
        </div>
      </section>

      {/* =====================================================================
          2. SAVE THE DATE & COUNTDOWN (0 Photos — Pure Letterpress Stationery)
         ===================================================================== */}
      <section
        id="save-the-date"
        className="relative py-20 sm:py-28 px-4 sm:px-6 bg-alabaster border-t border-sand-dark/70 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs uppercase tracking-[0.38em] text-rust font-semibold">
              Mark Your Calendar
            </span>
            <h2 className="font-script text-6xl sm:text-8xl text-terracotta mt-1">
              Save the Date
            </h2>
            <StationeryOrnament />

            {/* Editorial Quote Box */}
            <p className="font-serif italic text-lg sm:text-2xl text-espresso/80 max-w-2xl mx-auto leading-relaxed mt-4">
              {couple.storyQuote}
            </p>
          </motion.div>

          {/* Fine-Art Stationery Countdown Card */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-10 bg-alabaster border border-terracotta/45 rounded-3xl p-2.5 sm:p-4 shadow-sm"
          >
            <div className="border border-blush-rose/35 rounded-2xl px-4 py-6 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-6 text-xs sm:text-sm uppercase tracking-[0.22em] sm:tracking-[0.28em] text-rust font-semibold mb-6">
                <span>{schedule.dayOfWeek}</span>
                <span className="hidden sm:inline text-blush-rose">•</span>
                <span>{schedule.dateFormatted}</span>
                <span className="hidden sm:inline text-blush-rose">•</span>
                <span className="lowercase font-serif italic text-base tracking-wider text-terracotta">
                  {schedule.timeFormatted}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-5 max-w-xl mx-auto">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="bg-sand-light border border-sand-dark rounded-xl py-3.5 sm:py-4 px-1 sm:px-2 flex flex-col items-center justify-center overflow-hidden"
                  >
                    <div
                      style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}
                      className="font-serif text-2xl sm:text-5xl font-semibold text-espresso leading-none tracking-normal"
                    >
                      {String(unit.value).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] sm:text-xs uppercase tracking-[0.06em] sm:tracking-[0.2em] text-rust font-medium mt-2 leading-tight">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 flex items-center justify-center">
                <a
                  href={getGoogleCalendarUrl()}
                  onClick={openGoogleCalendarApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-terracotta hover:bg-rust text-alabaster text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.16em] font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
                  <span>Add to Google Calendar</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          3. LOCATION GUIDE (0 Photos — Architectural Line-Art & QR Stationery)
         ===================================================================== */}
      <section
        id="location"
        className="relative py-20 sm:py-28 px-4 sm:px-6 bg-sand-light border-t border-sand-dark/70 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.38em] text-rust font-semibold">
              Ceremony &amp; Reception
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl uppercase tracking-[0.16em] text-espresso font-semibold mt-1">
              {location.sectionTitle}
            </h2>
            <StationeryOrnament />
            <p className="text-sm sm:text-base text-espresso/75">{location.subtitle}</p>
          </div>

          <div className="bg-alabaster border border-terracotta/45 rounded-3xl p-3 sm:p-5 shadow-sm">
            <div className="border border-blush-rose/35 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Fine-Art Architectural Line Engraving & Venue Address */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-5">
                <div className="lg:hidden">
                  <VenueLineArtArch />
                </div>

                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-terracotta font-semibold">
                  <MapPin className="w-4 h-4 text-blush-rose" />
                  <span>{location.addressLine2}</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.12em] text-espresso uppercase">
                  {location.venueName}
                </h3>

                <div className="space-y-1 text-sm sm:text-base text-espresso/80">
                  <p className="font-medium">{location.addressLine1}</p>
                  <p>{location.addressLine2}</p>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-espresso/75 bg-sand-light border border-sand-dark rounded-xl p-4 max-w-lg mx-auto lg:mx-0 text-left">
                  <Compass className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
                  <span>{location.travelNote}</span>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start">
                  <a
                    href={location.googleMapsUrl}
                    onClick={openGoogleMapsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-terracotta hover:bg-rust text-alabaster text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.16em] font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-full shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Right Column: Fine-Art Architectural Line Engraving */}
              <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center lg:border-l border-sand-dark lg:pl-8">
                <VenueLineArtArch />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ORDER OF EVENTS / TIMELINE (0 Photos — Arched Fine-Art Program)
         ===================================================================== */}
      <section
        id="timeline"
        className="relative py-20 sm:py-28 px-4 sm:px-6 bg-alabaster border-t border-sand-dark/70 overflow-hidden"
      >
        <BotanicalSprig
          className="absolute top-16 -right-12 w-52 h-52 -rotate-45 opacity-25 pointer-events-none"
          color="#465943"
        />
        <BotanicalSprig
          className="absolute bottom-16 -left-12 w-52 h-52 rotate-45 opacity-25 pointer-events-none"
          color="#6B8467"
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.38em] text-rust font-semibold">
              Order of Celebration
            </span>
            <h2 className="font-script text-5xl sm:text-7xl text-terracotta mt-1">
              Wedding Program
            </h2>
            <StationeryOrnament />
          </div>

          {/* Arched Fine-Art Letterpress Program Sheet */}
          <div className="bg-alabaster border border-terracotta/50 boho-arch-sm p-3 sm:p-5 shadow-[0_18px_50px_-18px_rgba(34,43,35,0.14)]">
            <div className="border border-blush-rose/35 boho-arch-sm px-3 sm:px-12 pt-10 pb-12 relative">
              {/* Top Sunburst & Date Program Crest */}
              <div className="text-center mb-10">
                <svg
                  viewBox="0 0 80 34"
                  fill="none"
                  className="w-16 h-7 mx-auto text-terracotta mb-2"
                >
                  <path
                    d="M20 30 A20 20 0 0 1 60 30"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    fill="#E8C5C8"
                    fillOpacity="0.4"
                  />
                  <line x1="40" y1="3" x2="40" y2="8" stroke="#D49499" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="23" y1="9" x2="26" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="57" y1="9" x2="54" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="12" y1="30" x2="68" y2="30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.34em] text-rust font-semibold">
                  {schedule.dateFormatted}
                </p>
              </div>

              {/* Central Sage & Blush Thread Spine + Alternating Duet Milestones */}
              <div className="relative">
                {/* Continuous Vertical Sage & Blush Thread */}
                <div className="absolute left-1/2 top-2 bottom-2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-terracotta/25 via-blush-rose to-terracotta/25" />

                <div className="space-y-10 sm:space-y-12">
                  {timeline.map((event, idx) => {
                    const isEven = idx % 2 === 0;
                    return (
                      <motion.div
                        key={event.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.08, duration: 0.6 }}
                        className="relative grid grid-cols-2 items-center gap-6 sm:gap-12"
                      >
                        {/* Center Diamond & Blush Node on the Spine */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-alabaster border border-blush-rose/70 flex items-center justify-center shadow-sm">
                            <div className="w-2 h-2 rotate-45 bg-terracotta" />
                          </div>
                        </div>

                        {/* LEFT COLUMN (Illustration on even rows, Text details on odd rows) */}
                        <div
                          className={`flex flex-col ${
                            isEven
                              ? 'items-end text-right pr-2 sm:pr-4'
                              : 'items-end text-right pr-2 sm:pr-4'
                          }`}
                        >
                          {isEven ? (
                            <div className="flex flex-col items-center sm:items-end">
                              <div className="relative p-2 rounded-full bg-sand-light/90 border border-blush-rose/35 shadow-sm">
                                {renderTimelineIcon(event.icon)}
                              </div>
                              <span className="text-[9px] uppercase tracking-[0.28em] text-rust/80 font-serif mt-1.5">
                                Act {ROMAN_NUMERALS[idx] || idx + 1}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span
                                style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}
                                className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.2em] text-rust uppercase bg-blush-light/70 border border-blush-rose/35 px-2.5 py-0.5 rounded-full"
                              >
                                {event.time}
                              </span>
                              <h3 className="font-serif text-xl sm:text-3xl font-semibold text-espresso mt-1.5 leading-tight">
                                {event.title}
                              </h3>
                              <p className="font-serif italic text-xs sm:text-sm text-espresso/75 mt-1 leading-relaxed max-w-[190px] sm:max-w-[230px] ml-auto">
                                {event.subtitle}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN (Text details on even rows, Illustration on odd rows) */}
                        <div className="flex flex-col items-start text-left pl-2 sm:pl-4">
                          {isEven ? (
                            <div>
                              <span
                                style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}
                                className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.2em] text-rust uppercase bg-blush-light/70 border border-blush-rose/35 px-2.5 py-0.5 rounded-full"
                              >
                                {event.time}
                              </span>
                              <h3 className="font-serif text-xl sm:text-3xl font-semibold text-espresso mt-1.5 leading-tight">
                                {event.title}
                              </h3>
                              <p className="font-serif italic text-xs sm:text-sm text-espresso/75 mt-1 leading-relaxed max-w-[190px] sm:max-w-[230px]">
                                {event.subtitle}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center sm:items-start">
                              <div className="relative p-2 rounded-full bg-sand-light/90 border border-blush-rose/35 shadow-sm">
                                {renderTimelineIcon(event.icon)}
                              </div>
                              <span className="text-[9px] uppercase tracking-[0.28em] text-rust/80 font-serif mt-1.5">
                                Act {ROMAN_NUMERALS[idx] || idx + 1}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Starlight Closing Flourish */}
              <div className="text-center mt-12 pt-6 border-t border-sand-dark/60">
                <p className="font-serif italic text-sm sm:text-base text-rust">
                  “From golden hour vows to starlit dancing”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. THE NUPTIAL ENTOURAGE (0 Photos — Ornate Monogram Crest Header)
         ===================================================================== */}
      <section
        id="entourage"
        className="relative py-20 sm:py-28 px-4 sm:px-6 bg-sand-light border-t border-sand-dark/70 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto">
          {/* Ornate Stationery Crest Header (Replaces the wide banner photo!) */}
          <div className="text-center mb-12">
            <div className="inline-flex flex-col items-center justify-center px-8 py-4 rounded-full bg-alabaster border border-blush-rose/50 shadow-sm mb-4">
              <span className="text-[10px] uppercase tracking-[0.35em] text-rust font-semibold">
                {schedule.shortDate}
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-espresso">
                {couple.monogram}
              </span>
            </div>
            <h2 className="font-script text-5xl sm:text-7xl text-rust">
              {couple.nuptialTitle}
            </h2>
            <p className="font-serif text-base sm:text-xl tracking-[0.35em] text-terracotta uppercase font-semibold mt-1">
              The Nuptial Entourage
            </p>
            <StationeryOrnament />
          </div>

          {/* Parents (& Optional Grandparents) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-alabaster rounded-3xl p-6 sm:p-8 border border-terracotta/40 shadow-sm text-center flex flex-col justify-center space-y-6">
              {entourage.groomGrandparents.length > 0 && (
                <div className="pb-4 border-b border-sand-dark">
                  <h3 className="text-xs font-bold tracking-[0.24em] text-rust uppercase mb-3">
                    Grandparents of the Groom
                  </h3>
                  <div className="space-y-2 text-sm text-espresso">
                    {entourage.groomGrandparents.map((gp) => (
                      <div key={gp.name}>
                        <p className="font-semibold">{gp.name}</p>
                        <p className="text-xs text-espresso/60 italic">({gp.place})</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-xs font-bold tracking-[0.24em] text-rust uppercase mb-3">
                  Parents of the Groom
                </h3>
                <div className="space-y-1.5 text-sm sm:text-base font-semibold text-espresso">
                  {entourage.groomParents.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-alabaster rounded-3xl p-6 sm:p-8 border border-terracotta/40 shadow-sm text-center flex flex-col justify-center space-y-6">
              {entourage.brideGrandparents.length > 0 && (
                <div className="pb-4 border-b border-sand-dark">
                  <h3 className="text-xs font-bold tracking-[0.24em] text-rust uppercase mb-3">
                    Grandparents of the Bride
                  </h3>
                  <div className="space-y-2 text-sm text-espresso">
                    {entourage.brideGrandparents.map((gp) => (
                      <div key={gp.name}>
                        <p className="font-semibold">{gp.name}</p>
                        <p className="text-xs text-espresso/60 italic">({gp.place})</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-xs font-bold tracking-[0.24em] text-rust uppercase mb-3">
                  Parents of the Bride
                </h3>
                <div className="space-y-1.5 text-sm sm:text-base font-semibold text-espresso">
                  {entourage.brideParents.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {entourage.brideParentsPlace && (
                  <p className="text-xs text-espresso/60 italic mt-1.5">
                    ({entourage.brideParentsPlace})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Principal Sponsors */}
          <div className="mt-8 bg-alabaster rounded-3xl p-6 sm:p-10 border border-terracotta/40 shadow-sm text-center">
            <h3 className="font-script text-4xl sm:text-5xl text-rust">Principal Sponsors</h3>
            <p className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold mt-1">
              {entourage.principalSponsorsSubtitle}
            </p>
            <StationeryOrnament />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-xs sm:text-sm text-espresso font-medium">
              {entourage.principalSponsors.map((pair, idx) => (
                <React.Fragment key={idx}>
                  <div
                    className={`${
                      pair.ninong ? 'block' : 'hidden sm:block'
                    } sm:text-right py-1 border-b sm:border-b-0 border-sand`}
                  >
                    {pair.ninong}
                  </div>
                  <div
                    className={`${
                      pair.ninang ? 'block' : 'hidden sm:block'
                    } sm:text-left py-1 border-b border-sand sm:border-b-0`}
                  >
                    {pair.ninang}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* The Entourage, Secondary Sponsors, Bearers & Flower Girls */}
          <div className="mt-8 bg-alabaster rounded-3xl p-6 sm:p-10 border border-terracotta/40 shadow-sm text-center space-y-8">
            <div>
              <h3 className="font-script text-4xl sm:text-5xl text-rust">The Entourage</h3>
              <p className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold mt-1">
                {entourage.entourageSubtitle}
              </p>
              <StationeryOrnament />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-sand-light rounded-2xl p-5 border border-sand-dark flex flex-col justify-center">
                <h4 className="text-xs font-bold tracking-[0.24em] text-rust uppercase">Best Man</h4>
                <p className="text-sm sm:text-base font-semibold text-espresso mt-1.5">
                  {entourage.bestMan}
                </p>
              </div>
              <div className="bg-sand-light rounded-2xl p-5 border border-sand-dark flex flex-col justify-center">
                <h4 className="text-xs font-bold tracking-[0.24em] text-rust uppercase">
                  Matrons of Honor
                </h4>
                <div className="mt-1.5 space-y-1 text-sm sm:text-base font-semibold text-espresso">
                  {entourage.matronsOfHonor.map((moh) => (
                    <p key={moh}>{moh}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Secondary Sponsors Header (Before Candle, Cord, Veil) */}
            <div className="pt-4 border-t border-sand-dark/40">
              <h3 className="font-script text-4xl sm:text-5xl text-rust">Secondary Sponsors</h3>
              <p className="text-xs tracking-[0.25em] uppercase text-terracotta font-semibold mt-1">
                {entourage.secondarySponsorsSubtitle}
              </p>
              <StationeryOrnament />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[entourage.candle, entourage.cord, entourage.veil].map((group) => (
                <div
                  key={group.title}
                  className="bg-sand-light rounded-2xl p-5 border border-sand-dark"
                >
                  <h4 className="text-xs font-bold tracking-[0.22em] text-rust uppercase">
                    {group.title}
                  </h4>
                  <p className="font-script text-2xl text-terracotta mb-2">{group.subtitle}</p>
                  <div className="space-y-1 text-xs sm:text-sm font-medium text-espresso">
                    {group.members.map((m) => (
                      <p key={m}>{m}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-sand-light rounded-2xl p-5 border border-sand-dark">
                <h4 className="text-xs font-bold tracking-[0.24em] text-rust uppercase mb-2">
                  Groomsmen
                </h4>
                <div className="space-y-1 text-xs sm:text-sm font-medium text-espresso">
                  {entourage.groomsmen.map((gm) => (
                    <p key={gm}>{gm}</p>
                  ))}
                </div>
              </div>
              <div className="bg-sand-light rounded-2xl p-5 border border-sand-dark">
                <h4 className="text-xs font-bold tracking-[0.24em] text-rust uppercase mb-2">
                  Bridesmaids
                </h4>
                <div className="space-y-1 text-xs sm:text-sm font-medium text-espresso">
                  {entourage.bridesmaids.map((bm) => (
                    <p key={bm}>{bm}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[entourage.bearers.ring, entourage.bearers.coin, entourage.bearers.bible].map(
                (bearer) => (
                  <div
                    key={bearer.title}
                    className="bg-sand-light rounded-2xl p-5 border border-sand-dark"
                  >
                    <h4 className="text-xs font-bold tracking-[0.22em] text-rust uppercase">
                      {bearer.title}
                    </h4>
                    <p className="font-script text-2xl text-terracotta mb-1">{bearer.subtitle}</p>
                    <p className="text-xs sm:text-sm font-semibold text-espresso">{bearer.name}</p>
                  </div>
                )
              )}
            </div>

            <div
              className={
                entourage.petOfHonor
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                  : 'max-w-md mx-auto'
              }
            >
              <div className="bg-sand-light rounded-2xl p-5 border border-sand-dark">
                <h4 className="font-script text-3xl text-rust">{entourage.flowerGirls.title}</h4>
                <p className="font-script text-xl text-terracotta mb-2">
                  {entourage.flowerGirls.subtitle}
                </p>
                <div className="space-y-1 text-xs sm:text-sm font-semibold text-espresso">
                  {entourage.flowerGirls.members.map((fg) => (
                    <p key={fg}>{fg}</p>
                  ))}
                </div>
              </div>

              {entourage.petOfHonor && (
                <div className="bg-blush-light/60 rounded-2xl p-5 border border-blush-rose/50 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-blush/50 text-blush-deep flex items-center justify-center mb-1.5">
                    <PawPrint className="w-5 h-5" />
                  </div>
                  <h4 className="font-script text-3xl text-rust">{entourage.petOfHonor.role}</h4>
                  <span className="font-serif text-2xl font-bold tracking-[0.2em] text-espresso uppercase">
                    {entourage.petOfHonor.name}
                  </span>
                  <p className="text-xs text-espresso/70 mt-1 italic">
                    {entourage.petOfHonor.breedOrNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. DRESS CODE & COLOR MOTIF (0 Photos — Stationery Swatch Card)
         ===================================================================== */}
      <section
        id="dress-code"
        className="relative py-20 sm:py-28 px-4 sm:px-6 bg-alabaster border-t border-sand-dark/70"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.38em] text-rust font-semibold">
            Attire Guide
          </span>
          <h2 className="font-script text-6xl sm:text-7xl text-rust mt-1">The Dress Code</h2>
          <StationeryOrnament />

          <div className="bg-alabaster rounded-3xl p-6 sm:p-10 border border-terracotta/45 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.2em] text-rust font-bold">
                {dressCode.guests.subtitle}
              </h3>
              <p className="text-xs sm:text-sm text-espresso/75 max-w-xl mx-auto mt-2">
                {dressCode.guests.note}
              </p>

              <div className="grid grid-cols-5 gap-1.5 sm:gap-4 max-w-sm sm:max-w-2xl mx-auto mt-7">
                {dressCode.swatches.map((swatch) => {
                  const isSelected = selectedSwatch.hex === swatch.hex;
                  const isLightSwatch = ['#BDC8B7', '#EFE2D3', '#F0C4C2', '#D1B19F', '#EACCCE', '#E8C5C8', '#CCD8C8'].includes(
                    swatch.hex.toUpperCase()
                  );
                  return (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => setSelectedSwatch(swatch)}
                      className={`flex flex-col items-center focus:outline-none transition-transform ${
                        isSelected ? 'scale-105 sm:scale-110' : 'hover:scale-105'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-sm flex items-center justify-center border-2 ${
                          isSelected ? 'border-espresso ring-2 sm:ring-4 ring-blush-rose/35' : 'border-white'
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 sm:w-5 sm:h-5 drop-shadow ${
                              isLightSwatch ? 'text-espresso' : 'text-white'
                            }`}
                          />
                        )}
                      </div>
                      <span className="text-[9px] sm:text-xs font-semibold text-espresso mt-1.5 sm:mt-2 text-center leading-tight">
                        {swatch.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 max-w-lg mx-auto bg-sand-light rounded-2xl p-4 sm:p-5 border border-sand-dark flex items-center gap-4 text-left">
                <div
                  className="w-12 h-12 rounded-xl shrink-0 border border-black/10"
                  style={{ backgroundColor: selectedSwatch.hex }}
                />
                <div>
                  <h4 className="font-serif text-lg font-bold text-espresso">
                    {selectedSwatch.name}{' '}
                    <span className="text-[10px] uppercase tracking-widest text-rust ml-1">
                      • {selectedSwatch.role}
                    </span>
                  </h4>
                  <p className="text-xs text-espresso/80 mt-0.5">{selectedSwatch.attireTip}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-sand-dark text-left">
                <span className="text-[10px] uppercase tracking-[0.22em] text-rust font-semibold block text-center mb-1">
                  Principal Sponsors Attire Guide
                </span>
                <h4 className="font-serif text-xl font-bold text-espresso text-center mb-4">
                  Ninongs &amp; Ninangs
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-sand-light p-4 rounded-2xl border border-sand-dark">
                    <p className="font-bold text-rust uppercase text-xs tracking-wider">Ninangs</p>
                    <p className="text-xs text-espresso mt-1 leading-relaxed">
                      Floor-length formal gowns in Champagne, Rose Gold, or Rose Beige.
                    </p>
                    <p className="text-[10.5px] text-rust/90 italic mt-1.5">
                      ✦ Note: We kindly ask to leave Sage Green for the bridesmaids.
                    </p>
                  </div>
                  <div className="bg-sand-light p-4 rounded-2xl border border-sand-dark">
                    <p className="font-bold text-rust uppercase text-xs tracking-wider">Ninongs</p>
                    <p className="text-xs text-espresso mt-1 leading-relaxed">
                      Barong Tagalog or a Charcoal Grey / Black Suit with a Blush Pink necktie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. REMINDERS (0 Photos — Minimalist Stationery Notes)
         ===================================================================== */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-sand-light border-t border-sand-dark/70">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.38em] text-rust font-semibold">
              Kindly Note
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-espresso font-semibold uppercase tracking-[0.15em] mt-1">
              Finer Details
            </h2>
            <StationeryOrnament />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gift Note */}
            <div className="bg-alabaster rounded-3xl p-6 border border-terracotta/45 shadow-sm text-center flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-blush-light border border-blush-rose/50 text-blush-deep flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.22em] uppercase text-rust">
                  {reminders.giftNote.title}
                </h3>
                <p className="text-xs sm:text-sm text-espresso/80 mt-3 leading-relaxed">
                  {reminders.giftNote.message}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-rust font-semibold">
                  ✦ Your prayers &amp; presence are our greatest treasure
                </p>
              </div>
            </div>

            {/* Unplugged Ceremony */}
            <div className="bg-alabaster rounded-3xl p-6 border border-terracotta/45 shadow-sm text-center flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-sand-light border border-terracotta/45 text-terracotta flex items-center justify-center mx-auto mb-3">
                  <PhoneOff className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.22em] uppercase text-rust">
                  {reminders.unplugged.title}
                </h3>
                <p className="text-xs sm:text-sm text-espresso/80 mt-3 leading-relaxed">
                  {reminders.unplugged.message}
                </p>
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-rust font-semibold mt-4 pt-3 border-t border-sand">
                Be Present With Us
              </p>
            </div>

            {/* Official Hashtag */}
            <div className="bg-alabaster rounded-3xl p-6 border border-terracotta/45 shadow-sm text-center flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-full bg-sand-light border border-terracotta/45 text-terracotta flex items-center justify-center mx-auto mb-3">
                  <Hash className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.22em] uppercase text-rust">
                  {reminders.hashtagNote.title}
                </h3>
                <p className="text-xs sm:text-sm text-espresso/80 mt-3 leading-relaxed">
                  {reminders.hashtagNote.message}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-sand space-y-2">
                <p className="font-serif text-base font-bold text-terracotta break-all">
                  {couple.hashtag}
                </p>
                <button
                  type="button"
                  onClick={handleCopyHashtag}
                  className="inline-flex items-center gap-1.5 bg-terracotta hover:bg-rust text-alabaster text-[11px] font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full transition-colors"
                >
                  {copiedHashtag ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Hashtag</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. CURATED PORTRAITS + EXPANDABLE FULL 46-PHOTO STUDIO ROLL
         ===================================================================== */}
      <section
        id="gallery"
        className="relative py-20 sm:py-28 px-4 sm:px-6 bg-alabaster border-t border-sand-dark/70"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.38em] text-rust font-semibold">
              Curated Keepsakes
            </span>
            <h2 className="font-script text-5xl sm:text-7xl text-terracotta mt-1">
              Intimate Portraits
            </h2>
            <StationeryOrnament />
          </div>

          {/* 3-Photo Fine-Art Matted Triptych */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
            {curatedPortraits.map((photo, index) => (
              <motion.button
                key={photo.url}
                type="button"
                onClick={() => setLightboxIndex(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.6 }}
                className={`group bg-alabaster p-4 sm:p-5 border border-terracotta/45 shadow-sm text-center focus:outline-none ${
                  index === 1 ? 'boho-arch md:-translate-y-4' : 'rounded-2xl'
                }`}
              >
                <div
                  className={`overflow-hidden aspect-[3/4] bg-sand-light relative ${
                    index === 1 ? 'boho-arch' : 'rounded-xl'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-alabaster/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-rust" />
                  </div>
                </div>
                <p className="font-script text-2xl sm:text-3xl text-rust mt-3">{photo.caption}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Lightbox Modal for Curated Portraits */}
        <AnimatePresence>
          {lightboxIndex !== null && curatedPortraits[lightboxIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="fixed inset-0 z-50 bg-espresso/90 backdrop-blur-md flex items-center justify-center p-4"
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close lightbox"
                className="fixed top-5 right-5 w-10 h-10 rounded-full bg-alabaster/15 hover:bg-alabaster/30 text-alabaster flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (lightboxIndex - 1 + curatedPortraits.length) % curatedPortraits.length
                  );
                }}
                aria-label="Previous portrait"
                className="fixed left-4 sm:left-8 w-11 h-11 rounded-full bg-alabaster/15 hover:bg-alabaster/30 text-alabaster flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <motion.div
                key={curatedPortraits[lightboxIndex].url}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_e, info) => {
                  if (info.offset.x < -50 || info.velocity.x < -300) {
                    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % curatedPortraits.length : null));
                  } else if (info.offset.x > 50 || info.velocity.x > 300) {
                    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + curatedPortraits.length) % curatedPortraits.length : null));
                  }
                }}
                initial={{ scale: 0.94, opacity: 0, x: 20 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.94, opacity: 0, x: -20 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-3xl w-full bg-alabaster p-4 sm:p-6 rounded-2xl shadow-2xl text-center touch-pan-y cursor-grab active:cursor-grabbing select-none"
              >
                <img
                  src={curatedPortraits[lightboxIndex].url}
                  alt={curatedPortraits[lightboxIndex].caption}
                  draggable={false}
                  className="w-full max-h-[70vh] object-contain rounded-lg pointer-events-none select-none"
                />
                <p className="font-script text-3xl text-rust mt-3 pointer-events-none">
                  {curatedPortraits[lightboxIndex].caption}
                </p>
                <p className="text-[10px] text-espresso/50 uppercase tracking-widest mt-1 pointer-events-none">
                  Portrait {lightboxIndex + 1} of {curatedPortraits.length} • Swipe to browse
                </p>
              </motion.div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % curatedPortraits.length);
                }}
                aria-label="Next portrait"
                className="fixed right-4 sm:right-8 w-11 h-11 rounded-full bg-alabaster/15 hover:bg-alabaster/30 text-alabaster flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* =====================================================================
          9. RSVP & GUESTBOOK WALL (0 Photos)
         ===================================================================== */}
      <section
        id="rsvp"
        className="relative py-20 sm:py-28 px-4 sm:px-6 bg-sand-light border-t border-sand-dark/70"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.38em] text-rust font-semibold">
              Répondez S&apos;il Vous Plaît
            </span>
            <h2 className="font-script text-5xl sm:text-7xl text-rust mt-1">RSVP &amp; Wishes</h2>
            <StationeryOrnament />
            <p className="text-xs sm:text-sm text-espresso/75">
              {weddingConfig.rsvp.deadlineText}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-alabaster rounded-3xl p-6 sm:p-8 border border-terracotta/45 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-espresso uppercase tracking-wider mb-5">
                Attendance Response
              </h3>

              {submitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-3xl font-bold text-rust">Thank You!</h4>
                  <p className="text-xs sm:text-sm text-espresso/80">
                    Your RSVP and note have been recorded for {couple.displayTitle}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs uppercase tracking-widest font-semibold text-terracotta underline"
                  >
                    Send another response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maria Clara Santos"
                      className="w-full rounded-xl bg-sand-light border border-sand-dark px-4 py-2.5 text-sm text-espresso focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                      Relationship to Couple
                    </label>
                    <input
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Family, Friend, Sponsor"
                      className="w-full rounded-xl bg-sand-light border border-sand-dark px-4 py-2.5 text-sm text-espresso focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendance('attending')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                        attendance === 'attending'
                          ? 'bg-terracotta text-alabaster border-terracotta'
                          : 'bg-sand-light text-espresso/75 border-sand-dark'
                      }`}
                    >
                      Joyfully Attending
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance('regrets')}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                        attendance === 'regrets'
                          ? 'bg-rust text-alabaster border-rust'
                          : 'bg-sand-light text-espresso/75 border-sand-dark'
                      }`}
                    >
                      Sending Regrets
                    </button>
                  </div>

                  {attendance === 'attending' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                          <Users className="w-3.5 h-3.5 inline mr-1 text-terracotta" />
                          Seats
                        </label>
                        <select
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(Number(e.target.value))}
                          className="w-full rounded-xl bg-sand-light border border-sand-dark px-3 py-2.5 text-sm text-espresso focus:outline-none focus:border-terracotta"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                          <Music className="w-3.5 h-3.5 inline mr-1 text-terracotta" />
                          Song
                        </label>
                        <input
                          type="text"
                          value={songRequest}
                          onChange={(e) => setSongRequest(e.target.value)}
                          placeholder="Optional track"
                          className="w-full rounded-xl bg-sand-light border border-sand-dark px-3 py-2.5 text-sm text-espresso focus:outline-none focus:border-terracotta"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                      Message for the Couple
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your well wishes..."
                      className="w-full rounded-xl bg-sand-light border border-sand-dark px-4 py-2.5 text-sm text-espresso focus:outline-none focus:border-terracotta"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-rust text-alabaster font-serif text-base uppercase tracking-[0.2em] py-3 rounded-full shadow-sm transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit RSVP</span>
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-serif text-2xl font-bold text-espresso uppercase tracking-wider">
                  Guestbook Notes ({wishes.length})
                </h3>
                <span className="text-xs text-rust uppercase tracking-widest font-semibold">
                  Keepsake Wall
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {wishes.map((wish) => (
                  <div
                    key={wish.id}
                    className="bg-alabaster rounded-2xl p-5 border border-terracotta/40 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-espresso">
                            {wish.name}
                          </h4>
                          <p className="text-[10px] uppercase tracking-wider text-terracotta font-semibold">
                            {wish.relationship}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-sand-light border border-sand-dark text-rust font-semibold">
                          {wish.attendance === 'attending'
                            ? `Attending (${wish.guestsCount})`
                            : 'Wishes'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-espresso/80 mt-3 italic leading-relaxed">
                        “{wish.message}”
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-sand flex items-center justify-between text-[11px] text-espresso/45">
                      <span>{wish.createdAt}</span>
                      <Heart className="w-3.5 h-3.5 text-blush-rose fill-blush/50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          10. FINE-ART STATIONERY CLOSING FOOTER (0 Photos — Monogram Medallion)
         ===================================================================== */}
      <footer className="relative bg-alabaster border-t border-sand-dark py-20 px-4 text-center overflow-hidden">
        <BotanicalSprig
          className="hidden lg:block absolute top-6 -left-8 w-52 h-52 rotate-45 opacity-25 pointer-events-none"
          color="#465943"
        />
        <BotanicalSprig
          className="hidden lg:block absolute top-6 -right-8 w-52 h-52 -rotate-45 opacity-25 pointer-events-none"
          color="#6B8467"
        />

        <div className="max-w-2xl mx-auto relative z-10">
          <p className="font-script text-5xl sm:text-6xl text-espresso">
            We look forward to celebrating with you!
          </p>

          <div className="my-8 inline-flex flex-col items-center justify-center w-44 h-44 rounded-full bg-alabaster border-2 border-blush-rose/60 shadow-sm">
            <div className="w-36 h-36 rounded-full border border-terracotta/40 flex flex-col items-center justify-center p-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-rust font-semibold">
                {schedule.shortDate}
              </span>
              <span className="font-serif text-3xl font-bold text-espresso tracking-widest my-1">
                {couple.monogram}
              </span>
              <span className="font-script text-xl text-terracotta leading-tight">{couple.displayTitle}</span>
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.3em] text-rust font-semibold">
            {couple.hashtag}
          </p>
          <p className="text-[11px] text-espresso/50 mt-4 flex items-center justify-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-blush-rose fill-blush-rose" />
            <span>
              for {couple.groomFirstName} and {couple.brideFirstName}&apos;s Wedding
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};
