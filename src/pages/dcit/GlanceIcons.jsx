const ACCENT = 'var(--icon-accent, #14c8c0)';
const BG = 'var(--icon-bg, #f4f6fd)';

const make = (children) =>
  function Icon({ size = 28, className = '' }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        {children}
      </svg>
    );
  };

/* ---------- Timeline + facts ---------- */
export const BookIcon = make(
  <>
    <path d="M24 12C20 9 13 8 6 9v28c7-1 14 0 18 3z" />
    <path d="M24 12c4-3 11-4 18-3v28c-7-1-14 0-18 3z" />
    <path d="M11 16h8M11 22h8" stroke={ACCENT} />
    <path d="M29 16h8M29 22h8" stroke={ACCENT} />
  </>,
);

export const LaptopIcon = make(
  <>
    <rect x="8" y="10" width="32" height="22" rx="3" />
    <path d="M4 38h40" />
    <path d="m19 17 4 4-4 4M26 25h5" stroke={ACCENT} />
  </>,
);

export const ChartIcon = make(
  <>
    <path d="M6 41h36" />
    <rect x="10" y="30" width="6" height="11" rx="1.5" fill={ACCENT} stroke="none" />
    <rect x="21" y="26" width="6" height="15" rx="1.5" fill={ACCENT} stroke="none" />
    <rect x="32" y="22" width="6" height="19" rx="1.5" fill={ACCENT} stroke="none" />
    <path d="m8 21 9-7 7 4 12-10M29 8h7v7" />
  </>,
);

export const BriefcaseIcon = make(
  <>
    <rect x="6" y="15" width="36" height="25" rx="4" />
    <path d="M17 15v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" />
    <path d="M6 26h36" stroke={ACCENT} />
    <rect x="21" y="23" width="6" height="6" rx="1.5" fill={ACCENT} stroke="none" />
  </>,
);

export const CapIcon = make(
  <>
    <path d="M24 9 4 19l20 10 20-10z" fill={ACCENT} fillOpacity="0.3" />
    <path d="M12 24v10c6 6 18 6 24 0V24" />
    <path d="M44 19v12" />
    <circle cx="44" cy="33" r="2" fill={ACCENT} stroke="none" />
  </>,
);

export const CalendarIcon = make(
  <>
    <rect x="6" y="10" width="36" height="32" rx="5" />
    <path d="M6 20h36M15 6v8M33 6v8" />
    <g fill={ACCENT} stroke="none">
      <circle cx="16" cy="28" r="2" />
      <circle cx="24" cy="28" r="2" />
      <circle cx="32" cy="28" r="2" />
      <circle cx="16" cy="35" r="2" />
      <circle cx="24" cy="35" r="2" />
    </g>
  </>,
);

export const LayersIcon = make(
  <>
    <path d="M24 6 4 16l20 10 20-10z" />
    <path d="m4 24 20 10 20-10" stroke={ACCENT} />
    <path d="m4 32 20 10 20-10" />
  </>,
);

export const ClipboardIcon = make(
  <>
    <rect x="9" y="8" width="30" height="34" rx="4" />
    <rect x="17" y="4" width="14" height="8" rx="3" fill={ACCENT} stroke="none" />
    <path d="m16 28 6 6 10-12" stroke={ACCENT} />
  </>,
);

/* ---------- Semester 1 ---------- */
export const CodeWindowIcon = make(
  <>
    <rect x="5" y="9" width="38" height="30" rx="4" />
    <path d="M5 18h38" />
    <g fill={ACCENT} stroke="none">
      <circle cx="11" cy="13.5" r="1.4" />
      <circle cx="16" cy="13.5" r="1.4" />
      <circle cx="21" cy="13.5" r="1.4" />
    </g>
    <path d="m19 26-5 5 5 5M29 26l5 5-5 5" />
    <path d="m26 25-4 12" stroke={ACCENT} />
  </>,
);

