import { useId } from 'react';

// Realistic gradient icons (same style as the "Save time and money" icons).
// Every icon takes a `size` prop. Names match the icon names used in DcitGlance.jsx.

const BLUE_LIGHT = '#7d9bff';
const BLUE = '#2a47d6';
const BLUE_DARK = '#1a33a8';
const TEAL_LIGHT = '#7be8de';
const TEAL = '#0f9c92';

function useGrad() {
  const base = useId().replace(/:/g, '');
  const ref = (n) => `url(#${base}-${n})`;
  const defs = (
    <defs>
      <linearGradient id={`${base}-b`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={BLUE_LIGHT} />
        <stop offset="1" stopColor={BLUE} />
      </linearGradient>
      <linearGradient id={`${base}-d`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#4d6ef5" />
        <stop offset="1" stopColor={BLUE_DARK} />
      </linearGradient>
      <linearGradient id={`${base}-t`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={TEAL_LIGHT} />
        <stop offset="1" stopColor={TEAL} />
      </linearGradient>
      <linearGradient id={`${base}-l`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#d3dcf6" />
      </linearGradient>
    </defs>
  );
  return { ref, defs };
}

function Icon({ size = 44, defs, children, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="2 2 44 44"
      style={{ display: 'block', overflow: 'visible' }}
      aria-hidden="true"
    >
      {defs}
      {children}
    </svg>
  );
}

const stroke = (color, width = 2.4) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: width,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

/* ---------------- Timeline icons ---------------- */

export function BookIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M24 13C19 9.5 12 8.5 5 10v27c7-1.5 14-.5 19 3z" fill={ref('b')} />
      <path d="M24 13c5-3.5 12-4.5 19-3v27c-7-1.5-14-.5-19 3z" fill={ref('d')} />
      <path d="M9 16.5c4-.5 8 0 11 1.5M9 22.5c4-.5 8 0 11 1.5M9 28.5c4-.5 8 0 11 1.5M39 16.5c-4-.5-8 0-11 1.5M39 22.5c-4-.5-8 0-11 1.5M39 28.5c-4-.5-8 0-11 1.5" {...stroke('#fff', 1.6)} strokeOpacity="0.55" />
      <path d="M31 10.5h5V25l-2.5-2.2L31 25z" fill={ref('t')} />
    </Icon>
  );
}

export function LaptopIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="8" y="8" width="32" height="25" rx="3.5" fill={ref('d')} />
      <rect x="11" y="11" width="26" height="19" rx="1.8" fill={ref('l')} />
      <path d="M16 16.5l4.5 3.5-4.5 3.5" {...stroke(TEAL, 2.4)} />
      <path d="M23.5 24.5h7" {...stroke(BLUE, 2.4)} />
      <path d="M3.5 36h41l-2 3.2a3 3 0 0 1-2.6 1.5H8.1a3 3 0 0 1-2.6-1.5z" fill={ref('b')} />
      <rect x="19" y="36" width="10" height="1.8" rx="0.9" fill="#fff" opacity="0.5" />
    </Icon>
  );
}

export function ChartIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="6" y="27" width="9" height="15" rx="2.2" fill={ref('b')} />
      <rect x="19.5" y="21" width="9" height="21" rx="2.2" fill={ref('b')} />
      <rect x="33" y="15" width="9" height="27" rx="2.2" fill={ref('d')} />
      <path d="M4 44.5h40" {...stroke('#8aa0ee', 2)} />
      <path d="M7 20l11-7 8 4 13-9" {...stroke(TEAL, 2.6)} />
      <path d="M33 8h6v6" {...stroke(TEAL, 2.6)} />
    </Icon>
  );
}

export function BriefcaseIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M17 14v-2.5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3V14" {...stroke(BLUE, 3)} />
      <rect x="5" y="13" width="38" height="28" rx="5" fill={ref('b')} />
      <path d="M5 26h38v10a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z" fill={ref('d')} />
      <rect x="7" y="15" width="34" height="3" rx="1.5" fill="#fff" opacity="0.28" />
      <rect x="19.5" y="22.5" width="9" height="7.5" rx="2" fill={ref('t')} />
    </Icon>
  );
}

export function CapIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M12 23v8c0 3.2 5.5 6 12 6s12-2.8 12-6v-8l-12 6z" fill={ref('d')} />
      <path d="M24 8L4 18l20 10 20-10z" fill={ref('b')} />
      <path d="M24 8L4 18l8 4 12-10z" fill="#fff" opacity="0.22" />
      <path d="M42 19v13" {...stroke(TEAL, 2.4)} />
      <circle cx="42" cy="34.5" r="2.8" fill={ref('t')} />
    </Icon>
  );
}

