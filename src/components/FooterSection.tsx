import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { BotanicalSprig } from './Dividers';

export const FooterSection: React.FC = () => {
  const { couple, schedule, photos } = weddingConfig;

  return (
    <footer className="relative bg-alabaster paper-grain pt-8 sm:pt-12 overflow-hidden">
      {/* Decorative Side Botanicals (Tucked on outer margins so they never overlap the closing script heading) */}
      <BotanicalSprig
        className="hidden lg:block absolute top-8 -left-14 w-64 h-64 rotate-45 opacity-35 pointer-events-none"
        color="#465943"
      />
      <BotanicalSprig
        className="hidden lg:block absolute top-8 -right-14 w-64 h-64 -rotate-45 opacity-35 pointer-events-none"
        color="#6B8467"
      />

      {/* Closing Script Message + Custom Boho Monogram Crest */}
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 pb-10 sm:pb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-script text-4xl sm:text-7xl text-espresso leading-tight"
        >
          We look forward to
          <br />
          celebrating with you!
        </motion.h2>

        {/* Custom Monogram Medallion (Matching the couple crest in the Canva reference) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 sm:mt-8 inline-flex flex-col items-center justify-center w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-sand-light to-sand border-2 border-blush shadow-card relative"
        >
          <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-terracotta/35 flex flex-col items-center justify-center p-3 sm:p-4">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-rust font-semibold">
              {schedule.shortDate}
            </span>
            <span className="font-serif text-2xl sm:text-4xl font-bold text-espresso tracking-widest my-0.5 sm:my-1">
              {couple.monogram}
            </span>
            <span className="font-script text-xl sm:text-2xl text-terracotta">
              {couple.displayTitle}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Full-Width Closing Couple Portrait Banner (With extra bottom padding on mobile so the floating audio/menu dock never overlaps text) */}
      <div className="relative w-full h-[380px] sm:h-[480px] overflow-hidden">
        <img
          src={photos.footerBanner}
          alt={`${couple.displayTitle} closing portrait`}
          className="w-full h-full object-cover object-[50%_25%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/35 to-transparent flex flex-col items-center justify-end pb-24 sm:pb-10 px-4 text-center">
          <p className="font-serif text-lg sm:text-2xl tracking-[0.25em] uppercase text-sand-light font-semibold">
            {couple.displayTitle}
          </p>
          <p className="text-xs sm:text-sm text-blush tracking-widest mt-1">
            {couple.hashtag}
          </p>
          <p className="text-[11px] text-sand-light/65 mt-3 sm:mt-4 flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-blush-rose fill-blush-rose" />
            <span>for {couple.groomFirstName} and {couple.brideFirstName}&apos;s Wedding</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