export const PhoneIcon = make(
  <>
    <rect x="13" y="4" width="22" height="40" rx="5" />
    <rect x="17" y="12" width="14" height="22" rx="2" fill={ACCENT} fillOpacity="0.25" stroke="none" />
    <path d="M20 8h8" stroke={ACCENT} />
    <circle cx="24" cy="39" r="2" fill={ACCENT} stroke="none" />
  </>,
);

export const KanbanIcon = make(
  <>
    <rect x="5" y="7" width="38" height="34" rx="4" />
    <path d="M18 7v34M31 7v34" />
    <g fill={ACCENT} stroke="none">
      <rect x="9" y="13" width="5" height="6" rx="1.2" />
      <rect x="9" y="23" width="5" height="6" rx="1.2" />
      <rect x="22" y="13" width="6" height="6" rx="1.2" />
      <rect x="35" y="13" width="5" height="6" rx="1.2" />
      <rect x="35" y="23" width="5" height="6" rx="1.2" />
      <rect x="35" y="33" width="5" height="4" rx="1.2" />
    </g>
  </>,
);

export const PenToolIcon = make(
  <>
    <path d="M24 4 34 20l-4 14H18l-4-14z" fill={ACCENT} fillOpacity="0.2" />
    <path d="M18 34v7h12v-7" />
    <path d="M24 25v9" />
    <circle cx="24" cy="21" r="3" fill={ACCENT} stroke="none" />
  </>,
);

export const DatabaseIcon = make(
  <>
    <ellipse cx="24" cy="12" rx="15" ry="6" />
    <path d="M9 12v24c0 3.3 6.7 6 15 6s15-2.7 15-6V12" />
    <path d="M9 24c0 3.3 6.7 6 15 6s15-2.7 15-6" stroke={ACCENT} />
  </>,
);

/* ---------- Semester 2 ---------- */
export const CodeBracketsIcon = make(
  <>
    <path d="m17 14-10 10 10 10M31 14l10 10-10 10" />
    <path d="M27 10 21 38" stroke={ACCENT} />
  </>,
);

export const NetworkIcon = make(
  <>
    <circle cx="24" cy="24" r="5" />
    <path d="M24 19V9.5M28.3 21.5 37 16.5M28.3 26.5 37 31.5M24 29v9.5M19.7 26.5 11 31.5M19.7 21.5 11 16.5" />
    <g fill={ACCENT} stroke="none">
      <circle cx="24" cy="7" r="3.5" />
      <circle cx="39.5" cy="15" r="3.5" />
      <circle cx="39.5" cy="33" r="3.5" />
      <circle cx="24" cy="41" r="3.5" />
      <circle cx="8.5" cy="33" r="3.5" />
      <circle cx="8.5" cy="15" r="3.5" />
    </g>
  </>,
);

export const PythonIcon = make(
  <>
    <rect x="11" y="4" width="20" height="20" rx="8" fill="currentColor" stroke="none" />
    <rect x="17" y="24" width="20" height="20" rx="8" fill={ACCENT} stroke="none" />
    <circle cx="18" cy="11" r="1.8" fill={BG} stroke="none" />
    <circle cx="30" cy="37" r="1.8" fill={BG} stroke="none" />
    <path d="M17 18h8M23 30h8" stroke={BG} strokeWidth="2" />
  </>,
);

export const OfficeIcon = make(
  <>
    <rect x="5" y="7" width="30" height="28" rx="3" />
    <path d="M5 16h30M5 25h30M15 16v19" />
    <rect x="5.5" y="7.5" width="29" height="8" rx="2.5" fill={ACCENT} fillOpacity="0.3" stroke="none" />
    <circle cx="35" cy="34" r="8" stroke={ACCENT} strokeWidth="3.5" strokeDasharray="3.1 3.1" />
    <circle cx="35" cy="34" r="5.5" fill={ACCENT} stroke="none" />
    <circle cx="35" cy="34" r="2" fill={BG} stroke="none" />
  </>,
);

