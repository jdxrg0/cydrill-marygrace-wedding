import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Sparkles } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { BotanicalSprig, BohoSunDivider, TornPaperDivider } from './Dividers';

export const EntourageSection: React.FC = () => {
  const { couple, entourage, photos } = weddingConfig;

  return (
    <section
      id="entourage"
      className="relative bg-sand paper-grain pt-6 sm:pt-8 pb-0 overflow-hidden"
    >
      {/* Decorative Botanicals (Desktop outer margins only) */}
      <BotanicalSprig
        className="hidden lg:block absolute top-96 -left-10 w-64 h-64 rotate-45 opacity-30 pointer-events-none"
        color="#465943"
      />
      <BotanicalSprig
        className="hidden lg:block absolute bottom-64 -right-10 w-64 h-64 -rotate-135 opacity-30 pointer-events-none"
        color="#6B8467"
      />

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 relative z-10 pb-14 sm:pb-24">
        {/* Top Framed Couple Banner Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-card border-2 border-blush/60 aspect-[16/9] sm:aspect-[16/7] mb-7 sm:mb-14"
        >
          <img
            src={photos.entourageBanner}
            alt={`${couple.nuptialTitle} Nuptials`}
            className="w-full h-full object-cover object-[50%_25%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B3B29]/90 via-[#3E523B]/35 to-transparent flex flex-col items-center justify-end p-5 sm:p-10 text-center">
            <h2 className="font-script text-4xl sm:text-7xl text-sand-light drop-shadow-md leading-none">
              {couple.nuptialTitle}
            </h2>
            <p className="font-serif text-sm sm:text-2xl tracking-[0.35em] text-blush uppercase font-semibold mt-1">
              NUPTIALS
            </p>
          </div>
        </motion.div>

        {/* PARENTS (and optional Grandparents if configured) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-10">
          {/* Groom's Family Card (First) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-alabaster rounded-2xl p-5 sm:p-8 border border-champagne/50 shadow-card text-center flex flex-col justify-center space-y-4 sm:space-y-6"
          >
            {entourage.groomGrandparents.length > 0 && (
              <div className="pb-3.5 border-b border-sand-dark/40">
                <h3 className="font-sans text-[11px] sm:text-sm font-bold tracking-[0.2em] text-rust uppercase mb-2.5">
                  Grandparents of the Groom
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-espresso">
                  {entourage.groomGrandparents.map((gp) => (
                    <div key={gp.name}>
                      <p className="font-semibold tracking-wide">{gp.name}</p>
                      <p className="text-[11px] sm:text-xs text-espresso/65 italic">({gp.place})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-sans text-[11px] sm:text-sm font-bold tracking-[0.2em] text-rust uppercase mb-2.5">
                Parents of the Groom
              </h3>
              <div className="space-y-1.5 text-xs sm:text-base font-semibold text-espresso">
                {entourage.groomParents.map((parent) => (
                  <p key={parent}>{parent}</p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bride's Family Card (Second) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-alabaster rounded-2xl p-5 sm:p-8 border border-champagne/50 shadow-card text-center flex flex-col justify-center space-y-4 sm:space-y-6"
          >
            {entourage.brideGrandparents.length > 0 && (
              <div className="pb-3.5 border-b border-sand-dark/40">
                <h3 className="font-sans text-[11px] sm:text-sm font-bold tracking-[0.2em] text-rust uppercase mb-2.5">
                  Grandparents of the Bride
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-espresso">
                  {entourage.brideGrandparents.map((gp) => (
                    <div key={gp.name}>
                      <p className="font-semibold tracking-wide">{gp.name}</p>
                      <p className="text-[11px] sm:text-xs text-espresso/65 italic">({gp.place})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-sans text-[11px] sm:text-sm font-bold tracking-[0.2em] text-rust uppercase mb-2.5">
                Parents of the Bride
              </h3>
              <div className="space-y-1.5 text-xs sm:text-base font-semibold text-espresso">
                {entourage.brideParents.map((parent) => (
                  <p key={parent}>{parent}</p>
                ))}
              </div>
              {entourage.brideParentsPlace && (
                <p className="text-[11px] sm:text-xs text-espresso/65 italic mt-1">
                  ({entourage.brideParentsPlace})
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* PRINCIPAL SPONSORS (Side-by-Side 2-Column Paired Roll on Both Mobile & Desktop!) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 sm:mt-14 bg-alabaster rounded-3xl p-4 sm:p-10 border border-champagne/50 shadow-card text-center"
        >
          <h3 className="font-script text-4xl sm:text-6xl text-rust">
            Principal Sponsors
          </h3>
          <p className="text-[10px] sm:text-sm tracking-[0.22em] uppercase text-terracotta font-semibold mt-0.5">
            {entourage.principalSponsorsSubtitle}
          </p>
          <BohoSunDivider className="my-2.5 sm:my-4" />

          {/* Paired Ninong & Ninang Rows */}
          <div className="mt-3 sm:mt-6 divide-y divide-sand/70">
            {entourage.principalSponsors.map((pair, idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 gap-2.5 sm:gap-8 py-2 sm:py-2.5 items-center text-[11px] sm:text-sm text-espresso font-medium"
              >
                <div
                  className={`text-right pr-1.5 sm:pr-2 ${
                    pair.ninong && pair.ninang ? 'border-r border-champagne/35' : ''
                  } leading-snug`}
                >
                  {pair.ninong}
                </div>
                <div className="text-left pl-1.5 sm:pl-2 leading-snug">
                  {pair.ninang}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* SECONDARY SPONSORS */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 sm:mt-12 bg-alabaster rounded-3xl p-4 sm:p-10 border border-champagne/50 shadow-card text-center"
        >
          <h3 className="font-script text-4xl sm:text-6xl text-rust">
            Secondary Sponsors
          </h3>
          <p className="text-[10px] sm:text-sm tracking-[0.22em] uppercase text-terracotta font-semibold mt-0.5">
            {entourage.secondarySponsorsSubtitle}
          </p>
          <BohoSunDivider className="my-2.5 sm:my-4" />

          {/* Best Man & Matrons of Honor (Side-by-Side 2 Columns on Mobile & Desktop) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 mt-4 sm:mt-6">
            <div className="bg-sand-light/85 rounded-2xl p-3.5 sm:p-5 border border-champagne/45 flex flex-col justify-center">
              <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-rust uppercase">
                Best Man
              </h4>
              <p className="text-xs sm:text-base font-semibold text-espresso mt-1.5 leading-snug">
                {entourage.bestMan}
              </p>
            </div>
            <div className="bg-sand-light/85 rounded-2xl p-3.5 sm:p-5 border border-champagne/45 flex flex-col justify-center">
              <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-rust uppercase">
                Matrons of Honor
              </h4>
              <div className="mt-1.5 space-y-1 text-xs sm:text-base font-semibold text-espresso leading-snug">
                {entourage.matronsOfHonor.map((moh) => (
                  <p key={moh}>{moh}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Candle, Veil, Cord */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 mt-3 sm:mt-6">
            {[entourage.candle, entourage.veil, entourage.cord].map((group) => (
              <div
                key={group.title}
                className="bg-sand-light/65 rounded-2xl p-3.5 sm:p-5 border border-champagne/35"
              >
                <div className="flex items-baseline justify-center gap-2 md:block">
                  <h4 className="text-xs sm:text-sm font-bold tracking-[0.2em] text-rust uppercase">
                    {group.title}
                  </h4>
                  <p className="font-script text-xl sm:text-2xl text-terracotta md:-mt-0.5 mb-1.5">
                    {group.subtitle}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2 text-[11px] sm:text-sm font-medium text-espresso">
                  {group.members.map((m) => (
                    <p key={m} className="leading-snug">
                      {m}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Groomsmen & Bridesmaids (Side-by-Side 2 Columns on Mobile & Desktop) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-6 mt-3 sm:mt-6">
            <div className="bg-sand-light/65 rounded-2xl p-3.5 sm:p-5 border border-champagne/35">
              <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-rust uppercase mb-2">
                Groomsmen
              </h4>
              <div className="space-y-1.5 text-[11px] sm:text-sm font-medium text-espresso leading-snug">
                {entourage.groomsmen.map((gm) => (
                  <p key={gm}>{gm}</p>
                ))}
              </div>
            </div>
            <div className="bg-sand-light/65 rounded-2xl p-3.5 sm:p-5 border border-champagne/35">
              <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-rust uppercase mb-2">
                Bridesmaids
              </h4>
              <div className="space-y-1.5 text-[11px] sm:text-sm font-medium text-espresso leading-snug">
                {entourage.bridesmaids.map((bm) => (
                  <p key={bm}>{bm}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Bearers (Ring, Coin, Bible — 3-Column Row on Mobile & Desktop!) */}
          <div className="mt-7 sm:mt-10">
            <h3 className="font-script text-3xl sm:text-5xl text-rust mb-3 sm:mb-5">
              Bearers
            </h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              {[
                entourage.bearers.ring,
                entourage.bearers.coin,
                entourage.bearers.bible,
              ].map((bearer) => (
                <div
                  key={bearer.title}
                  className="bg-sand-light/65 rounded-2xl p-2.5 sm:p-5 border border-champagne/35 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-bold tracking-[0.18em] text-rust uppercase">
                      {bearer.title}
                    </h4>
                    <p className="font-script text-base sm:text-2xl text-terracotta leading-tight mb-1 sm:mb-1.5">
                      {bearer.subtitle}
                    </p>
                  </div>
                  <p className="text-[11px] sm:text-sm font-semibold text-espresso leading-snug">
                    {bearer.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Flower Girls (& Optional Pet of Honor if configured) */}
          <div
            className={`mt-4 sm:mt-8 ${
              entourage.petOfHonor
                ? 'grid grid-cols-2 gap-2.5 sm:gap-6'
                : 'max-w-lg mx-auto'
            }`}
          >
            <div className="bg-sand-light/75 rounded-2xl p-4 sm:p-6 border border-champagne/40 flex flex-col justify-center">
              <h4 className="font-script text-3xl sm:text-4xl text-rust leading-tight">
                {entourage.flowerGirls.title}
              </h4>
              <p className="font-script text-lg sm:text-2xl text-terracotta mb-2 leading-tight">
                {entourage.flowerGirls.subtitle}
              </p>
              <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-espresso leading-snug">
                {entourage.flowerGirls.members.map((fg) => (
                  <p key={fg}>{fg}</p>
                ))}
              </div>
            </div>

            {entourage.petOfHonor && (
              <div className="bg-gradient-to-br from-blush-light/85 via-sand-light to-terracotta/15 rounded-2xl p-3.5 sm:p-6 border border-blush-rose/45 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-blush-rose text-alabaster flex items-center justify-center shadow-md mb-1.5 sm:mb-2">
                  <PawPrint className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <h4 className="font-script text-2xl sm:text-4xl text-rust leading-tight">
                  {entourage.petOfHonor.role}
                </h4>
                <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-blush-deep shrink-0" />
                  <span className="font-serif text-lg sm:text-3xl font-bold tracking-[0.16em] text-espresso uppercase">
                    {entourage.petOfHonor.name}
                  </span>
                  <PawPrint className="w-3.5 h-3.5 text-terracotta shrink-0" />
                </div>
                <p className="text-[10px] sm:text-xs text-espresso/75 mt-1 italic leading-snug">
                  {entourage.petOfHonor.breedOrNote}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <TornPaperDivider fill="#FAFBF9" />
    </section>
  );
};
