import { useEffect, useRef, useState } from 'react';
import styles from './DcitPathway.module.css';
import { CollegeArt, GateArt } from './PathwayArt.jsx';
import { HomeCoinsIcon, PeopleIcon, PlaneIcon } from './PathwayIcons.jsx';

const benefits = [
  { text: 'Fewer Years of Overseas Fees', Icon: PlaneIcon },
  { text: 'Lower Living Costs Abroad', Icon: HomeCoinsIcon },
  { text: 'Start Affordably in Nepal', Icon: PeopleIcon },
];

const STEP_COUNT = 11;

// "1" -> "1 year", anything else -> "4 years"
const formatYears = (n) => `${n} ${String(n) === '1' ? 'year' : 'years'}`;

/**
 * Props (all optional):
 *   collegeImage  picture for the college building (left side)
 *   gateImage     picture for the college gate (right side)
 *   bachelorYears / dcitYears  the numbers shown instead of [X] and [Y]
 */
export default function DcitPathway({
  collegeImage,
  gateImage,
  bachelorYears = '4',
  dcitYears = '1',
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  // Play the animations every time the section enters the screen,
  // and reset them when it leaves (works scrolling up and down)
  useEffect(() => {
    setReady(true); // only now is it safe to hide things

    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
   const io = new IntersectionObserver(
  ([entry]) => setInView(entry.isIntersecting),
  { threshold: 0, rootMargin: '-30% 0px -30% 0px' },
);
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.pathway} ${ready ? styles.ready : ''} ${inView ? styles.inView : ''}`}
      aria-labelledby="dcit-pathway-title"
    >
      <span className={`${styles.cloud} ${styles.cloudA}`} aria-hidden="true" />
      <span className={`${styles.cloud} ${styles.cloudB}`} aria-hidden="true" />

      <h2 id="dcit-pathway-title" className={styles.mainTitle}>
        Smarter Path. <span>Less Time. Less Cost.</span>
      </h2>

      <div className={styles.grid}>
        {/* ---------- LEFT: The Shortcut ---------- */}
        <article className={styles.panel}>
          <h3 className={styles.panelTitle}>The Shortcut</h3>

          <div className={styles.journey}>
            <div className={styles.collegeArt}>
              {collegeImage ? (
                <img src={collegeImage} alt="College building" />
              ) : (
                <CollegeArt className={styles.svgArt} />
              )}
            </div>

            <p className={`${styles.label} ${styles.labelA}`}>
              Full Bachelor&apos;s Degree:<strong>{formatYears(bachelorYears)}</strong>
            </p>

            <svg className={styles.road} viewBox="0 0 400 70" aria-hidden="true">
              <defs>
                <linearGradient id="roadBlue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#5f7fff" />
                  <stop offset="1" stopColor="#8d9ab8" />
                </linearGradient>
              </defs>
              <path className={styles.roadBase} d="M14 52 H150 C210 52 215 20 275 20 H372" stroke="url(#roadBlue)" />
              <path className={styles.roadDash} d="M14 52 H150 C210 52 215 20 275 20 H372" />
              <circle className={styles.dot} cx="14" cy="52" r="8" fill="var(--accent)" />
            </svg>

            <div className={styles.saved}>
              <span className={styles.swap} aria-hidden="true">↕</span>
              <p>
                Time and tuition saved
                <small>(varies by university)</small>
              </p>
            </div>

            <p className={`${styles.label} ${styles.labelB}`}>
              DCIT + Credit Transfer:<strong>{formatYears(dcitYears)}</strong>
            </p>

            <svg className={styles.road} viewBox="0 0 400 70" aria-hidden="true">
              <defs>
                <linearGradient id="roadGold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#ffd45c" />
                  <stop offset="1" stopColor="#f2a516" />
                </linearGradient>
              </defs>
              <path className={`${styles.roadBase} ${styles.roadGoldPath}`} d="M14 50 H140 C205 50 215 26 285 26 H372" stroke="url(#roadGold)" />
              <path className={styles.roadDash} d="M14 50 H140 C205 50 215 26 285 26 H372" />
              <circle className={styles.dot} cx="14" cy="50" r="8" fill="#2fd0c4" />
            </svg>
          </div>

          <ul className={styles.benefits}>
            {benefits.map(({ text, Icon }, i) => (
              <li key={text} className={styles.benefit} style={{ '--i': i }}>
                <Icon size={58} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </article>

        {/* ---------- RIGHT: The 12+1 Pathway ---------- */}
        <article className={styles.panel}>
          <h3 className={styles.panelTitle}>The 12+1 Pathway</h3>

          <div className={styles.climb}>
            <p className={styles.expect}>13-Year Expectation Met*</p>

            <div className={styles.gateArt}>
              {gateImage ? (
                <img src={gateImage} alt="College gate" />
              ) : (
                <GateArt className={styles.svgArt} />
              )}
            </div>

            <ol className={styles.stairs} aria-hidden="true">
              {Array.from({ length: STEP_COUNT }, (_, i) => (
                <li key={i} className={styles.stepBlock} style={{ '--n': i }} />
              ))}
              <li className={`${styles.stepBlock} ${styles.top}`} style={{ '--n': STEP_COUNT }} />
            </ol>

            <p className={styles.diploma}>DCIT Diploma</p>
            <p className={styles.school}>
              12 Years of School
              <small>(SEE + +2)</small>
            </p>
          </div>

          <p className={styles.smallNote} style={{ fontSize: '12.5px', color: '#8a91a8', lineHeight: 1.6 }}>
            After SEE and +2 you have 12 years of schooling. The DCIT Diploma adds the 13th year
            at home, so you can apply abroad without paying for a foundation year overseas.
          </p>
        </article>
      </div>
    </section>
  );
}