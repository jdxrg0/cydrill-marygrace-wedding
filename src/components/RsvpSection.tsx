import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Heart,
  Users,
  Music,
  Sparkles,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingConfig, GuestWish } from '../config/weddingConfig';
import { BohoSunDivider, TornPaperDivider } from './Dividers';

const STORAGE_KEY = 'ate_grace_cydrill_wedding_wishes_live_v3';
const WISHES_PER_PAGE = 6;

function formatRelativeDate(dateInput?: string): string {
  if (!dateInput) return 'Recently';
  if (
    dateInput === 'Just now' ||
    dateInput.includes('ago') ||
    dateInput.includes('Recently')
  ) {
    return dateInput;
  }
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return dateInput;

  const diffSeconds = Math.floor((Date.now() - parsed.getTime()) / 1000);
  if (diffSeconds < 60) return 'Just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const RsvpSection: React.FC = () => {
  const { initialWishes, couple, rsvp } = weddingConfig;
  const sheetUrl = rsvp.googleSheetWebAppUrl.trim();

  const [wishes, setWishes] = useState<GuestWish[]>(() => {
    try {
      localStorage.removeItem('ate_grace_cydrill_wedding_wishes_v2');
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingWall, setIsLoadingWall] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Save to localStorage cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishes]);

  // Fetch live wishes from Google Sheets Web App when configured
  const fetchSheetWishes = useCallback(async () => {
    if (!sheetUrl) return;
    setIsLoadingWall(true);
    try {
      const res = await fetch(`${sheetUrl}?t=${Date.now()}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Failed to fetch guestbook');
      const data = await res.json();
      if (Array.isArray(data.wishes)) {
        const remoteWishes: GuestWish[] = data.wishes.map(
          (row: Record<string, unknown>, index: number) => ({
            id: String(row.id || `sheet-${index}`),
            name: String(row.name || 'Wedding Guest'),
            relationship: String(row.relationship || 'Loved One & Guest'),
            message: String(row.message || ''),
            attendance: row.attendance === 'regrets' ? 'regrets' : 'attending',
            guestsCount: Number(row.guestsCount ?? 1),
            songRequest: row.songRequest ? String(row.songRequest) : undefined,
            createdAt: formatRelativeDate(String(row.createdAt || '')),
          })
        );
        // Show only the real wishes from Google Sheets
        setWishes(remoteWishes);
      }
    } catch {
      // Keep cached wishes if offline
    } finally {
      setIsLoadingWall(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    fetchSheetWishes();
  }, [fetchSheetWishes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const cleanName = name.trim();
    const cleanRelationship = relationship.trim() || 'Loved One & Guest';
    const cleanSong = songRequest.trim();
    const cleanMessage =
      message.trim() ||
      `So excited to celebrate with you, ${couple.displayTitle}!`;

    const newWish: GuestWish = {
      id: `wish-${Date.now()}`,
      name: cleanName,
      relationship: cleanRelationship,
      message: cleanMessage,
      attendance,
      guestsCount: attendance === 'attending' ? guestsCount : 0,
      songRequest: cleanSong || undefined,
      createdAt: 'Just now',
    };

    try {
      if (sheetUrl) {
        // Use text/plain to avoid CORS preflight OPTIONS failure on Google Apps Script
        const response = await fetch(sheetUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            name: newWish.name,
            relationship: newWish.relationship,
            attendance: newWish.attendance,
            guestsCount: newWish.guestsCount,
            songRequest: cleanSong,
            message: newWish.message,
          }),
        });

        if (!response.ok) {
          throw new Error('Could not reach Google Sheets');
        }
      }

      setWishes((prev) => [newWish, ...prev]);
      setCurrentPage(1);
      setSubmitted(true);

      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6B8467', '#465943', '#E8C5C8', '#D49499', '#C8A97E'],
      });

      setName('');
      setRelationship('');
      setSongRequest('');
      setMessage('');
    } catch {
      // Still save locally so the guest never loses their message
      setWishes((prev) => [newWish, ...prev]);
      setCurrentPage(1);
      setSubmitted(true);
      setSubmitError(
        'Saved to your device! (Google Sheet connection encountered a temporary hiccup.)'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(wishes.length / WISHES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedWishes = wishes.slice(
    (safePage - 1) * WISHES_PER_PAGE,
    safePage * WISHES_PER_PAGE
  );

  return (
    <section
      id="rsvp"
      className="relative bg-sand paper-grain pt-8 sm:pt-10 pb-0 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-rust font-semibold">
            Répondez S'il Vous Plaît
          </span>
          <h2 className="font-script text-5xl sm:text-7xl text-rust mt-1">
            RSVP & Well Wishes
          </h2>
          <BohoSunDivider />
          <p className="text-xs sm:text-base text-espresso/80 px-2">
            Let us know if you can make it and leave a note in our digital keepsake guestbook for{' '}
            <span className="font-semibold text-rust">{couple.displayTitle}</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Interactive RSVP Form */}
          <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              layout: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
            }}
            className="lg:col-span-5 bg-alabaster rounded-3xl p-5 sm:p-8 border border-champagne/60 shadow-card overflow-hidden"
          >
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-espresso uppercase tracking-wider mb-0.5">
              Confirm Attendance
            </h3>
            <p className="text-xs text-espresso/65 mb-5 sm:mb-6">
              {rsvp.deadlineText}
            </p>

            <AnimatePresence mode="wait" initial={false}>
              {submitted ? (
                <motion.div
                  key="rsvp-thank-you"
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="py-6 sm:py-8 text-center space-y-4"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-terracotta/15 text-terracotta flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
                  </div>
                  <h4 className="font-serif text-2xl sm:text-3xl font-bold text-rust">
                    Thank You!
                  </h4>
                  <p className="text-xs sm:text-sm text-espresso/80 max-w-xs mx-auto">
                    Your RSVP and message have been recorded and pinned to{' '}
                    {couple.displayTitle}&apos;s guestbook wall.
                  </p>
                  {submitError && (
                    <p className="text-[11px] text-rust/80 max-w-xs mx-auto">
                      {submitError}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-xs uppercase tracking-widest font-semibold text-terracotta hover:text-rust underline transition-colors"
                  >
                    Send another response
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="rsvp-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  onSubmit={handleSubmit}
                  className="space-y-3.5 sm:space-y-4"
                >
                  <div>
                    <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maria Clara Santos"
                      className="w-full rounded-xl bg-sand-light/70 border border-champagne/60 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-terracotta transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                      Role / Relationship to Couple
                    </label>
                    <input
                      type="text"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. College Friend, Cousin, Ninang"
                      className="w-full rounded-xl bg-sand-light/70 border border-champagne/60 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-terracotta transition-colors"
                    />
                  </div>

                  {/* Smooth Sliding Segmented Toggle for Attendance */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setAttendance('attending')}
                      className={`relative overflow-hidden py-2.5 px-2.5 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider border transition-colors duration-300 ${
                        attendance === 'attending'
                          ? 'text-alabaster border-terracotta shadow-sm'
                          : 'bg-sand-light/60 text-espresso/75 border-champagne/50 hover:bg-sand-light'
                      }`}
                    >
                      {attendance === 'attending' && (
                        <motion.span
                          layoutId="rsvpAttendancePill"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute inset-0 bg-terracotta rounded-xl"
                        />
                      )}
                      <span className="relative z-10">Joyfully Attending</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttendance('regrets')}
                      className={`relative overflow-hidden py-2.5 px-2.5 rounded-xl text-[11px] sm:text-xs font-semibold uppercase tracking-wider border transition-colors duration-300 ${
                        attendance === 'regrets'
                          ? 'text-alabaster border-rust shadow-sm'
                          : 'bg-sand-light/60 text-espresso/75 border-champagne/50 hover:bg-sand-light'
                      }`}
                    >
                      {attendance === 'regrets' && (
                        <motion.span
                          layoutId="rsvpAttendancePill"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute inset-0 bg-rust rounded-xl"
                        />
                      )}
                      <span className="relative z-10">Sending Regrets</span>
                    </button>
                  </div>

                  {/* Smooth Expand / Collapse Drawer for Seats & Song Request */}
                  <AnimatePresence initial={false}>
                    {attendance === 'attending' && (
                      <motion.div
                        key="attending-extra-fields"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.26, ease: 'easeOut' },
                        }}
                        className="overflow-hidden !mt-0"
                      >
                        <div className="pt-3.5 sm:pt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                          <div>
                            <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                              <Users className="w-3.5 h-3.5 inline mr-1 text-terracotta" />
                              Seats
                            </label>
                            <select
                              value={guestsCount}
                              onChange={(e) => setGuestsCount(Number(e.target.value))}
                              className="w-full rounded-xl bg-sand-light/70 border border-champagne/60 px-3 py-2.5 text-sm text-espresso focus:outline-none focus:border-terracotta transition-colors"
                            >
                              {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n} value={n}>
                                  {n} {n === 1 ? 'Guest' : 'Guests'}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                              <Music className="w-3.5 h-3.5 inline mr-1 text-terracotta" />
                              Song Request
                            </label>
                            <input
                              type="text"
                              value={songRequest}
                              onChange={(e) => setSongRequest(e.target.value)}
                              placeholder="Dance track"
                              className="w-full rounded-xl bg-sand-light/70 border border-champagne/60 px-3 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-terracotta transition-colors"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label className="block text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-espresso/80 mb-1">
                      Well Wishes for {couple.displayTitle}
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write a heartfelt note or marriage advice for the couple..."
                      className="w-full rounded-xl bg-sand-light/70 border border-champagne/60 px-3.5 py-2.5 text-sm text-espresso placeholder:text-espresso/40 focus:outline-none focus:border-terracotta transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-rust disabled:opacity-60 text-alabaster font-serif text-base sm:text-lg uppercase tracking-[0.18em] py-3 rounded-full shadow-md transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving RSVP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit RSVP & Wish</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Digital Guestbook & Well-Wishes Wall (Paginated — never clips or cuts cards) */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between px-1 sm:px-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta" />
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-espresso uppercase tracking-wider">
                  Guestbook Wall ({wishes.length})
                </h3>
              </div>

              <div className="flex items-center gap-2.5">
                {sheetUrl && (
                  <button
                    type="button"
                    onClick={fetchSheetWishes}
                    disabled={isLoadingWall}
                    title="Refresh live wishes"
                    className="inline-flex items-center gap-1 text-[11px] text-rust hover:text-terracotta font-semibold bg-alabaster/80 border border-champagne/60 px-2.5 py-1 rounded-full transition-colors"
                  >
                    <RefreshCw
                      className={`w-3 h-3 ${isLoadingWall ? 'animate-spin' : ''}`}
                    />
                    <span>Sync</span>
                  </button>
                )}
                <span className="hidden sm:inline text-xs text-rust font-medium">
                  {sheetUrl ? 'Live Google Sheet Sync' : 'Live Keepsake Notes'}
                </span>
              </div>
            </div>

            {wishes.length === 0 ? (
              <div className="bg-alabaster/90 rounded-3xl p-8 sm:p-12 border border-champagne/60 shadow-sm text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-blush/35 text-blush-deep flex items-center justify-center mx-auto border border-blush-rose/30">
                  <Heart className="w-5 h-5 fill-blush-rose/40 text-blush-deep" />
                </div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-espresso">
                  {isLoadingWall
                    ? 'Loading Guestbook Notes...'
                    : `Be the First to Leave a Wish for ${couple.displayTitle}!`}
                </h4>
                <p className="text-xs sm:text-sm text-espresso/75 max-w-md mx-auto leading-relaxed">
                  {isLoadingWall
                    ? 'Syncing live keepsake messages from the wedding guestbook...'
                    : 'Confirm your attendance using the form and write a heartfelt message—your note will be pinned right here on their keepsake wall.'}
                </p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`page-${safePage}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                  >
                    {paginatedWishes.map((wish, idx) => (
                      <motion.div
                        key={wish.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.28 }}
                        className="bg-alabaster/95 rounded-2xl p-4 sm:p-5 border border-champagne/50 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-serif text-base sm:text-lg font-bold text-espresso">
                                {wish.name}
                              </h4>
                              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-terracotta font-semibold">
                                {wish.relationship}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-semibold shrink-0 ${
                                wish.attendance === 'attending'
                                  ? 'bg-sage/20 text-sage-dark'
                                  : 'bg-sand text-espresso/60'
                              }`}
                            >
                              {wish.attendance === 'attending'
                                ? `Attending (${wish.guestsCount})`
                                : 'Warm Wishes'}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-espresso/85 mt-2.5 sm:mt-3 leading-relaxed italic">
                            “{wish.message}”
                          </p>

                          {wish.songRequest && (
                            <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-rust bg-blush-light/80 border border-blush-rose/30 px-2.5 py-0.5 rounded-full">
                              <Music className="w-2.5 h-2.5 text-blush-deep" />
                              <span>Song: {wish.songRequest}</span>
                            </p>
                          )}
                        </div>

                        <div className="mt-3 sm:mt-4 pt-2 border-t border-sand flex items-center justify-between text-[11px] text-espresso/50">
                          <span>{wish.createdAt}</span>
                          <Heart className="w-3.5 h-3.5 text-blush-rose fill-blush/60" />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Clean Page Navigation Bar (Only shown when there are more than 6 wishes) */}
                {totalPages > 1 && (
                  <div className="pt-2 flex items-center justify-between bg-alabaster/80 rounded-2xl px-4 py-2.5 border border-champagne/50 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-rust hover:text-terracotta disabled:opacity-35 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Newer</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative w-7 h-7 rounded-full text-xs font-serif font-bold transition-colors ${
                              safePage === pageNum
                                ? 'text-alabaster'
                                : 'bg-sand/70 text-espresso/70 hover:bg-champagne/50'
                            }`}
                          >
                            {safePage === pageNum && (
                              <motion.span
                                layoutId="guestbookPagePill"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                className="absolute inset-0 bg-terracotta rounded-full shadow-sm"
                              />
                            )}
                            <span className="relative z-10">{pageNum}</span>
                          </button>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={safePage === totalPages}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-rust hover:text-terracotta disabled:opacity-35 disabled:pointer-events-none transition-colors"
                    >
                      <span>Older</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <TornPaperDivider fill="#FAFBF9" />
    </section>
  );
};
