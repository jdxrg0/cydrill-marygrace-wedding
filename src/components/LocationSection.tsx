import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Compass } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { openGoogleMapsApp } from '../utils/calendar';
import { BohoSunDivider } from './Dividers';

export const LocationSection: React.FC = () => {
  const { location } = weddingConfig;

  return (
    <section
      id="location"
      className="relative bg-alabaster paper-grain py-14 sm:py-24 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Heading ("LOCATION GUIDE" + "Ceremony and Sunset Reception will be held at:") */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-4xl sm:text-6xl uppercase tracking-[0.18em] text-terracotta font-semibold">
            {location.sectionTitle}
          </h2>
          <BohoSunDivider />
          <p className="text-sm sm:text-xl text-espresso/80 font-medium">
            {location.subtitle}
          </p>
        </motion.div>

        {/* MOBILE & TABLET (< lg): Unified Editorial Venue Card with Venue Name First + Side-by-Side Twin Venue Arches */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:hidden mt-7 max-w-md mx-auto bg-sand-light/85 border border-champagne/60 rounded-3xl p-4 sm:p-6 shadow-card"
        >
          {/* 1. Venue Name & Address Banner (Directly answers "will be held at:") */}
          <a
            href={location.googleMapsUrl}
            onClick={openGoogleMapsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-5 px-4 rounded-2xl bg-gradient-to-r from-rust via-terracotta to-sage-dark text-alabaster text-center shadow-md border border-blush/50 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center justify-center gap-1.5 text-blush-light text-[10px] uppercase tracking-[0.25em] mb-1">
              <MapPin className="w-3.5 h-3.5 text-blush" />
              <span>Venue Pin</span>
            </div>
            <h3 className="font-serif text-2xl font-bold tracking-widest uppercase leading-snug">
              {location.venueName}
            </h3>
            <p className="text-xs text-sand-light/95 mt-1 font-medium">
              {location.addressLine1}
            </p>
            <p className="text-[11px] text-sand-light/80 mt-0.5">
              {location.addressLine2}
            </p>
          </a>

          {/* 2. Single Centered Boho Arch Venue Photo */}
          <div className="mt-4 max-w-[270px] mx-auto">
            <div className="bg-alabaster p-2.5 rounded-t-full rounded-b-xl border border-champagne/50 shadow-sm">
              <div className="overflow-hidden rounded-t-full rounded-b-lg aspect-[3/3.6]">
                <img
                  src={location.venuePhoto}
                  alt={`${location.venueName} — Shaira's Hall`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-[10px] uppercase tracking-[0.14em] text-rust font-semibold mt-2.5 truncate">
                Ceremony &amp; Reception • Shaira&apos;s Hall
              </p>
            </div>
          </div>

          {/* 3. Open in Google Maps Button */}
          <div className="mt-4">
            <a
              href={location.googleMapsUrl}
              onClick={openGoogleMapsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-rust text-alabaster font-serif text-base uppercase tracking-[0.16em] py-3 px-5 rounded-full shadow-md transition-all active:scale-95"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* 4. Travel / Parking Tip */}
          <div className="mt-3.5 flex items-start gap-2 text-xs text-espresso/75 bg-alabaster border border-champagne/40 rounded-xl px-3.5 py-2.5">
            <Compass className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
            <span>{location.travelNote}</span>
          </div>
        </motion.div>

        {/* DESKTOP (lg+): Balanced 2-Column Layout (Arched Venue Photo | Venue Banner + CTA) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-10 items-center mt-14 max-w-4xl mx-auto">
          {/* Single Arched Venue Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="w-full max-w-xs bg-sand-light p-3.5 shadow-polaroid border border-champagne/50 boho-arch -rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="overflow-hidden boho-arch aspect-[3/3.8]">
                <img
                  src={location.venuePhoto}
                  alt={`${location.venueName} — Shaira's Hall`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-center text-xs uppercase tracking-[0.18em] text-rust font-semibold mt-3">
                Ceremony &amp; Reception • Shaira&apos;s Hall
              </p>
            </div>
          </motion.div>

          {/* Right Column: Clickable Ribbon Banner + Open in Google Maps CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="lg:col-span-7 flex flex-col items-center text-center"
          >
            <a
              href={location.googleMapsUrl}
              onClick={openGoogleMapsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full max-w-md py-6 px-6 rounded-2xl bg-gradient-to-r from-rust via-terracotta to-sage-dark text-alabaster shadow-card border border-blush/50 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center justify-center gap-2 text-blush-light text-xs uppercase tracking-[0.25em] mb-1">
                <MapPin className="w-4 h-4 text-blush" />
                <span>Venue Pin</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest uppercase">
                {location.venueName}
              </h3>
              <p className="text-xs sm:text-sm text-sand-light/95 mt-1 font-medium">
                {location.addressLine1}
              </p>
              <p className="text-xs text-sand-light/80">{location.addressLine2}</p>
            </a>

            <div className="mt-6 flex flex-wrap items-center justify-center">
              <a
                href={location.googleMapsUrl}
                onClick={openGoogleMapsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-rust text-alabaster font-serif text-lg uppercase tracking-[0.15em] px-6 py-2.5 rounded-full shadow-md transition-all hover:-translate-y-0.5"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-5 flex items-start gap-2 text-xs text-espresso/70 bg-sand-light/70 border border-champagne/30 rounded-xl px-4 py-3 max-w-md text-left">
              <Compass className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <span>{location.travelNote}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
