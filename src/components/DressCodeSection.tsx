import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { weddingConfig, ColorSwatch } from '../config/weddingConfig';
import { BohoSunDivider, TornPaperDivider } from './Dividers';

export const DressCodeSection: React.FC = () => {
  const { dressCode } = weddingConfig;
  const [selectedSwatch, setSelectedSwatch] = useState<ColorSwatch>(dressCode.swatches[0]);

  return (
    <section
      id="dress-code"
      className="relative bg-alabaster paper-grain pt-6 sm:pt-10 pb-0 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 pb-14 sm:pb-24">
        {/* Heading: "THE Dress Code" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="font-serif text-3xl sm:text-6xl uppercase tracking-[0.25em] text-terracotta font-semibold block">
            THE
          </span>
          <h2 className="font-script text-5xl sm:text-8xl text-rust -mt-1.5 sm:-mt-4">
            Dress Code
          </h2>
          <BohoSunDivider className="my-2.5 sm:my-4" />
        </motion.div>

        {/* Official Dress Code & 4-Color Palette Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-6 sm:mt-10 bg-sand-light/85 rounded-3xl p-5 sm:p-10 border border-champagne/50 shadow-card text-center"
        >
          <p className="font-serif text-sm sm:text-2xl uppercase tracking-[0.16em] text-terracotta font-semibold">
            {dressCode.guests.subtitle}
          </p>
          <p className="text-xs sm:text-base text-espresso/80 max-w-xl mx-auto mt-2 leading-relaxed font-serif italic">
            {dressCode.guests.note}
          </p>

          {/* Interactive 4-Swatch Row matching the couple's invitation card */}
          <div className="mt-6 sm:mt-8">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-rust/80 font-semibold mb-4 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blush-deep shrink-0" />
              <span>Tap a swatch to preview attire inspiration</span>
            </p>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-6 max-w-sm sm:max-w-xl mx-auto">
              {dressCode.swatches.map((swatch) => {
                const isSelected = selectedSwatch.hex === swatch.hex;
                const isLightSwatch = swatch.hex.toUpperCase() === '#EACCCE';
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => setSelectedSwatch(swatch)}
                    className={`group relative flex flex-col items-center focus:outline-none transition-transform duration-300 ease-out ${
                      isSelected ? 'scale-105 sm:scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full shadow-md flex items-center justify-center transition-all duration-300 border-2 sm:border-4 ${
                        isSelected
                          ? 'border-espresso ring-2 sm:ring-4 ring-blush-rose/45'
                          : 'border-[#FAFBF9]'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      <AnimatePresence initial={false}>
                        {isSelected && (
                          <motion.span
                            key="check"
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.4, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                          >
                            <Check
                              className={`w-4 h-4 sm:w-6 sm:h-6 drop-shadow ${
                                isLightSwatch ? 'text-espresso' : 'text-white'
                              }`}
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-espresso mt-2 leading-tight text-center">
                      {swatch.name}
                    </span>
                    <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-espresso/60">
                      {swatch.hex}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Swatch Lookbook Card (Clean Horizontal Row on Mobile & Desktop with smooth cross-fade) */}
            <div className="mt-5 sm:mt-8 max-w-xl mx-auto">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedSwatch.hex}
                  initial={{ opacity: 0, y: 8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-alabaster rounded-2xl p-3.5 sm:p-6 border border-blush/60 shadow-sm flex flex-row items-center gap-3.5 sm:gap-5 text-left"
                >
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shrink-0 shadow-inner border border-black/10 transition-colors duration-300"
                    style={{ backgroundColor: selectedSwatch.hex }}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-espresso leading-none">
                        {selectedSwatch.name}
                      </h4>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-blush-light text-rust font-semibold border border-blush/50">
                        {selectedSwatch.role}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-espresso/80 mt-1 leading-snug sm:leading-relaxed">
                      {selectedSwatch.attireTip}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <TornPaperDivider fill="#F2F5F0" />
    </section>
  );
};