/* ---------- Semester 3 ---------- */
export const TreeIcon = make(
  <>
    <path d="M24 14v19M10 34v-6a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v6" />
    <circle cx="24" cy="9" r="5" fill="currentColor" stroke="none" />
    <g fill={ACCENT} stroke="none">
      <circle cx="10" cy="38" r="5" />
      <circle cx="24" cy="38" r="5" />
      <circle cx="38" cy="38" r="5" />
    </g>
  </>,
);

export const LogicIcon = make(
  <>
    <path d="m6 6 7 16 7-16M9 14h8" />
    <path d="m28 22 7-14 7 14" stroke={ACCENT} />
    <path d="M8 28h12v14H8M8 35h12" />
    <path d="m28 28 7 14 7-14" stroke={ACCENT} />
  </>,
);

export const TrophyIcon = make(
  <>
    <path d="M14 8h20v12a10 10 0 0 1-20 0z" fill={ACCENT} fillOpacity="0.25" />
    <path d="M14 12H8v3a6 6 0 0 0 6 6M34 12h6v3a6 6 0 0 1-6 6" />
    <path d="M24 30v7" />
    <rect x="16" y="37" width="16" height="6" rx="2" fill={ACCENT} stroke="none" />
    <path
      d="m24 11 2 4.2 4.6.6-3.4 3.2.9 4.5-4.1-2.3-4.1 2.3.9-4.5-3.4-3.2 4.6-.6z"
      fill={ACCENT}
      stroke="none"
    />
  </>,
);

export const HandshakeIcon = make(
  <g transform="scale(2)" strokeWidth="1.3">
    <path d="m11 17 2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" stroke={ACCENT} />
    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" stroke={ACCENT} />
  </g>,
);

export const FlagIcon = make(
  <>
    <path d="M12 42V6" />
    <path d="M12 8h26l-6 8 6 8H12z" fill={ACCENT} stroke="none" />
  </>,
);
/* ---------- Career icons ---------- */
export const WebDevIcon = make(
  <>
    <rect x="10" y="9" width="28" height="21" rx="3" />
    <path d="M4 38h40" />
    <path d="m20 15-4 4.5 4 4.5M28 15l4 4.5-4 4.5" stroke={ACCENT} />
    <path d="m25.5 14-3 11" stroke={ACCENT} />
  </>,
);

export const MobileAppIcon = make(
  <>
    <rect x="12" y="4" width="24" height="40" rx="6" />
    <g stroke="none">
      <rect x="17" y="12" width="6.5" height="6.5" rx="1.6" fill={ACCENT} />
      <rect x="25" y="12" width="6.5" height="6.5" rx="1.6" fill="currentColor" />
      <rect x="17" y="21" width="6.5" height="6.5" rx="1.6" fill="currentColor" />
      <rect x="25" y="21" width="6.5" height="6.5" rx="1.6" fill={ACCENT} />
    </g>
    <path d="M21 38h6" />
  </>,
);

export const DatabaseGearIcon = make(
  <>
    <ellipse cx="20" cy="10" rx="13" ry="5" />
    <path d="M7 10v26c0 2.8 5.8 5 13 5" />
    <path d="M33 10v10" />
    <path d="M7 22c0 2.8 5.8 5 13 5" />
    <circle cx="35" cy="35" r="9" fill={ACCENT} stroke="none" />
    <circle cx="35" cy="35" r="5.6" stroke={BG} strokeWidth="2.4" strokeDasharray="2.6 2.4" />
    <circle cx="35" cy="35" r="2.2" fill={BG} stroke="none" />
  </>,
);

export const DataAnalystIcon = make(
  <>
    <g fill={ACCENT} stroke="none">
      <rect x="7" y="30" width="7" height="12" rx="1.6" />
      <rect x="17" y="26" width="7" height="16" rx="1.6" />
      <rect x="27" y="26" width="7" height="16" rx="1.6" />
      <rect x="37" y="18" width="7" height="24" rx="1.6" />
    </g>
    <path d="m9 22 8-8 8 6 11-12" />
    <g fill="currentColor" stroke="none">
      <circle cx="9" cy="22" r="2.6" />
      <circle cx="17" cy="14" r="2.6" />
      <circle cx="25" cy="20" r="2.6" />
      <circle cx="36" cy="8" r="2.6" />
    </g>
  </>,
);

