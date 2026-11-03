import { useId } from 'react';

// Built-in illustrations used until you pass your own college / gate pictures.

function useIds() {
  const base = useId().replace(/:/g, '');
  return (n) => `${base}-${n}`;
}

function Island({ id }) {
  return (
    <g>
      <ellipse cx="150" cy="150" rx="118" ry="14" fill="#cdd5ec" opacity="0.55" />
      <path d="M44 128c10 8 30 14 106 14s96-6 106-14c-6 20-26 38-56 44-12 6-14 14-18 20-4-8-8-14-20-16-34-2-70-14-118-48z" fill={`url(#${id('rock')})`} />
      <path d="M32 118h236c0 6-12 12-30 12H62c-18 0-30-6-30-12z" fill={`url(#${id('grass')})`} />
    </g>
  );
}

export function CollegeArt({ className }) {
  const id = useIds();
  return (
    <svg className={className} viewBox="0 0 300 210" role="img" aria-label="College building">
      <defs>
        <linearGradient id={id('wall')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f5fc" />
          <stop offset="1" stopColor="#d3daee" />
        </linearGradient>
        <linearGradient id={id('roof')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b8bff" />
          <stop offset="1" stopColor="#2a49d8" />
        </linearGradient>
        <linearGradient id={id('rock')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c5cde6" />
          <stop offset="1" stopColor="#9aa6cc" />
        </linearGradient>
        <linearGradient id={id('grass')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fe0c8" />
          <stop offset="1" stopColor="#4cb89c" />
        </linearGradient>
      </defs>
      <Island id={id} />
      {/* clock tower */}
      <rect x="132" y="30" width="36" height="52" rx="2" fill={`url(#${id('wall')})`} />
      <path d="M128 32l22-24 22 24z" fill={`url(#${id('roof')})`} />
      <circle cx="150" cy="48" r="9" fill="#fff" stroke="#3558f0" strokeWidth="2" />
      <path d="M150 42v6l4 3" fill="none" stroke="#3558f0" strokeWidth="1.8" strokeLinecap="round" />
      {/* main hall */}
      <rect x="70" y="78" width="160" height="42" fill={`url(#${id('wall')})`} />
      <path d="M62 80l88-22 88 22z" fill={`url(#${id('roof')})`} />
      <path d="M62 80l88-22 8 2-84 22z" fill="#fff" opacity="0.2" />
      {[84, 106, 128, 172, 194, 216].map((x) => (
        <g key={x}>
          <rect x={x - 4} y="82" width="8" height="38" rx="1.5" fill="#fff" />
          <rect x={x - 4} y="82" width="3" height="38" rx="1" fill="#cfd6ec" />
        </g>
      ))}
      <rect x="140" y="94" width="20" height="26" rx="10" fill="#3558f0" />
      <rect x="140" y="94" width="20" height="26" rx="10" fill="#fff" opacity="0.15" />
      {/* trees */}
      <circle cx="52" cy="108" r="12" fill="#4cb89c" />
      <circle cx="250" cy="108" r="12" fill="#4cb89c" />
      <circle cx="46" cy="104" r="6" fill="#8fe0c8" opacity="0.8" />
    </svg>
  );
}

export function GateArt({ className }) {
  const id = useIds();
  return (
    <svg className={className} viewBox="0 0 300 210" role="img" aria-label="College gate">
      <defs>
        <radialGradient id={id('glow')} cx="0.5" cy="0.8" r="0.7">
          <stop offset="0" stopColor="#fff6c8" />
          <stop offset="0.5" stopColor="#ffd86b" />
          <stop offset="1" stopColor="#ffd86b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('wall')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f5fc" />
          <stop offset="1" stopColor="#d3daee" />
        </linearGradient>
        <linearGradient id={id('rock')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c5cde6" />
          <stop offset="1" stopColor="#9aa6cc" />
        </linearGradient>
        <linearGradient id={id('grass')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fe0c8" />
          <stop offset="1" stopColor="#4cb89c" />
        </linearGradient>
      </defs>
      <circle cx="150" cy="86" r="86" fill={`url(#${id('glow')})`} opacity="0.7" />
      <Island id={id} />
      <rect x="62" y="48" width="176" height="76" rx="3" fill={`url(#${id('wall')})`} />
      <rect x="56" y="38" width="188" height="14" rx="3" fill="#e4e9f7" />
      <rect x="56" y="38" width="188" height="4" rx="2" fill="#fff" opacity="0.6" />
      <path d="M104 124V86a46 46 0 0 1 92 0v38z" fill={`url(#${id('glow')})`} />
      <path d="M104 124V86a46 46 0 0 1 92 0v38" fill="none" stroke="#c3cbe4" strokeWidth="6" />
      {[116, 130, 144, 158, 172, 186].map((x) => (
        <path key={x} d={`M${x} 124V80`} stroke="#b4bedb" strokeWidth="2" />
      ))}
      {[78, 94, 206, 222].map((x) => (
        <rect key={x} x={x - 4} y="52" width="8" height="72" rx="2" fill="#fff" stroke="#d3daee" />
      ))}
      <circle cx="52" cy="110" r="12" fill="#4cb89c" />
      <circle cx="250" cy="110" r="12" fill="#4cb89c" />
    </svg>
  );
}