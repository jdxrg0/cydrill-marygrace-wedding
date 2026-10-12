import React from 'react';

export const TornPaperDivider: React.FC<{
  fill?: string;
  flip?: boolean;
  className?: string;
}> = ({ fill = '#FAFBF9', flip = false, className = '' }) => (
  <div
    className={`w-full overflow-hidden leading-none select-none pointer-events-none ${
      flip ? 'rotate-180' : ''
    } ${className}`}
  >
    <svg
      viewBox="0 0 1440 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-10 sm:h-16 md:h-20"
      preserveAspectRatio="none"
    >
      {/* Subtle shadow layer mimicking Canva torn paper */}
      <path
        d="M0,36 L48,29 L95,41 L152,25 L218,39 L275,20 L340,34 L412,18 L480,35 L538,24 L605,40 L670,22 L735,38 L798,21 L862,36 L930,19 L995,35 L1065,24 L1132,39 L1200,22 L1272,37 L1338,26 L1395,38 L1440,28 L1440,76 L0,76 Z"
        fill="rgba(34, 43, 35, 0.07)"
      />
      <path
        d="M0,44 L48,37 L95,49 L152,33 L218,47 L275,28 L340,42 L412,26 L480,43 L538,32 L605,48 L670,30 L735,46 L798,29 L862,44 L930,27 L995,43 L1065,32 L1132,47 L1200,30 L1272,45 L1338,34 L1395,46 L1440,36 L1440,76 L0,76 Z"
        fill={fill}
      />
    </svg>
  </div>
);

export const BotanicalSprig: React.FC<{
  className?: string;
  color?: string;
  budColor?: string;
}> = ({ className = 'w-32 h-32', color = '#6B8467', budColor = '#D49499' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
  >
    <path
      d="M35 170 C70 130, 115 85, 165 30"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    {/* Left & Right Sage Eucalyptus Leaves */}
    <path
      d="M65 135 C45 125, 35 100, 58 95 C72 108, 70 125, 65 135 Z"
      fill={color}
      fillOpacity="0.18"
      stroke={color}
      strokeWidth="1.4"
    />
    <path
      d="M85 115 C105 125, 128 112, 122 92 C104 94, 92 106, 85 115 Z"
      fill={color}
      fillOpacity="0.15"
      stroke={color}
      strokeWidth="1.4"
    />
    <path
      d="M106 92 C86 80, 82 54, 102 52 C114 66, 110 82, 106 92 Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.4"
    />
    <path
      d="M128 70 C148 78, 170 66, 164 48 C146 50, 135 62, 128 70 Z"
      fill={color}
      fillOpacity="0.15"
      stroke={color}
      strokeWidth="1.4"
    />
    <path
      d="M150 45 C145 28, 158 14, 174 20 C172 36, 158 42, 150 45 Z"
      fill={color}
      fillOpacity="0.24"
      stroke={color}
      strokeWidth="1.4"
    />
    {/* Touch of Blush Pink Floral Buds */}
    <circle cx="52" cy="148" r="3.5" fill={budColor} fillOpacity="0.75" />
    <circle cx="94" cy="76" r="2.8" fill={budColor} fillOpacity="0.65" />
    <circle cx="136" cy="36" r="3" fill={budColor} fillOpacity="0.75" />
  </svg>
);

export const BohoSunDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-4 my-6 select-none ${className}`}>
    <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-terracotta/50 to-terracotta" />
    <svg width="36" height="22" viewBox="0 0 36 22" fill="none" className="text-terracotta">
      <path
        d="M6 18 A12 12 0 0 1 30 18"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="#E8C5C8"
        fillOpacity="0.45"
      />
      <line x1="18" y1="1" x2="18" y2="4" stroke="#D49499" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="4" x2="10" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="4" x2="26" y2="6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="11" x2="5" y2="12" stroke="#D49499" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="11" x2="31" y2="12" stroke="#D49499" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="18" x2="34" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-terracotta/50 to-terracotta" />
  </div>
);