/* ---------------- Subject icons ---------------- */

export function WebIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="4" y="8" width="40" height="32" rx="5" fill={ref('d')} />
      <path d="M4 13a5 5 0 0 1 5-5h30a5 5 0 0 1 5 5v4H4z" fill={ref('b')} />
      <circle cx="9.5" cy="12.5" r="1.4" fill="#fff" />
      <circle cx="14.5" cy="12.5" r="1.4" fill="#fff" opacity="0.8" />
      <circle cx="19.5" cy="12.5" r="1.4" fill="#fff" opacity="0.6" />
      <rect x="7" y="20" width="34" height="17" rx="2.5" fill={ref('l')} />
      <path d="M19 24.5l-4.5 4.5 4.5 4.5M29 24.5l4.5 4.5-4.5 4.5" {...stroke(BLUE, 2.4)} />
      <path d="M26 23l-4 12" {...stroke(TEAL, 2.4)} />
    </Icon>
  );
}

export function MobileIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="12" y="3.5" width="24" height="41" rx="6" fill={ref('d')} />
      <rect x="15" y="9" width="18" height="28" rx="2.5" fill={ref('l')} />
      <rect x="18" y="12.5" width="12" height="8" rx="2" fill={ref('t')} />
      <rect x="18" y="24" width="12" height="2.5" rx="1.2" fill="#b9c4e6" />
      <rect x="18" y="29" width="8" height="2.5" rx="1.2" fill="#b9c4e6" />
      <rect x="20.5" y="5.5" width="7" height="1.8" rx="0.9" fill="#fff" opacity="0.6" />
      <circle cx="24" cy="40.5" r="1.8" fill="#fff" opacity="0.7" />
    </Icon>
  );
}

export function AgileIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="4" y="8" width="40" height="32" rx="5" fill={ref('d')} />
      <rect x="7" y="11" width="34" height="26" rx="2.5" fill={ref('l')} />
      <path d="M18.5 11v26M29.5 11v26" {...stroke('#c3cdea', 1.5)} />
      <rect x="9.5" y="14" width="7" height="5" rx="1.4" fill={ref('t')} />
      <rect x="9.5" y="22" width="7" height="5" rx="1.4" fill={ref('b')} />
      <rect x="20.5" y="14" width="7" height="5" rx="1.4" fill={ref('b')} />
      <rect x="20.5" y="22" width="7" height="5" rx="1.4" fill={ref('t')} />
      <rect x="31.5" y="14" width="7" height="5" rx="1.4" fill={ref('t')} />
      <rect x="31.5" y="22" width="7" height="5" rx="1.4" fill={ref('b')} />
    </Icon>
  );
}

export function DesignIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M9 24c0-9 6-14 15-14s15 5 15 14" {...stroke('#8aa0ee', 2)} />
      <circle cx="9" cy="24" r="2.8" fill={ref('t')} />
      <circle cx="39" cy="24" r="2.8" fill={ref('t')} />
      <circle cx="24" cy="9.5" r="2.8" fill={ref('t')} />
      <path d="M24 21l10 8-3 10H17l-3-10z" fill={ref('b')} />
      <path d="M24 21l-10 8 3 10h7z" fill="#fff" opacity="0.18" />
      <path d="M24 22.5v8" {...stroke('#fff', 2.2)} />
      <circle cx="24" cy="32.5" r="2.4" fill="#fff" />
      <rect x="15" y="39" width="18" height="4.5" rx="1.6" fill={ref('d')} />
    </Icon>
  );
}

export function DatabaseIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M7 11v26c0 3.9 7.2 7 17 7s17-3.1 17-7V11z" fill={ref('b')} />
      <path d="M7 22.5c0 3.9 7.2 7 17 7s17-3.1 17-7" {...stroke(TEAL_LIGHT, 3)} />
      <path d="M7 33c0 3.9 7.2 7 17 7s17-3.1 17-7" {...stroke('#fff', 2)} strokeOpacity="0.55" />
      <ellipse cx="24" cy="11" rx="17" ry="7" fill={ref('l')} />
      <ellipse cx="24" cy="11" rx="10" ry="3.2" fill={ref('b')} opacity="0.25" />
    </Icon>
  );
}

export function CodeIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="4" y="8" width="40" height="32" rx="5" fill={ref('d')} />
      <rect x="4" y="8" width="40" height="8" rx="4" fill="#fff" opacity="0.14" />
      <path d="M13 20l7 5.5-7 5.5" {...stroke('#fff', 3)} />
      <path d="M25 31h10" {...stroke(TEAL_LIGHT, 3.2)} />
    </Icon>
  );
}

