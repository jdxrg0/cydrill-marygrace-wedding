import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, PhoneOff, Hash, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingConfig } from '../config/weddingConfig';

export const RemindersSection: React.FC = () => {
  const { reminders, couple } = weddingConfig;
  const [copiedHashtag, setCopiedHashtag] = useState(false);

  const handleCopyHashtag = () => {
    navigator.clipboard.writeText(couple.hashtag);
    setCopiedHashtag(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#6B8467', '#465943', '#E8C5C8', '#D49499', '#C8A97E'],
    });
    setTimeout(() => setCopiedHashtag(false), 2600);
  };

  return (
    <section className="relative bg-sand-light paper-grain py-12 sm:py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs uppercase tracking-[0.35em] text-rust font-semibold">
            Kindly Note
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-espresso font-bold mt-1 uppercase tracking-wider">
            Wedding Reminders
          </h2>
        </div>

        {/* 3 Boho Arch Cards (Compact inline header on mobile, 12-col split on desktop) */}
        <div className="space-y-4 sm:space-y-6">
          {/* 1. GIFT NOTE */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              layout: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
            }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 items-center bg-alabaster rounded-3xl p-4 sm:p-8 border border-champagne/50 shadow-card"
          >
            <div className="md:col-span-3 flex flex-row md:flex-col items-center justify-start md:justify-center text-left md:text-center gap-3 md:gap-0 bg-gradient-to-br from-[#3E523B] to-[#2B3B29] rounded-2xl py-3 px-4 md:py-6 border border-blush/45 shadow-sm">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blush-light/15 text-blush border border-blush/50 flex items-center justify-center shrink-0 md:mb-3">
                <Gift className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <h3 className="font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-alabaster">
                {reminders.giftNote.title}
              </h3>
            </div>

            <div className="md:col-span-9 text-left space-y-2 sm:space-y-3 px-1 sm:px-0">
              <p className="font-serif italic text-xs sm:text-base text-espresso/90 leading-relaxed">
                “{reminders.giftNote.message}”
              </p>
              <p className="text-[10.5px] sm:text-xs text-rust font-semibold tracking-wide uppercase">
                ✦ Your presence and prayers are our greatest treasure
              </p>
            </div>
          </motion.div>

          {/* 2. UNPLUGGED CEREMONY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 items-center bg-alabaster rounded-3xl p-4 sm:p-8 border border-champagne/50 shadow-card"
          >
            <div className="md:col-span-3 flex flex-row md:flex-col items-center justify-start md:justify-center text-left md:text-center gap-3 md:gap-0 bg-gradient-to-br from-[#3E523B] to-[#2B3B29] rounded-2xl py-3 px-4 md:py-6 border border-blush/45 shadow-sm">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blush-light/15 text-blush border border-blush/50 flex items-center justify-center shrink-0 md:mb-3">
                <PhoneOff className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <h3 className="font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-alabaster">
                {reminders.unplugged.title}
              </h3>
            </div>

            <div className="md:col-span-9 text-left px-1 sm:px-0">
              <p className="text-xs sm:text-base text-espresso/85 leading-relaxed">
                {reminders.unplugged.message}
              </p>
            </div>
          </motion.div>

          {/* 3. OUR HASHTAG */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-6 items-center bg-alabaster rounded-3xl p-4 sm:p-8 border border-champagne/50 shadow-card"
          >
            <div className="md:col-span-3 flex flex-row md:flex-col items-center justify-start md:justify-center text-left md:text-center gap-3 md:gap-0 bg-gradient-to-br from-[#3E523B] to-[#2B3B29] rounded-2xl py-3 px-4 md:py-6 border border-blush/45 shadow-sm">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blush-light/15 text-blush border border-blush/50 flex items-center justify-center shrink-0 md:mb-3">
                <Hash className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <h3 className="font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-alabaster">
                {reminders.hashtagNote.title}
              </h3>
            </div>

            <div className="md:col-span-9 text-left space-y-3 px-1 sm:px-0">
              <p className="text-xs sm:text-base text-espresso/85 leading-relaxed">
                {reminders.hashtagNote.message}
              </p>
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5 sm:gap-3 bg-sand-light/80 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-champagne/40 sm:border-0">
                <span className="font-serif text-base sm:text-2xl font-bold text-terracotta tracking-wide truncate">
                  {couple.hashtag}
                </span>
                <button
                  type="button"
                  onClick={handleCopyHashtag}
                  className="inline-flex items-center justify-center gap-1.5 bg-terracotta hover:bg-rust text-alabaster text-[11px] sm:text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-full shadow-sm transition-all duration-300 active:scale-95 shrink-0 min-w-[92px]"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedHashtag ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.18 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.18 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
