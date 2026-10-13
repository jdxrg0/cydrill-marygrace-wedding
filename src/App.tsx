import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EnvelopeSplash } from './components/EnvelopeSplash';
import { FloatingNav } from './components/FloatingNav';
import { HeroSection } from './components/HeroSection';
import { SaveTheDateSection } from './components/SaveTheDateSection';
import { LocationSection } from './components/LocationSection';
import { TimelineSection } from './components/TimelineSection';
import { EntourageSection } from './components/EntourageSection';
import { DressCodeSection } from './components/DressCodeSection';
import { RemindersSection } from './components/RemindersSection';
import { GallerySection } from './components/GallerySection';
import { RsvpSection } from './components/RsvpSection';
import { FooterSection } from './components/FooterSection';
import { MinimalInvitationView } from './components/minimal/MinimalInvitationView';
import { soundManager } from './utils/sound';

/**
 * Determines whether the visitor is viewing the second "Fine-Art Stationery (Less Pictures)" design
 * via either a clean URL route (/minimal, /stationery, /v2) or query param (?v=2, ?design=minimal).
 */
function checkIsMinimalDesign(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const designParam = (params.get('design') || params.get('version') || params.get('v') || '').toLowerCase();

  if (
    path.endsWith('/minimal') ||
    path.endsWith('/stationery') ||
    path.endsWith('/stationary') ||
    path.endsWith('/v2') ||
    path.endsWith('/design-2')
  ) {
    return true;
  }

  if (
    designParam === 'minimal' ||
    designParam === 'stationery' ||
    designParam === 'stationary' ||
    designParam === '2' ||
    designParam === 'v2' ||
    params.has('minimal')
  ) {
    return true;
  }

  return false;
}

export function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMinimalDesign, setIsMinimalDesign] = useState<boolean>(checkIsMinimalDesign);

  useEffect(() => {
    const handlePopState = () => {
      setIsMinimalDesign(checkIsMinimalDesign());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleStartAudio = () => {
    soundManager.playEnvelopeChime();
    const started = soundManager.start();
    setIsPlayingMusic(started);
  };

  const handleOpenComplete = (startAudio: boolean) => {
    setIsEnvelopeOpen(true);
    if (startAudio && !soundManager.getStatus()) {
      const started = soundManager.start();
      setIsPlayingMusic(started);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMusic = () => {
    const playing = soundManager.toggle();
    setIsPlayingMusic(playing);
  };

  const handleReplayEnvelope = () => {
    soundManager.stop(true);
    setIsPlayingMusic(false);
    setIsEnvelopeOpen(false);
  };

  return (
    <div className="min-h-screen bg-alabaster text-espresso relative selection:bg-blush/40 selection:text-rust">
      <AnimatePresence mode="wait">
        {!isEnvelopeOpen && (
          <EnvelopeSplash
            key="envelope-splash"
            variant={isMinimalDesign ? 'stationery' : 'boho'}
            onStartAudio={handleStartAudio}
            onOpenComplete={handleOpenComplete}
          />
        )}
      </AnimatePresence>

      {/* Main Scrolling Invitation Experience */}
      <div
        className={`transition-opacity duration-700 ${
          isEnvelopeOpen ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden pointer-events-none'
        }`}
      >
        {isMinimalDesign ? (
          <main>
            <MinimalInvitationView />
          </main>
        ) : (
          <>
            <main>
              <HeroSection />
              <SaveTheDateSection />
              <LocationSection />
              <TimelineSection />
              <EntourageSection />
              <DressCodeSection />
              <RemindersSection />
              <GallerySection />
              <RsvpSection />
            </main>

            <FooterSection />
          </>
        )}

        <FloatingNav
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={handleToggleMusic}
          onReplayEnvelope={handleReplayEnvelope}
        />
      </div>
    </div>
  );
}

export default App;