export function NetworkIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M24 17v7M24 24l-12 8M24 24l12 8" {...stroke('#8aa0ee', 2.6)} />
      <rect x="15" y="5" width="18" height="12" rx="3" fill={ref('b')} />
      <rect x="3" y="31" width="18" height="12" rx="3" fill={ref('d')} />
      <rect x="27" y="31" width="18" height="12" rx="3" fill={ref('d')} />
      <circle cx="24" cy="24" r="3.5" fill={ref('t')} />
    </Icon>
  );
}

export function AnalyticsIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="5" y="26" width="9" height="15" rx="2.2" fill={ref('b')} />
      <rect x="19.5" y="17" width="9" height="24" rx="2.2" fill={ref('d')} />
      <rect x="34" y="8" width="9" height="33" rx="2.2" fill={ref('t')} />
      <path d="M3 44.5h42" {...stroke('#8aa0ee', 2)} />
    </Icon>
  );
}

export function TeamIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <circle cx="9.5" cy="19" r="4.5" fill={ref('b')} />
      <circle cx="38.5" cy="19" r="4.5" fill={ref('b')} />
      <path d="M2 38c0-6 3.5-10 7.5-10S17 32 17 38z" fill={ref('b')} />
      <path d="M31 38c0-6 3.5-10 7.5-10S46 32 46 38z" fill={ref('b')} />
      <circle cx="24" cy="15" r="7" fill={ref('t')} />
      <path d="M10 41c0-8 6-13 14-13s14 5 14 13z" fill={ref('t')} />
    </Icon>
  );
}

/* ---------------- More icons used by DcitGlance ---------------- */

// Same pictures under the names DcitGlance uses
export { WebIcon as CodeWindowIcon, MobileIcon as PhoneIcon, AgileIcon as KanbanIcon, DesignIcon as PenToolIcon };

export function CalendarIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="5" y="9" width="38" height="34" rx="6" fill={ref('l')} stroke="#c3cdea" strokeWidth="1.5" />
      <path d="M5 15a6 6 0 0 1 6-6h26a6 6 0 0 1 6 6v6H5z" fill={ref('b')} />
      <rect x="13" y="4" width="4.5" height="10" rx="2.2" fill={ref('d')} />
      <rect x="30.5" y="4" width="4.5" height="10" rx="2.2" fill={ref('d')} />
      <circle cx="14" cy="29" r="2.3" fill={ref('b')} />
      <circle cx="24" cy="29" r="2.3" fill={ref('b')} />
      <circle cx="34" cy="29" r="2.3" fill={ref('t')} />
      <circle cx="14" cy="37" r="2.3" fill={ref('b')} />
      <circle cx="24" cy="37" r="2.3" fill={ref('t')} />
    </Icon>
  );
}

export function ClipboardIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="8" y="7" width="32" height="37" rx="5" fill={ref('b')} />
      <rect x="12" y="13" width="24" height="27" rx="2.5" fill={ref('l')} />
      <rect x="16" y="3.5" width="16" height="9" rx="3" fill={ref('d')} />
      <path d="M16 21.5l2.3 2.3 4.2-4.6M16 31l2.3 2.3 4.2-4.6" {...stroke(TEAL, 2.4)} />
      <rect x="25" y="21" width="7" height="2.6" rx="1.3" fill="#b9c4e6" />
      <rect x="25" y="30.5" width="7" height="2.6" rx="1.3" fill="#b9c4e6" />
    </Icon>
  );
}

export function LayersIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M24 22L4 31.5 24 41l20-9.5z" fill={ref('d')} />
      <path d="M24 15L4 24.5 24 34l20-9.5z" fill={ref('b')} />
      <path d="M24 6L4 15.5 24 25l20-9.5z" fill={ref('t')} />
      <path d="M24 6L4 15.5l10 4.7L34 10z" fill="#fff" opacity="0.2" />
    </Icon>
  );
}

export function FlagIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M13 7c8-3.5 12 3 20 0 3-1.2 5-1.5 7-1v19c-2-.5-4-.2-7 1-8 3-12-3.5-20 0z" fill={ref('t')} />
      <path d="M13 7c8-3.5 12 3 20 0v6c-8 3-12-3.5-20 0z" fill="#fff" opacity="0.25" />
      <rect x="9" y="4" width="4.5" height="40" rx="2.2" fill={ref('d')} />
      <ellipse cx="11.25" cy="44" rx="7" ry="2" fill="#8aa0ee" opacity="0.45" />
    </Icon>
  );
}

