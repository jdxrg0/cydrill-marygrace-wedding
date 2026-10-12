import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { TornPaperDivider } from './Dividers';

export const HeroSection: React.FC = () => {
  const { couple, schedule, location, photos } = weddingConfig;
  const slides = photos.heroSlides?.length ? photos.heroSlides : [photos.heroPortrait];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-espresso"
    >
      {/* Full-Bleed Couple Portrait Crossfade Slideshow with Subtle Ken Burns Zoom */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={slides[activeSlide]}
            src={slides[activeSlide]}
            alt={couple.displayTitle}
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 6, ease: 'easeOut' },
            }}
            className="absolute inset-0 w-full h-full object-cover object-[50%_20%]"
          />
        </AnimatePresence>
        {/* Soft Botanical & Sunset Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/55 via-espresso/30 to-[#1F2A20]/80" />
        <div className="absolute inset-0 bg-radial from-transparent to-espresso/40" />
      </div>

      {/* Top Spacer */}
      <div className="h-20" />

      {/* Center Editorial Typography (Echoing "IRIS & JOHANNES are getting married!") */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center my-auto py-16">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-xs sm:text-sm uppercase tracking-[0.45em] text-sand-light/90 mb-4 font-medium"
        >
          Together With Their Families
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.85 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-[0.08em] text-[#FAFBF9] font-bold drop-shadow-md leading-[1.08]"
        >
          {couple.displayTitle}
        </motion.h1>

        {/* Brushstroke / Torn Ribbon Banner Behind Script Subtitle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="relative inline-block mt-2 sm:mt-4 px-8 sm:px-14 py-2 sm:py-3"
        >
          {/* SVG Brushstroke Backdrop (Like the Canva brushstroke under "are getting married!") */}
          <svg
            viewBox="0 0 600 110"
            className="absolute inset-0 w-full h-full -z-10 text-sand-light/95 drop-shadow-lg"
            preserveAspectRatio="none"
          >
            <path
              d="M18,52 C65,16 190,12 310,15 C430,18 545,14 585,44 C602,58 588,92 548,96 C410,104 185,102 42,95 C10,92 -4,68 18,52 Z"
              fill="currentColor"
            />
          </svg>
          <p className="font-script text-4xl sm:text-6xl md:text-7xl text-rust drop-shadow-sm">
            {couple.tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 text-sand-light/95 text-xs sm:text-sm tracking-[0.28em] uppercase font-medium"
        >
          <span>{schedule.dateFormatted}</span>
          <span className="hidden sm:inline text-blush">•</span>
          <span>{location.venueName}</span>
        </motion.div>
      </div>

      {/* Slide Selector Dots + Scroll Down Prompt + Torn Paper Transition */}
      <div className="relative z-10 w-full">
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-2 pb-3">
            {slides.map((slideUrl, idx) => (
              <button
                key={slideUrl}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`View portrait ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === activeSlide
                    ? 'w-6 bg-blush shadow-sm'
                    : 'w-1.5 bg-sand-light/45 hover:bg-sand-light/80'
                }`}
              />
            ))}
          </div>
        )}
        <div className="flex justify-center pb-4">
          <a
            href="#save-the-date"
            aria-label="Scroll to Save the Date"
            className="inline-flex flex-col items-center text-sand-light/80 hover:text-white text-xs uppercase tracking-[0.25em] transition-colors"
          >
            <span className="mb-1">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-bounce text-blush" />
          </a>
        </div>
        <TornPaperDivider fill="#E4EBE1" />
      </div>
    </section>
  );
};
