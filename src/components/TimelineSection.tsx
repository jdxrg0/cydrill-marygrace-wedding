import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Utensils, Cake, Music, Sparkles, Heart } from 'lucide-react';
import { weddingConfig, TimelineItem } from '../config/weddingConfig';
import { TornPaperDivider } from './Dividers';

const renderTimelineIcon = (icon: TimelineItem['icon'], sizeClass = 'w-7 h-7') => {
  switch (icon) {
    case 'rings':
      return (
        <svg viewBox="0 0 36 36" fill="none" className={`${sizeClass} text-terracotta`}>
          <circle cx="14" cy="20" r="8" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="22" cy="20" r="8" stroke="currentColor" strokeWidth="2.2" />
          <path d="M11 10 L14 12 L17 10 L14 7 Z" fill="currentColor" />
        </svg>
      );
    case 'camera':
      return <Camera className={`${sizeClass} text-terracotta`} />;
    case 'utensils':
      return <Utensils className={`${sizeClass} text-terracotta`} />;
    case 'cake':
      return <Cake className={`${sizeClass} text-terracotta`} />;
    case 'music':
      return <Music className={`${sizeClass} text-terracotta`} />;
    case 'sparkles':
      return <Sparkles className={`${sizeClass} text-terracotta`} />;
    default:
      return <Heart className={`${sizeClass} text-terracotta`} />;
  }
};

export const TimelineSection: React.FC = () => {
  const { timeline } = weddingConfig;

  return (
    <section
      id="timeline"
      className="relative bg-alabaster paper-grain pt-6 sm:pt-8 pb-0 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-24">
        {/* Script Heading: "Wedding Timeline" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8 sm:mb-16"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-rust/80 font-semibold">
            Order of Events
          </span>
          <h2 className="font-script text-5xl sm:text-7xl text-terracotta mt-1">
            Wedding Timeline
          </h2>
        </motion.div>

        {/* MOBILE & TABLET (< lg): Connected Vertical Boho Timeline Spine */}
        <div className="lg:hidden relative max-w-md mx-auto pl-2">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[33px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-terracotta/35 via-blush-rose/60 to-terracotta/35" />

          <div className="space-y-3.5">
            {timeline.map((event, idx) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="relative flex items-center gap-3.5"
              >
                {/* Icon Medallion on the Spine */}
                <div className="relative z-10 w-13 h-13 w-[52px] h-[52px] shrink-0 rounded-full bg-[#3E523B] border-2 border-blush shadow-md flex items-center justify-center text-alabaster [&_svg]:text-blush-light">
                  {renderTimelineIcon(event.icon, 'w-5 h-5')}
                </div>

                {/* Event Card */}
                <div className="flex-1 bg-sand-light/85 border border-champagne/50 rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-serif text-lg font-bold text-espresso leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-xs text-espresso/70 mt-0.5 leading-snug">
                      {event.subtitle}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold tracking-[0.14em] text-alabaster bg-[#3E523B] border border-blush/40 px-2.5 py-1 rounded-full uppercase">
                    {event.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* DESKTOP (lg+): Horizontal 5-Column Icon Timeline with Connecting Dashes */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-6 relative">
          {timeline.map((event, idx) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="relative flex flex-col items-center text-center group"
            >
              {idx < timeline.length - 1 && (
                <div className="flex items-center justify-center absolute top-11 -right-4 w-8 text-blush-rose font-serif text-3xl select-none">
                  —
                </div>
              )}

              <div className="w-24 h-24 rounded-full bg-[#3E523B] border-2 border-blush shadow-card flex items-center justify-center group-hover:bg-[#2B3B29] group-hover:border-blush-rose group-hover:-translate-y-1.5 transition-all duration-300 [&_svg]:text-blush-light">
                {renderTimelineIcon(event.icon, 'w-7 h-7')}
              </div>

              <h3 className="font-serif text-2xl font-bold text-espresso mt-4">
                {event.title}
              </h3>
              <span className="inline-block text-xs font-bold tracking-[0.18em] text-alabaster bg-[#3E523B] px-3 py-0.5 rounded-full uppercase mt-1">
                {event.time}
              </span>
              <p className="text-xs text-espresso/70 mt-1.5 max-w-[160px] leading-relaxed">
                {event.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <TornPaperDivider fill="#E4EBE1" />
    </section>
  );
};