export const RouterIcon = make(
  <>
    <rect x="5" y="30" width="38" height="11" rx="4" fill="currentColor" stroke="none" />
    <path d="M11 30V16M37 30V16" />
    <path d="M18 17a8 8 0 0 1 12 0M20.5 21a4.6 4.6 0 0 1 7 0" stroke={ACCENT} />
    <circle cx="24" cy="25" r="1.6" fill={ACCENT} stroke="none" />
    <g fill={ACCENT} stroke="none">
      <circle cx="14" cy="35.5" r="1.8" />
      <circle cx="21" cy="35.5" r="1.8" />
      <circle cx="28" cy="35.5" r="1.8" />
    </g>
  </>,
);

export const TesterIcon = make(
  <>
    <circle cx="20" cy="20" r="14" />
    <path d="m31 31 11 11" strokeWidth="5" />
    <path d="m13 20.5 5 5 9-10" stroke={ACCENT} strokeWidth="3.4" />
  </>,
);
/* ---------- Quality block ---------- */
export const ShieldCheckIcon = make(
  <>
    <path d="M24 4 8 10v12c0 11 7 18 16 22 9-4 16-11 16-22V10z" />
    <path d="m16 24 6 6 11-12" stroke={ACCENT} strokeWidth="3.6" />
  </>,
);

export const GlobeIcon = make(
  <>
    <circle cx="24" cy="24" r="18" />
    <ellipse cx="24" cy="24" rx="8" ry="18" stroke={ACCENT} />
    <path d="M6 24h36" />
    <path d="M10 14h28M10 34h28" stroke={ACCENT} />
  </>,
);
/* ---------- Save time & money ---------- */
export const CalendarClockIcon = make(
  <>
    <rect x="5" y="9" width="32" height="30" rx="5" />
    <path d="M5 18h32M13 5v8M29 5v8" />
    <g fill={ACCENT} stroke="none">
      <circle cx="13" cy="25" r="1.8" />
      <circle cx="21" cy="25" r="1.8" />
      <circle cx="29" cy="25" r="1.8" />
      <circle cx="13" cy="32" r="1.8" />
      <circle cx="21" cy="32" r="1.8" />
    </g>
    <circle cx="36" cy="35" r="9" fill={ACCENT} stroke="none" />
    <path d="M36 30v5.5l3.5 2" stroke={BG} strokeWidth="2.4" />
  </>,
);

export const HomeCoinsIcon = make(
  <>
    <path d="M5 24 21 9l16 15" />
    <path d="M9 21v17h16" />
    <path d="M16 38V29h7v9" />
    <g fill={ACCENT} stroke="none">
      <ellipse cx="36" cy="26" rx="8" ry="3.4" />
      <path d="M28 29.5v4c0 1.9 3.6 3.4 8 3.4s8-1.5 8-3.4v-4c0 1.9-3.6 3.4-8 3.4s-8-1.5-8-3.4z" />
      <path d="M28 36v4c0 1.9 3.6 3.4 8 3.4s8-1.5 8-3.4v-4c0 1.9-3.6 3.4-8 3.4s-8-1.5-8-3.4z" />
    </g>
  </>,
);

export const MapPinIcon = make(
  <>
    <path d="M4 33 12 24h24l8 9v7H4z" />
    <path d="M24 24v16" />
    <path d="M24 4a9 9 0 0 0-9 9c0 7 9 15 9 15s9-8 9-15a9 9 0 0 0-9-9z" fill={ACCENT} stroke="none" />
    <circle cx="24" cy="13" r="3.2" fill={BG} stroke="none" />
  </>,
);