export function TrophyIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M14 11H8v4c0 5 3.5 8 8 9M34 11h6v4c0 5-3.5 8-8 9" {...stroke('#8aa0ee', 3)} />
      <path d="M13 5h22v14c0 7.5-4.5 12-11 12S13 26.5 13 19z" fill={ref('b')} />
      <path d="M13 5h8v26c-5-1.5-8-6-8-12z" fill="#fff" opacity="0.2" />
      <path d="M24 10l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" fill={ref('t')} />
      <rect x="21" y="31" width="6" height="7" fill={ref('d')} />
      <rect x="14" y="38" width="20" height="6" rx="2.5" fill={ref('d')} />
    </Icon>
  );
}

export function TreeIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M24 13v7M24 20L11 28M24 20l13 8M11 28v4M37 28v4" {...stroke('#8aa0ee', 2.6)} />
      <circle cx="24" cy="9" r="6" fill={ref('b')} />
      <circle cx="11" cy="30" r="6" fill={ref('d')} />
      <circle cx="37" cy="30" r="6" fill={ref('t')} />
      <circle cx="11" cy="42" r="3.5" fill={ref('b')} opacity="0.85" />
      <circle cx="37" cy="42" r="3.5" fill={ref('b')} opacity="0.85" />
      <path d="M11 36v3M37 36v3" {...stroke('#8aa0ee', 2.2)} />
    </Icon>
  );
}

export function LogicIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <circle cx="18" cy="24" r="13" fill={ref('b')} opacity="0.92" />
      <circle cx="30" cy="24" r="13" fill={ref('t')} opacity="0.92" />
      <path d="M24 12.2a13 13 0 0 1 0 23.6 13 13 0 0 1 0-23.6z" fill={ref('d')} />
      <path d="M21 24h6M24 21v6" {...stroke('#fff', 2.4)} />
    </Icon>
  );
}

export function OfficeIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="7" y="5" width="34" height="38" rx="5" fill={ref('l')} stroke="#c3cdea" strokeWidth="1.5" />
      <path d="M7 10a5 5 0 0 1 5-5h24a5 5 0 0 1 5 5v6H7z" fill={ref('b')} />
      <path d="M7 25h34M7 34h34M20 16v27M31 16v27" {...stroke('#c3cdea', 1.5)} />
      <rect x="9" y="18" width="9" height="5" rx="1.2" fill={ref('t')} />
      <rect x="22" y="27" width="7" height="5" rx="1.2" fill={ref('b')} />
      <rect x="33" y="36" width="6" height="5" rx="1.2" fill={ref('t')} />
    </Icon>
  );
}

export function PythonIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="4" y="6" width="40" height="36" rx="6" fill={ref('d')} />
      <path d="M4 12a6 6 0 0 1 6-6h28a6 6 0 0 1 6 6v3H4z" fill={ref('b')} />
      <circle cx="10" cy="10.5" r="1.4" fill="#fff" />
      <circle cx="15" cy="10.5" r="1.4" fill="#fff" opacity="0.8" />
      <path d="M11 22l5 4.5-5 4.5M19 22l5 4.5-5 4.5M27 22l5 4.5-5 4.5" {...stroke(TEAL_LIGHT, 3)} />
      <path d="M13 37h14" {...stroke('#fff', 2.4)} strokeOpacity="0.6" />
    </Icon>
  );
}

export function CodeBracketsIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <path d="M19 7c-5 0-7 2-7 6v5c0 3-2.5 4.5-6 6 3.5 1.5 6 3 6 6v5c0 4 2 6 7 6" {...stroke(ref('b'), 3.4)} />
      <path d="M29 7c5 0 7 2 7 6v5c0 3 2.5 4.5 6 6-3.5 1.5-6 3-6 6v5c0 4-2 6-7 6" {...stroke(ref('t'), 3.4)} />
      <circle cx="24" cy="24" r="2.4" fill={ref('d')} />
    </Icon>
  );
}

export function HandshakeIcon(props) {
  const { ref, defs } = useGrad();
  return (
    <Icon {...props} defs={defs}>
      <rect x="2" y="15" width="8" height="19" rx="2.5" fill={ref('d')} />
      <rect x="38" y="15" width="8" height="19" rx="2.5" fill={ref('d')} />
      <path d="M10 18l9-3.5c2-.8 4.5-.2 6 .8l5 3.5-9 7c-2 1.5-4.5 1.2-6-.4L10 28z" fill={ref('b')} />
      <path d="M38 18l-8.5-3c-2-.7-4-.2-5.5 1l-5.5 4.5c-1.5 1.3-1.5 3.3 0 4.5l3 2.5c1.5 1.2 3.5 1 5-.2l3.5-2.8 5.5 5.5c1.5 1.5 4 0 3-2L38 18z" fill={ref('t')} />
      <path d="M17 33l3.5 3.5M22 35l3 3M27 33l2.5 2.5" {...stroke('#8aa0ee', 2.6)} />
    </Icon>
  );
}