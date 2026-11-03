import { useId } from 'react';

// Realistic, softly shaded icons (gradients + highlights) for the three benefit cards.

function Svg({ children, size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function useIds() {
  const base = useId().replace(/:/g, '');
  return (n) => `${base}-${n}`;
}

export function PlaneIcon({ size }) {
  const id = useIds();
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id('body')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7d9bff" />
          <stop offset="0.55" stopColor="#3558f0" />
          <stop offset="1" stopColor="#1b36b8" />
        </linearGradient>
        <linearGradient id={id('wing')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5f80ff" />
          <stop offset="1" stopColor="#1f3fd6" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="34" rx="27" ry="9" fill="none" stroke="#2fd0c4" strokeWidth="2" opacity="0.7" transform="rotate(-28 32 34)" />
      <path d="M12 38l12-4-9-14 6-1 14 11 12-5c3-1 5 1 4 3s-3 3-5 4l-9 6 3 16-5 1-9-14-9 5z" fill={`url(#${id('wing')})`} transform="translate(2 -2)" />
      <path d="M10 44c14-3 30-15 44-31 1.5-1.7 0-3-1.7-1.6C37 24 21 34 11 41c-2 1.5-1.5 3.5-1 3z" fill={`url(#${id('body')})`} />
      <path d="M16 40C28 32 40 22 50 14" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M44 20c4 1 7 4 8 8" fill="none" stroke="#2fd0c4" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function HomeCoinsIcon({ size }) {
  const id = useIds();
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id('roof')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b8bff" />
          <stop offset="1" stopColor="#2646d8" />
        </linearGradient>
        <linearGradient id={id('wall')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4d6ef5" />
          <stop offset="1" stopColor="#1a33a8" />
        </linearGradient>
        <linearGradient id={id('coin')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7be8de" />
          <stop offset="1" stopColor="#14a89e" />
        </linearGradient>
      </defs>
      <path d="M8 31L28 12l20 19z" fill={`url(#${id('roof')})`} />
      <path d="M8 31L28 12l6 5.7L16 33z" fill="#fff" opacity="0.18" />
      <rect x="13" y="30" width="30" height="22" rx="2" fill={`url(#${id('wall')})`} />
      <rect x="23" y="38" width="10" height="14" rx="1.5" fill="#e8edff" />
      <circle cx="31" cy="46" r="0.9" fill="#3558f0" />
      <rect x="38" y="14" width="5" height="9" rx="1" fill="#2a49d8" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <ellipse cx="48" cy={52 - i * 5.5} rx="10" ry="4" fill={`url(#${id('coin')})`} />
          <ellipse cx="48" cy={50.5 - i * 5.5} rx="10" ry="4" fill="#4fdcd0" />
          <ellipse cx="47" cy={50 - i * 5.5} rx="6" ry="1.5" fill="#fff" opacity="0.45" />
        </g>
      ))}
    </Svg>
  );
}

export function PeopleIcon({ size }) {
  const id = useIds();
  return (
    <Svg size={size}>
      <defs>
        <linearGradient id={id('blue')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6b8bff" />
          <stop offset="1" stopColor="#1f3fd6" />
        </linearGradient>
        <linearGradient id={id('teal')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7be8de" />
          <stop offset="1" stopColor="#0f9c92" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="26" r="6" fill={`url(#${id('blue')})`} />
      <path d="M3 50c0-9 4.5-15 11-15s11 6 11 15z" fill={`url(#${id('blue')})`} />
      <circle cx="50" cy="26" r="6" fill={`url(#${id('blue')})`} />
      <path d="M39 50c0-9 4.5-15 11-15s11 6 11 15z" fill={`url(#${id('blue')})`} />
      <circle cx="32" cy="18" r="8" fill={`url(#${id('teal')})`} />
      <path d="M17 54c0-12 6-20 15-20s15 8 15 20z" fill={`url(#${id('teal')})`} />
      <ellipse cx="29.5" cy="15" rx="3" ry="2" fill="#fff" opacity="0.4" />
    </Svg>
  );
}