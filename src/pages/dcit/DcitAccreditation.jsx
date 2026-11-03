import { useEffect, useRef, useState } from 'react';
import styles from './DcitAccreditation.module.css';

// Edit the text and numbers here
const intro =
  'LCCI Global Qualifications programmes are quality assured by Qualifications Scotland, which was formerly SQA, and benchmarked on two international frameworks so universities can compare them.';

const frameworks = [
  {
    title: 'SCQF: Scottish Credit and Qualifications Framework',
    levels: 12,
    active: 7,
    min: 42,
    max: 125,
    // Thinkbox text shown above the active bar (remove the line to hide it)
    note: 'Equivalent to 1st year of a bachelor\u2019s degree',
  },
  {
    title: 'EQF: European Qualifications Framework',
    levels: 8,
    active: 5,
    min: 46,
    max: 125,
  },
];

const facts = [
  { title: 'SCQF Level 7', text: 'Where DCIT sits on the Scottish framework' },
  { title: '139 Credit Points', text: 'One point equals 10 hours of learning, so about 1,390 hours' },
  { title: 'EQF Level 5', text: 'Where DCIT sits on the European framework' },
];

function Shield() {
  const outline = 'M60 6 14 22v36c0 32 20 55 46 66 26-11 46-34 46-66V22z';
  return (
    <svg width="120" height="130" viewBox="0 0 120 130" fill="none" aria-hidden="true">
      <defs>
        {/* Gold for the shield */}
        <linearGradient id="dcitGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0b3" />
          <stop offset="0.45" stopColor="#ffc83d" />
          <stop offset="1" stopColor="#ff9f1c" />
        </linearGradient>
        {/* Orange to red gradient for the tick */}
        <linearGradient id="dcitPlasma" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb02e" />
          <stop offset="0.5" stopColor="#ff6a1f" />
          <stop offset="1" stopColor="#e8322c" />
        </linearGradient>
        {/* Soft blur = the fluffy glow */}
        <filter id="dcitFluff" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <path
        className={styles.shieldGlow}
        d={outline}
        fill="#ffd666"
        fillOpacity="0.4"
        stroke="#ffc83d"
        strokeWidth="14"
        strokeLinejoin="round"
        filter="url(#dcitFluff)"
      />
      <path
        className={styles.shieldOutline}
        pathLength="1"
        d={outline}
        stroke="url(#dcitGold)"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        className={styles.shieldTick}
        pathLength="1"
        d="m38 64 16 16 30-34"
        stroke="url(#dcitPlasma)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Ladder({ title, levels, active, min, max, note }) {
  return (
    <div className={styles.ladder}>
      <div className={styles.ladderHead}>
        <h3>{title}</h3>
        <span>{levels} levels</span>
      </div>
      <ol className={styles.bars}>
        {Array.from({ length: levels }, (_, i) => {
          const level = i + 1;
          const isActive = level === active;
          const height = Math.round(min + (i / (levels - 1)) * (max - min));
          return (
            <li
              key={level}
              className={`${styles.bar} ${isActive ? styles.barActive : ''} ${level < active ? styles.barTrail : ''}`}
              style={{ height: `${height}px`, '--i': i, '--t': active > 1 ? Math.min(i / (active - 1), 1) : 1 }}
              aria-label={isActive ? `Level ${level} (DCIT)${note ? `. ${note}` : ''}` : `Level ${level}`}
            >
              <span className={styles.num}>{level}</span>
              {isActive && note && (
                <span className={styles.thinkbox} role="note" aria-hidden="true">
                  {note}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function DcitAccreditation() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Play the animations every time the section enters the screen,
  // and reset them when it leaves (works scrolling up and down)
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.wrap} ${inView ? styles.inView : ''}`}
      aria-labelledby="dcit-accred-title"
    >
      <h2 id="dcit-accred-title" className={styles.srOnly}>Quality assurance and international benchmarking</h2>
      <p className={styles.intro}>{intro}</p>

      <div className={styles.top}>
        <div className={styles.card} style={{ '--k': 0 }}>
          <Shield />
          <h3 className={styles.shieldTitle}>Quality Assured by Qualifications Scotland</h3>
          <p className={styles.muted}>
            An independent check on the programme, backed by Scotland&apos;s national awarding body.
          </p>
        </div>

        <div className={`${styles.card} ${styles.ladders}`} style={{ '--k': 1 }}>
          {frameworks.map((f) => (
            <Ladder key={f.title} {...f} />
          ))}
        </div>
      </div>

      <ul className={styles.facts}>
        {facts.map((f, i) => (
          <li key={f.title} className={styles.fact} style={{ '--k': i + 4 }}>
            <strong>{f.title}</strong>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}