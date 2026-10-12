import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarPlus, Clock } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { getGoogleCalendarUrl, openGoogleCalendarApp } from '../utils/calendar';
import { BotanicalSprig, TornPaperDivider } from './Dividers';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const SaveTheDateSection: React.FC = () => {
  const { schedule, photos, couple } = weddingConfig;

  const calculateTimeLeft = (): TimeLeft => {
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

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [schedule.isoDate]);

  return (
    <section
      id="save-the-date"
      className="relative bg-sand paper-grain pt-10 pb-0 overflow-hidden"
    >
      {/* Decorative Botanical Accents (Tucked on the outer margins away from the Save the Date text) */}
      <BotanicalSprig
        className="hidden lg:block absolute top-10 -left-16 w-60 h-60 rotate-45 opacity-30 pointer-events-none"
        color="#465943"
      />
      <BotanicalSprig
        className="hidden lg:block absolute bottom-24 -right-16 w-64 h-64 -rotate-135 opacity-30 pointer-events-none"
        color="#6B8467"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Editorial "Save the Date" Header Lockup (Crisp Contrast & Zero Collision) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center relative pt-4 pb-2 sm:py-6"
        >
          {/* Eyebrow Label */}
          <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.38em] text-rust font-semibold mb-2">
            Mark Your Calendar
          </span>

          {/* Flanked "SAVE THE" + Script "Date" Editorial Lockup */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-r from-transparent to-rust/60" />
              <span className="font-serif text-xl sm:text-3xl md:text-4xl uppercase tracking-[0.35em] text-espresso font-bold pl-[0.35em]">
                Save The
              </span>
              <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-l from-transparent to-rust/60" />
            </div>

            <div className="relative inline-block mt-1 sm:mt-1.5 px-8 sm:px-14 py-1">
              {/* Soft Blush Watercolor Brushstroke Accent Behind "Date" */}
              <svg
                viewBox="0 0 420 90"
                className="absolute inset-0 w-full h-full -z-10 text-blush/65 drop-shadow-sm"
                preserveAspectRatio="none"
              >
                <path
                  d="M16,44 C52,14 140,10 215,13 C295,16 375,12 405,38 C418,50 406,76 374,80 C280,86 130,84 32,78 C8,75 -2,56 16,44 Z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-script text-7xl sm:text-8xl md:text-9xl leading-none text-rust drop-shadow-sm select-none">
                Date
              </span>
            </div>
          </div>

          {/* Date & Time Callout */}
          <div className="mt-6 sm:mt-8 space-y-1">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.14em] text-espresso uppercase">
              {schedule.dayOfWeek}, {schedule.dateFormatted}
            </h2>
            <p className="font-script text-3xl sm:text-5xl text-terracotta">
              {schedule.timeFormatted}
            </p>
          </div>
        </motion.div>

        {/* Live Countdown Clock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="max-w-2xl mx-auto my-8 bg-alabaster/85 backdrop-blur-sm border border-blush/70 rounded-2xl p-5 sm:p-7 shadow-card"
        >
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-rust font-semibold mb-4">
            <Clock className="w-3.5 h-3.5 text-blush-deep" />
            <span>Counting Down To Forever</span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="bg-sand-light/90 border border-champagne/30 rounded-xl py-3.5 sm:py-4 px-1 sm:px-2 flex flex-col items-center justify-center overflow-hidden"
              >
                <div
                  style={{ fontVariantNumeric: 'lining-nums tabular-nums' }}
                  className="font-serif text-2xl sm:text-5xl font-bold text-espresso leading-none tracking-normal"
                >
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[9px] sm:text-xs uppercase tracking-[0.06em] sm:tracking-[0.2em] text-espresso/70 font-medium mt-2 leading-tight">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* 1-Click Add to Calendar Action */}
          <div className="mt-6 flex items-center justify-center">
            <a
              href={getGoogleCalendarUrl()}
              onClick={openGoogleCalendarApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#3E523B] hover:bg-[#2B3B29] text-alabaster border border-blush/40 text-[10px] sm:text-xs font-semibold tracking-[0.12em] sm:tracking-[0.16em] uppercase px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              <CalendarPlus className="w-3.5 h-3.5 shrink-0 text-blush" />
              <span>Add to Google Calendar</span>
            </a>
          </div>
        </motion.div>

        {/* 3-Photo Boho Arch Triptych (1 Large Featured Arch on Top + 2 Larger Arches Below on Mobile, 3-Column Arch Gallery on Desktop) */}
        <div className="mt-10 sm:mt-14 pb-12 sm:pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8 items-center max-w-sm sm:max-w-none mx-auto px-1 sm:px-0">
            {photos.saveTheDateTriptych.map((photo, index) => {
              const isFeaturedCenter = index === 1;
              const mobileLayoutClass = isFeaturedCenter
                ? 'order-1 sm:order-2 col-span-2 sm:col-span-1 w-full max-w-[265px] sm:max-w-none mx-auto mb-1 sm:mb-0 p-2.5 pb-3.5 sm:p-3.5 md:-translate-y-6'
                : index === 0
                ? 'order-2 sm:order-1 col-span-1 -rotate-2 sm:rotate-0 p-2 pb-2.5 sm:p-3.5'
                : 'order-3 sm:order-3 col-span-1 rotate-2 sm:rotate-0 p-2 pb-2.5 sm:p-3.5';

              return (
                <motion.div
                  key={`${photo.caption}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, duration: 0.65 }}
                  className={`group relative bg-alabaster shadow-polaroid border border-blush/60 boho-arch transition-all duration-300 flex flex-col justify-between ${mobileLayoutClass}`}
                >
                  <div
                    className={`overflow-hidden boho-arch bg-sand ${
                      isFeaturedCenter
                        ? 'aspect-[3/3.85] sm:aspect-[3/4.2]'
                        : 'aspect-[3/3.95] sm:aspect-[3/4.2]'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={`${couple.displayTitle} portrait ${index + 1}`}
                      className="w-full h-full object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {/* Script Caption Inside Each Card (Mobile & Desktop) */}
                  <p
                    className={`font-script text-center text-rust mt-2 sm:mt-3 px-1 flex items-center justify-center ${
                      isFeaturedCenter
                        ? 'text-2xl sm:text-2xl md:text-3xl leading-snug'
                        : 'text-lg sm:text-2xl md:text-3xl leading-tight sm:leading-snug min-h-[36px] sm:min-h-0'
                    }`}
                  >
                    {photo.caption}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rich Dark Sage Green & Blush Pink Scripture Band Divider into Location Guide */}
      <div className="bg-gradient-to-r from-[#2B3B29] via-[#3E523B] to-[#2B3B29] py-3.5 border-y border-blush/40 shadow-inner">
        <p className="text-center font-serif italic text-sm sm:text-base text-[#FAFBF9] tracking-wider px-4">
          {couple.storyQuote}
        </p>
      </div>
      <TornPaperDivider fill="#FAFBF9" />
    </section>
  );
};
