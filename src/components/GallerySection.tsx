import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Heart,
  Sparkles,
  Film,
  Camera,
} from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { BohoSunDivider, TornPaperDivider } from './Dividers';

const PORTRAITS_PER_PAGE = 12;

/**
 * Maps a full-resolution web portrait (/photos/grace-cydrill-XX.jpg)
 * to its lightweight grid thumbnail (/photos/thumbs/grace-cydrill-XX.jpg)
 */
const toThumbUrl = (url: string): string =>
  url.startsWith('/photos/') && !url.startsWith('/photos/thumbs/')
    ? url.replace('/photos/', '/photos/thumbs/')
    : url;

export const GallerySection: React.FC = () => {
  const { photos, couple, schedule } = weddingConfig;
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [setFilter, setSetFilter] = useState<'all' | 'white' | 'earth'>('all');
  const [rollPage, setRollPage] = useState(0);

  const allPhotos = photos.gallery;
  const chapters = photos.storyChapters;

  const filteredRoll = allPhotos.filter((_, idx) => {
    if (setFilter === 'white') return idx < 31; // #01 to #31
    if (setFilter === 'earth') return idx >= 31; // #32 to #46
    return true;
  });

  const totalRollPages = Math.max(1, Math.ceil(filteredRoll.length / PORTRAITS_PER_PAGE));
  const safeRollPage = Math.min(rollPage, totalRollPages - 1);
  const paginatedRoll = filteredRoll.slice(
    safeRollPage * PORTRAITS_PER_PAGE,
    (safeRollPage + 1) * PORTRAITS_PER_PAGE
  );

  const handleFilterChange = (nextFilter: 'all' | 'white' | 'earth') => {
    setSetFilter(nextFilter);
    setRollPage(0);
  };

  const openLightboxById = (photoId: string) => {
    const idx = allPhotos.findIndex((p) => p.id === photoId);
    if (idx !== -1) setActivePhotoIndex(idx);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex - 1 + allPhotos.length) % allPhotos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((activePhotoIndex + 1) % allPhotos.length);
  };

  const ch1 = chapters[0];
  const ch2 = chapters[1];
  const ch3 = chapters[2];
  const ch4 = chapters[3];

  return (
    <section
      id="gallery"
      className="relative bg-sand-light paper-grain pt-6 sm:pt-10 pb-0 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-24">
        {/* Section Header & Emotional Epigraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-rust font-semibold">
            Captured Moments
          </span>
          <h2 className="font-script text-5xl sm:text-7xl text-terracotta mt-1">
            Our Story in Frames
          </h2>
          <BohoSunDivider />
          <p className="font-serif italic text-base sm:text-xl text-espresso/85 leading-relaxed px-2">
            “{photos.storyIntro}”
          </p>
        </motion.div>

        <div className="space-y-12 sm:space-y-20 relative">
          {/* =================================================================
              CHAPTER I: THE WHISPERED PRAYER (Layered Polaroids + Journal Page)
             ================================================================= */}
          {ch1 && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center"
            >
              {/* Left: Tactile Polaroid with Washi Masking Tape + Corner Bouquet Detail */}
              <div className="lg:col-span-5 flex justify-center relative pb-6 sm:pb-4">
                <button
                  type="button"
                  onClick={() => openLightboxById(ch1.photos[0].id)}
                  className="group relative w-full max-w-[300px] sm:max-w-[335px] bg-alabaster p-3.5 sm:p-4 pb-5 sm:pb-6 rounded-2xl shadow-polaroid border border-champagne/70 -rotate-1 sm:-rotate-2 hover:rotate-0 transition-all duration-500 text-left focus:outline-none"
                >
                  {/* Decorative Blush Washi Tape Strip at Top */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-blush/75 border border-blush-rose/50 rotate-1 shadow-sm pointer-events-none" />

                  <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-rust/70 mb-2 px-0.5">
                    <span>{ch1.photos[0].frameCode}</span>
                    <span>{schedule.shortDate}</span>
                  </div>

                  <div className="relative aspect-[3/3.7] overflow-hidden rounded-xl bg-espresso/10">
                    <img
                      src={ch1.photos[0].url}
                      alt={ch1.photos[0].caption}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-[50%_18%] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-alabaster/90 flex items-center justify-center shadow-sm">
                      <ZoomIn className="w-3.5 h-3.5 text-rust" />
                    </div>
                  </div>

                  <p className="font-script text-2xl sm:text-3xl text-rust text-center mt-3.5 leading-snug px-2">
                    {ch1.photos[0].caption}
                  </p>
                </button>

                {/* Overlapping Mini Keepsake Polaroid (#05: Hands & Bouquet) */}
                {ch1.photos[1] && (
                  <button
                    type="button"
                    onClick={() => openLightboxById(ch1.photos[1].id)}
                    className="group absolute -bottom-2 right-1 sm:-right-3 w-28 sm:w-36 bg-alabaster p-2 pb-2.5 rounded-xl shadow-lg border border-blush-rose/60 rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 text-center focus:outline-none z-10"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-espresso/10">
                      <img
                        src={toThumbUrl(ch1.photos[1].url)}
                        alt={ch1.photos[1].caption}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-[50%_28%] scale-125 group-hover:scale-135 transition-transform duration-500"
                      />
                    </div>
                    <p className="font-script text-sm sm:text-base text-rust mt-1 leading-none">
                      Answered Prayer
                    </p>
                  </button>
                )}
              </div>

              {/* Right: Chapter I Narrative Journal Card */}
              <div className="lg:col-span-7 bg-alabaster/95 rounded-3xl p-6 sm:p-9 border border-champagne/60 shadow-card relative">
                <div className="inline-flex items-center gap-2 bg-blush-light/85 border border-blush/60 px-3.5 py-1 rounded-full mb-3">
                  <Sparkles className="w-3 h-3 text-blush-deep" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-rust font-bold">
                    {ch1.chapterNumber} • {ch1.seasonTag}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-espresso leading-tight">
                  {ch1.title}
                </h3>

                <p className="text-xs sm:text-base text-espresso/85 leading-relaxed mt-3.5 sm:mt-4">
                  {ch1.story}
                </p>

                <div className="mt-5 pt-4 border-t border-champagne/40 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blush-light text-blush-deep flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 fill-blush-rose/45 text-blush-deep" />
                  </div>
                  <p className="font-serif italic text-sm sm:text-lg text-rust font-medium">
                    {ch1.quote}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* =================================================================
              CHAPTER II: WHEN OUR PATHS CROSSED (4-Polaroid Scrapbook + Story)
             ================================================================= */}
          {ch2 && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center"
            >
              {/* Story Card (Order 2 on mobile so photos lead, Order 1 on desktop for alternating flow) */}
              <div className="order-2 lg:order-1 lg:col-span-5 bg-alabaster/95 rounded-3xl p-6 sm:p-9 border border-champagne/60 shadow-card">
                <div className="inline-flex items-center gap-2 bg-sand/80 border border-champagne/50 px-3.5 py-1 rounded-full mb-3">
                  <Sparkles className="w-3 h-3 text-terracotta" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-rust font-bold">
                    {ch2.chapterNumber} • {ch2.seasonTag}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-espresso leading-tight">
                  {ch2.title}
                </h3>

                <p className="text-xs sm:text-base text-espresso/85 leading-relaxed mt-3.5 sm:mt-4">
                  {ch2.story}
                </p>

                <div className="mt-5 pt-4 border-t border-champagne/40 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blush-light text-blush-deep flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 fill-blush-rose/45 text-blush-deep" />
                  </div>
                  <p className="font-serif italic text-sm sm:text-lg text-rust font-medium">
                    {ch2.quote}
                  </p>
                </div>
              </div>

              {/* 2x2 Staggered Scrapbook Polaroids (Side-by-side on both Mobile & Desktop!) */}
              <div className="order-1 lg:order-2 lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-5 items-center pt-2 pb-4 sm:py-2">
                {ch2.photos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => openLightboxById(photo.id)}
                    className={`group relative bg-alabaster p-2.5 sm:p-3.5 pb-3.5 sm:pb-4 rounded-2xl shadow-polaroid border border-champagne/70 transition-all duration-500 text-left focus:outline-none ${
                      idx % 2 === 0
                        ? '-rotate-1 sm:-rotate-2 hover:rotate-0'
                        : 'rotate-1 sm:rotate-2 translate-y-2 sm:translate-y-4 hover:rotate-0'
                    }`}
                  >
                    {/* Washi Tape (Alternating Sage Mist & Soft Blush) */}
                    <div
                      className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 sm:w-22 h-4 sm:h-5 shadow-sm pointer-events-none ${
                        idx % 2 === 0
                          ? '-rotate-2 bg-sand/90 border border-champagne/70'
                          : 'rotate-2 bg-blush/75 border border-blush-rose/50'
                      }`}
                    />

                    <div className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.16em] text-rust/70 mb-1.5 truncate">
                      {photo.frameCode}
                    </div>

                    <div className="relative aspect-[3/3.6] overflow-hidden rounded-xl bg-espresso/10">
                      <img
                        src={toThumbUrl(photo.url)}
                        alt={photo.caption}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-alabaster/90 flex items-center justify-center shadow-sm">
                        <ZoomIn className="w-3 h-3 text-rust" />
                      </div>
                    </div>

                    <p className="font-script text-lg sm:text-2xl text-rust text-center mt-2 leading-tight px-1">
                      {photo.caption}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* =================================================================
              CHAPTER III: THROUGH EVERY SEASON (Story + 6-Frame 35mm Filmstrip)
             ================================================================= */}
          {ch3 && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-alabaster rounded-3xl p-5 sm:p-9 border border-champagne/60 shadow-card space-y-6"
            >
              {/* Top Narrative Row */}
              <div className="max-w-3xl mx-auto text-center space-y-3">
                <div className="inline-flex items-center gap-2 bg-sand/80 border border-champagne/50 px-3.5 py-1 rounded-full">
                  <Film className="w-3.5 h-3.5 text-terracotta" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-rust font-bold">
                    {ch3.chapterNumber} • {ch3.seasonTag}
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl font-bold text-espresso leading-tight">
                  {ch3.title}
                </h3>

                <p className="text-xs sm:text-base text-espresso/85 leading-relaxed">
                  {ch3.story}
                </p>

                <p className="font-serif italic text-sm sm:text-lg text-terracotta font-medium pt-1">
                  {ch3.quote}
                </p>
              </div>

              {/* Authentic 35mm Analog 6-Frame Filmstrip Reel */}
              <div className="bg-espresso rounded-2xl p-2.5 sm:p-5 shadow-polaroid border border-rust/40 relative overflow-hidden">
                {/* Top Sprocket Holes */}
                <div className="h-2.5 sm:h-4 w-full filmstrip-holes opacity-75 mb-2 sm:mb-3" />

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                  {ch3.photos.map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => openLightboxById(photo.id)}
                      className="group text-left focus:outline-none flex flex-col"
                    >
                      <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-mono tracking-widest text-blush/85 mb-1 px-0.5">
                        <span>▸ {photo.frameCode}</span>
                        <span className="hidden sm:inline">PORTRA 400</span>
                      </div>

                      <div className="relative aspect-[3/3.6] overflow-hidden rounded-lg bg-black border border-champagne/20">
                        <img
                          src={toThumbUrl(photo.url)}
                          alt={photo.caption}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-espresso/75 text-blush flex items-center justify-center">
                          <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </div>
                      </div>

                      <p className="font-serif italic text-[10px] sm:text-xs text-sand-light/90 mt-1.5 sm:mt-2 leading-snug line-clamp-2 text-center px-0.5">
                        “{photo.caption}”
                      </p>
                    </button>
                  ))}
                </div>

                {/* Bottom Sprocket Holes */}
                <div className="h-2.5 sm:h-4 w-full filmstrip-holes opacity-75 mt-2 sm:mt-3" />
              </div>
            </motion.div>
          )}

          {/* =================================================================
              CHAPTER IV: THE ANSWERED PRAYER (Twin Forever Arches + Vow Note)
             ================================================================= */}
          {ch4 && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-b from-alabaster to-blush-light/50 rounded-3xl p-5 sm:p-10 border-2 border-blush/70 shadow-card relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
                {/* Left: Twin Forever Arch Portraits with Center Medallion */}
                <div className="lg:col-span-6 relative">
                  <div className="grid grid-cols-2 gap-3 sm:gap-5">
                    {ch4.photos.map((photo, idx) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => openLightboxById(photo.id)}
                        className="group bg-alabaster p-2 sm:p-3 rounded-t-full rounded-b-2xl shadow-polaroid border border-champagne/80 text-center focus:outline-none"
                      >
                        <div className="relative aspect-[3/4.2] rounded-t-full rounded-b-xl overflow-hidden bg-espresso/10">
                          <img
                            src={photo.url}
                            alt={photo.caption}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute bottom-2 right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-alabaster/90 flex items-center justify-center shadow-sm">
                            <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rust" />
                          </div>
                        </div>
                        <p className="font-script text-base sm:text-xl text-rust mt-2 px-1 leading-tight">
                          {idx === 0 ? 'The Easiest “Yes”' : 'Our Forever Ahead'}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Center Floating Date Medallion */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-alabaster border-2 border-blush-rose/70 shadow-lg flex flex-col items-center justify-center pointer-events-none">
                    <Heart className="w-3.5 h-3.5 text-blush-rose fill-blush-rose mb-0.5" />
                    <span className="font-serif text-[9px] sm:text-[10px] font-bold tracking-wider text-espresso">
                      {schedule.shortDate}
                    </span>
                  </div>
                </div>

                {/* Right: Chapter IV Finale Love Letter */}
                <div className="lg:col-span-6 text-left space-y-3.5 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 bg-blush-light border border-blush-rose/45 px-3.5 py-1 rounded-full">
                    <Heart className="w-3 h-3 text-blush-rose fill-blush-rose" />
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-rust font-bold">
                      {ch4.chapterNumber} • {ch4.seasonTag}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-4xl font-bold text-espresso leading-tight">
                    {ch4.title}
                  </h3>

                  <p className="text-xs sm:text-base text-espresso/85 leading-relaxed">
                    {ch4.story}
                  </p>

                  <blockquote className="bg-alabaster/90 rounded-2xl p-4 border-l-4 border-blush-rose shadow-sm">
                    <p className="font-serif italic text-sm sm:text-lg text-rust font-medium">
                      {ch4.quote}
                    </p>
                    <footer className="mt-2 flex items-center justify-between text-xs text-espresso/70">
                      <span className="uppercase tracking-[0.2em] font-semibold text-[10px]">
                        Colossians 3:14 • Bound in Perfect Unity
                      </span>
                      <span className="font-script text-xl sm:text-2xl text-terracotta">
                        — {couple.displayTitle}
                      </span>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </motion.div>
          )}

          {/* =================================================================
              COMPLETE PRENUP STUDIO ROLL (Paginated 12 Lightweight Thumbnails/Page)
             ================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-alabaster rounded-3xl p-5 sm:p-9 border border-champagne/60 shadow-card"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-5 border-b border-champagne/40">
              <div>
                <div className="inline-flex items-center gap-2 bg-blush-light/85 border border-blush/60 px-3 py-1 rounded-full mb-2">
                  <Camera className="w-3.5 h-3.5 text-blush-deep" />
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-rust font-bold">
                    Complete Keepsake Archive • {allPhotos.length} Portraits
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
                  Our Full Prenup Studio Roll
                </h3>
                <p className="text-xs sm:text-sm text-espresso/75 mt-0.5">
                  Tap any portrait to open it in HD and swipe through all {allPhotos.length} memories.
                </p>
              </div>

              {/* Filter Pills for Set I (White Bridal) & Set II (Earth-Tone) */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {[
                  { id: 'all', label: `All (${allPhotos.length})` },
                  { id: 'white', label: 'White Bridal (31)' },
                  { id: 'earth', label: 'Earth-Tone (15)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleFilterChange(tab.id as 'all' | 'white' | 'earth')}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all ${
                      setFilter === tab.id
                        ? 'bg-terracotta text-alabaster shadow-sm'
                        : 'bg-sand-light text-espresso/75 hover:bg-sand border border-champagne/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Paginated 12-Thumbnail Grid (Lightweight ~45KB Thumbs + Off-Thread Async Decoding) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${setFilter}-page-${safeRollPage}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3.5 mt-5"
              >
                {paginatedRoll.map((photo) => {
                  const frameNum = photo.id.replace('photo-', '');
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => openLightboxById(photo.id)}
                      className="group relative bg-sand-light/65 p-1.5 pb-2 rounded-xl border border-champagne/50 shadow-sm hover:shadow-md transition-all text-left focus:outline-none"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-espresso/10">
                        <img
                          src={toThumbUrl(photo.url)}
                          alt={photo.caption}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-espresso/70 backdrop-blur-sm text-alabaster text-[9px] font-mono px-1.5 py-0.5 rounded">
                          #{frameNum}
                        </span>
                      </div>
                      <p className="font-script text-base text-rust text-center mt-1.5 truncate px-1">
                        {photo.caption}
                      </p>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls (12 Portraits per Page — Zero Heavy DOM Reflow) */}
            {totalRollPages > 1 && (
              <div className="mt-6 pt-4 border-t border-champagne/35 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] uppercase tracking-[0.18em] text-rust font-semibold">
                  Showing {safeRollPage * PORTRAITS_PER_PAGE + 1}–
                  {Math.min((safeRollPage + 1) * PORTRAITS_PER_PAGE, filteredRoll.length)} of{' '}
                  {filteredRoll.length} Portraits
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safeRollPage === 0}
                    onClick={() => setRollPage((p) => Math.max(0, p - 1))}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-sand-light hover:bg-blush-light/80 text-rust border border-champagne/60 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalRollPages }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setRollPage(idx)}
                        className={`w-7 h-7 rounded-full text-xs font-serif font-bold transition-all ${
                          idx === safeRollPage
                            ? 'bg-terracotta text-alabaster shadow-sm'
                            : 'bg-sand-light text-espresso/70 hover:bg-sand border border-champagne/40'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={safeRollPage >= totalRollPages - 1}
                    onClick={() => setRollPage((p) => Math.min(totalRollPages - 1, p + 1))}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-sand-light hover:bg-blush-light/80 text-rust border border-champagne/60 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Full-Screen Interactive Story Lightbox Modal */}
      <AnimatePresence>
        {activePhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhotoIndex(null)}
            className="fixed inset-0 z-50 bg-espresso/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={() => setActivePhotoIndex(null)}
              aria-label="Close photo lightbox"
              className="fixed top-5 right-5 w-10 h-10 rounded-full bg-alabaster/15 hover:bg-alabaster/30 text-alabaster flex items-center justify-center transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous photo"
              className="fixed left-3 sm:left-8 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-alabaster/15 hover:bg-alabaster/30 text-alabaster flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={allPhotos[activePhotoIndex].id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_e, info) => {
                if (info.offset.x < -50 || info.velocity.x < -300) {
                  setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % allPhotos.length : null));
                } else if (info.offset.x > 50 || info.velocity.x > 300) {
                  setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : null));
                }
              }}
              initial={{ scale: 0.94, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.94, opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full bg-alabaster p-4 sm:p-6 rounded-3xl shadow-2xl text-center border border-blush touch-pan-y cursor-grab active:cursor-grabbing select-none"
            >
              {allPhotos[activePhotoIndex].chapterTag && (
                <span className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-rust font-bold bg-blush-light border border-blush/60 px-3.5 py-1 rounded-full mb-3 pointer-events-none">
                  {allPhotos[activePhotoIndex].chapterTag}
                </span>
              )}

              <img
                src={allPhotos[activePhotoIndex].url}
                alt={allPhotos[activePhotoIndex].caption}
                draggable={false}
                className="w-full max-h-[60vh] object-contain rounded-xl bg-espresso/5 pointer-events-none select-none"
              />

              <p className="font-script text-3xl sm:text-4xl text-rust mt-3.5 pointer-events-none">
                {allPhotos[activePhotoIndex].caption}
              </p>

              {allPhotos[activePhotoIndex].storyNote && (
                <p className="text-xs sm:text-sm text-espresso/80 max-w-xl mx-auto mt-1.5 leading-relaxed pointer-events-none">
                  {allPhotos[activePhotoIndex].storyNote}
                </p>
              )}

              <p className="text-[10px] text-espresso/45 uppercase tracking-widest mt-3 pointer-events-none">
                Memory {activePhotoIndex + 1} of {allPhotos.length} • Swipe to browse
              </p>
            </motion.div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next photo"
              className="fixed right-3 sm:right-8 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-alabaster/15 hover:bg-alabaster/30 text-alabaster flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <TornPaperDivider fill="#E4EBE1" />
    </section>
  );
};
