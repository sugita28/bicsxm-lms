import { Link } from 'react-router-dom';

/* ---------- Inline SVG icons (no install needed) ---------- */
const iconProps = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const ServerOffIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="18" height="7" rx="2" />
    <rect x="3" y="14" width="18" height="7" rx="2" />
    <line x1="7" y1="6.5" x2="7.01" y2="6.5" />
    <line x1="7" y1="17.5" x2="7.01" y2="17.5" />
    <line x1="12" y1="10" x2="12" y2="14" strokeDasharray="1.5 2" />
  </svg>
);

const RefreshIcon = () => (
  <svg {...iconProps}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const HomeIcon = () => (
  <svg {...iconProps}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M10 21v-6h4v6" />
  </svg>
);

const AlertIcon = () => (
  <svg {...iconProps}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);

const ShieldIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

/* ---------- Page ---------- */
export default function ServerErrorPage() {
  return (
    <div className="clay-wrapper">
      <style>{css}</style>

      {/* Soft floating background blobs */}
      <span className="clay-blob blob-a" />
      <span className="clay-blob blob-b" />
      <span className="clay-blob blob-c" />

      <main className="clay-card" role="alert">
        {/* Status badge */}
        <div className="clay-badge">
          <AlertIcon />
          <span>Error 502 · Bad Gateway</span>
        </div>

        {/* Floating icon */}
        <div className="clay-icon-wrap">
          <div className="clay-icon">
            <ServerOffIcon />
          </div>
          <span className="clay-spark spark-1">✦</span>
          <span className="clay-spark spark-2">✦</span>
        </div>

        <h1 className="clay-code">502</h1>
        <h2 className="clay-title">Oops! Failed to load 🙈</h2>
        <p className="clay-text">
          Our server tripped over a cable and is taking a tiny nap.
          Give it a moment, then try again. We promise we&apos;re not ignoring you!
        </p>

        {/* Actions */}
        <div className="clay-actions">
          <button
            type="button"
            className="clay-btn clay-btn-primary"
            onClick={() => window.history.back()}
          >
            <RefreshIcon />
            Try again
          </button>
          <Link to="/" className="clay-btn clay-btn-secondary">
            <HomeIcon />
            Go home
          </Link>
        </div>

        {/* Reassurance chips */}
        <div className="clay-chips">
          <span className="clay-chip">
            <ClockIcon /> Usually fixed in minutes
          </span>
          <span className="clay-chip">
            <ShieldIcon /> Your data is safe
          </span>
        </div>
      </main>
    </div>
  );
}

/* ---------- Claymorphism styles ---------- */
const css = `
  .clay-wrapper {
    --clay-bg: var(--bg, #eaf0fb);
    --clay-accent: var(--accent-strong, #1e3a8a);
    --clay-text: #1f2a44;
    --clay-muted: var(--text-muted, #64748b);

    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    overflow: hidden;
    background: linear-gradient(145deg, #eef3ff 0%, #e6ecfa 45%, #f3e9ff 100%);
    font-family: inherit;
  }

  /* Background blobs */
  .clay-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    opacity: 0.85;
    animation: clay-drift 9s ease-in-out infinite;
  }
  .blob-a {
    width: 260px; height: 260px; top: -70px; left: -60px;
    background: linear-gradient(145deg, #c7d7ff, #a9bfff);
    box-shadow: inset -12px -12px 24px rgba(90,110,200,0.25), inset 12px 12px 24px rgba(255,255,255,0.7);
  }
  .blob-b {
    width: 200px; height: 200px; bottom: -50px; right: -40px;
    background: linear-gradient(145deg, #f5d3ff, #e2b5ff);
    box-shadow: inset -10px -10px 20px rgba(150,90,200,0.25), inset 10px 10px 20px rgba(255,255,255,0.7);
    animation-delay: -3s;
  }
  .blob-c {
    width: 120px; height: 120px; top: 55%; left: 8%;
    background: linear-gradient(145deg, #ffe0c7, #ffc9a3);
    box-shadow: inset -8px -8px 16px rgba(200,120,60,0.25), inset 8px 8px 16px rgba(255,255,255,0.7);
    animation-delay: -6s;
  }

  /* Main clay card */
  .clay-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 520px;
    padding: 2.5rem 2rem 2rem;
    text-align: center;
    border-radius: 40px;
    background: linear-gradient(145deg, #ffffff, #eef2fb);
    box-shadow:
      22px 22px 48px rgba(120, 140, 190, 0.35),
      -14px -14px 36px rgba(255, 255, 255, 0.95),
      inset 6px 6px 14px rgba(255, 255, 255, 0.9),
      inset -8px -8px 18px rgba(150, 165, 210, 0.22);
    animation: clay-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  /* Badge */
  .clay-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 1rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #b45309;
    border-radius: 999px;
    background: linear-gradient(145deg, #fff3dc, #ffe7bd);
    box-shadow:
      5px 5px 10px rgba(200, 150, 70, 0.25),
      -4px -4px 10px rgba(255, 255, 255, 0.9),
      inset 2px 2px 4px rgba(255, 255, 255, 0.8);
  }
  .clay-badge svg { font-size: 1rem; }

  /* Floating icon */
  .clay-icon-wrap {
    position: relative;
    width: 112px;
    height: 112px;
    margin: 1.75rem auto 0.5rem;
    animation: clay-float 3s ease-in-out infinite;
  }
  .clay-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.2rem;
    color: #fff;
    border-radius: 34px;
    background: linear-gradient(145deg, #6d8dff, #3b5bdb);
    box-shadow:
      12px 14px 26px rgba(59, 91, 219, 0.45),
      -8px -8px 18px rgba(255, 255, 255, 0.9),
      inset 5px 5px 10px rgba(255, 255, 255, 0.45),
      inset -6px -6px 12px rgba(20, 40, 140, 0.35);
    transform: rotate(-6deg);
  }
  .clay-spark {
    position: absolute;
    color: #f59e0b;
    font-size: 1.1rem;
    animation: clay-twinkle 2s ease-in-out infinite;
  }
  .spark-1 { top: -6px; right: -14px; }
  .spark-2 { bottom: 4px; left: -18px; font-size: 0.8rem; animation-delay: -1s; color: #a78bfa; }

  /* Text */
  .clay-code {
    margin: 0.5rem 0 0;
    font-size: clamp(4.5rem, 18vw, 6.5rem);
    line-height: 1;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--clay-accent);
    text-shadow:
      3px 3px 0 rgba(255, 255, 255, 0.9),
      6px 8px 14px rgba(30, 58, 138, 0.28);
  }
  .clay-title {
    margin: 0.5rem 0 0;
    font-size: clamp(1.25rem, 4.5vw, 1.6rem);
    font-weight: 800;
    color: var(--clay-text);
  }
  .clay-text {
    max-width: 380px;
    margin: 0.75rem auto 0;
    font-size: 0.97rem;
    line-height: 1.65;
    color: var(--clay-muted);
  }

  /* Buttons */
  .clay-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.9rem;
  }
  .clay-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.85rem 1.7rem;
    font-size: 0.95rem;
    font-weight: 700;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    border: none;
    border-radius: 999px;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .clay-btn svg { font-size: 1.15rem; }

  .clay-btn-primary {
    color: #fff;
    background: linear-gradient(145deg, #5b7cff, #2f4bd0);
    box-shadow:
      8px 10px 20px rgba(47, 75, 208, 0.45),
      -5px -5px 12px rgba(255, 255, 255, 0.9),
      inset 3px 3px 6px rgba(255, 255, 255, 0.4),
      inset -4px -4px 8px rgba(15, 30, 120, 0.35);
  }
  .clay-btn-secondary {
    color: var(--clay-accent);
    background: linear-gradient(145deg, #ffffff, #e9eefb);
    box-shadow:
      8px 10px 20px rgba(120, 140, 190, 0.35),
      -5px -5px 12px rgba(255, 255, 255, 0.95),
      inset 3px 3px 6px rgba(255, 255, 255, 0.9),
      inset -4px -4px 8px rgba(150, 165, 210, 0.25);
  }
  .clay-btn:hover { transform: translateY(-3px) scale(1.03); }
  .clay-btn:active { transform: translateY(1px) scale(0.98); }
  .clay-btn-primary:active {
    box-shadow:
      inset 5px 5px 10px rgba(15, 30, 120, 0.45),
      inset -3px -3px 8px rgba(120, 150, 255, 0.4);
  }
  .clay-btn-secondary:active {
    box-shadow:
      inset 5px 5px 10px rgba(150, 165, 210, 0.45),
      inset -3px -3px 8px rgba(255, 255, 255, 0.9);
  }
  .clay-btn:focus-visible {
    outline: 3px solid rgba(91, 124, 255, 0.55);
    outline-offset: 3px;
  }

  /* Chips */
  .clay-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 1.75rem;
  }
  .clay-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.85rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--clay-muted);
    border-radius: 999px;
    background: #eef2fb;
    box-shadow:
      inset 3px 3px 6px rgba(150, 165, 210, 0.3),
      inset -3px -3px 6px rgba(255, 255, 255, 0.95);
  }
  .clay-chip svg { font-size: 0.95rem; color: var(--clay-accent); }

  /* Animations */
  @keyframes clay-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes clay-drift {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(18px, -22px); }
  }
  @keyframes clay-twinkle {
    0%, 100% { opacity: 0.4; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes clay-pop {
    from { opacity: 0; transform: scale(0.9) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @media (max-width: 480px) {
    .clay-card { padding: 2rem 1.25rem 1.5rem; border-radius: 32px; }
    .clay-btn { width: 100%; justify-content: center; }
  }

  @media (prefers-reduced-motion: reduce) {
    .clay-wrapper *, .clay-card { animation: none !important; transition: none !important; }
  }
`;