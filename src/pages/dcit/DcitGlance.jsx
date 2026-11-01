import { useEffect, useRef, useState } from 'react';
import styles from './DcitGlance.module.css';
import {
  BookIcon,
  BriefcaseIcon,
  CalendarIcon,
  CapIcon,
  ChartIcon,
  ClipboardIcon,
  CodeBracketsIcon,
  CodeWindowIcon,
  DataAnalystIcon,
  DatabaseGearIcon,
  DatabaseIcon,
  FlagIcon,
  HandshakeIcon,
  KanbanIcon,
  LaptopIcon,
  LayersIcon,
  LogicIcon,
  MobileAppIcon,
  NetworkIcon,
  OfficeIcon,
  PenToolIcon,
  PhoneIcon,
  PythonIcon,
  RouterIcon,
  TesterIcon,
  TreeIcon,
  TrophyIcon,
  WebDevIcon,
} from './GlanceIcons.jsx';

// `detail` is optional. Steps that have it become clickable.
const steps = [
  {
    label: 'Semester 1',
    Icon: BookIcon,
    detail: {
      badge: 'Semester 1 of 3',
      title: 'Web & Mobile Foundations',
      progress: 1 / 3,
      modules: [
        { name: 'Web Development with Django and API', Icon: CodeWindowIcon },
        { name: 'Mobile Application Development', Icon: PhoneIcon },
        { name: 'Software Development with Agile', Icon: KanbanIcon },
        { name: 'Usability and Web Design', Icon: PenToolIcon },
        { name: 'Advance Database Design', Icon: DatabaseIcon },
      ],
    },
  },
  {
    label: 'Semester 2',
    Icon: LaptopIcon,
    detail: {
      badge: 'Semester 2 of 3',
      title: 'Code, Data & Networks',
      progress: 2 / 3,
      modules: [
        { name: 'Foundation of Software Development', Icon: CodeBracketsIcon },
        { name: 'Foundation of Database Design', Icon: DatabaseIcon },
        { name: 'Computer Network and Communication', Icon: NetworkIcon },
        { name: 'Programming with Python', Icon: PythonIcon },
        { name: 'Office Solution Development', Icon: OfficeIcon },
      ],
    },
  },
  {
    label: 'Semester 3',
    Icon: ChartIcon,
    detail: {
      badge: 'Semester 3 of 3',
      title: 'Become Job-Ready',
      progress: 1,
      flag: true,
      modules: [
        { name: 'Data Structure and Algorithm', Icon: TreeIcon },
        { name: 'Discrete Mathematics', Icon: LogicIcon },
        { name: 'Data Science with Python', Icon: ChartIcon },
        { name: 'Capstone Project', Icon: TrophyIcon, highlight: true },
        { name: 'Skills for Employment', Icon: HandshakeIcon },
      ],
    },
  },
  {
    label: '3-Month Internship',
    Icon: BriefcaseIcon,
    highlight: true,
    detail: {
      variant: 'internship',
      badge: 'Industry Placement',
      title: 'Learn on the Job',
      intro: 'Apply everything you have learned in a real workplace before you graduate.',
      months: [
        {
          label: 'Month 1',
          name: 'Onboarding',
          text: 'Meet your team, agree your goals and learn the tools.',
          Icon: ClipboardIcon,
        },
        {
          label: 'Month 2',
          name: 'Real project work',
          text: 'Build and ship real tasks with a mentor guiding you.',
          Icon: CodeWindowIcon,
        },
        {
          label: 'Month 3',
          name: 'Review & report',
          text: 'Present your results and receive formal feedback.',
          Icon: TrophyIcon,
        },
      ],
    },
  },
  { label: 'Diploma', Icon: CapIcon },
];

const facts = [
  { text: '18 Months', Icon: CalendarIcon },
  { text: '3 Semesters', Icon: LayersIcon },
  { text: '15 Subjects', Icon: ClipboardIcon },
];

const careers = [
  { name: 'Web Developer', Icon: WebDevIcon },
  { name: 'Mobile App Developer', Icon: MobileAppIcon },
  { name: 'Database Assistant', Icon: DatabaseGearIcon },
  { name: 'Junior Data Analyst', Icon: DataAnalystIcon },
  { name: 'Network Support', Icon: RouterIcon },
  { name: 'Software Tester', Icon: TesterIcon },
];

export default function DcitGlance() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [openLabel, setOpenLabel] = useState(null);

  const openStep = steps.find((s) => s.label === openLabel && s.detail);

  // Start the animations when the section scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Close the detail panel with Escape
  useEffect(() => {
    if (!openLabel) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpenLabel(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openLabel]);

  const toggle = (label) => setOpenLabel((cur) => (cur === label ? null : label));

  return (
    <section
      ref={ref}
      className={`${styles.glance} ${inView ? styles.inView : ''}`}
      aria-labelledby="dcit-glance-title"
    >
      <h2 id="dcit-glance-title" className={styles.title}>DCIT at a Glance</h2>

      <div className={styles.track}>
        <span className={styles.line} aria-hidden="true" />
        <ol className={styles.steps}>
          {steps.map((s, i) => {
            const Icon = s.Icon;
            const clickable = Boolean(s.detail);
            const isOpen = openLabel === s.label;
            const inner = (
              <>
                <span className={styles.node}>
                  <Icon size={34} />
                </span>
                <span className={styles.pill}>{s.label}</span>
              </>
            );
            return (
              <li
                key={s.label}
                className={`${styles.step} ${s.highlight ? styles.highlight : ''} ${isOpen ? styles.stepOpen : ''}`}
                style={{ '--i': i }}
              >
                {clickable ? (
                  <button
                    type="button"
                    className={styles.stepBtn}
                    aria-expanded={isOpen}
                    aria-controls="dcit-sem-panel"
                    onClick={() => toggle(s.label)}
                  >
                    {inner}
                  </button>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Internship panel (its own layout) */}
      {openStep && openStep.detail.variant === 'internship' && (
        <div
          key={openStep.label}
          id="dcit-sem-panel"
          className={`${styles.sem} ${styles.intern}`}
          role="region"
          aria-label={openStep.detail.title}
        >
          <span className={styles.internBadge}>{openStep.detail.badge}</span>
          <h3 className={styles.internTitle}>{openStep.detail.title}</h3>
          <p className={styles.internIntro}>{openStep.detail.intro}</p>

          <ol className={styles.internMonths}>
            {openStep.detail.months.map((m, i) => {
              const MIcon = m.Icon;
              return (
                <li key={m.label} className={styles.internMonth}>
                  <span className={styles.internNum}>{i + 1}</span>
                  <MIcon size={44} />
                  <small>{m.label}</small>
                  <strong>{m.name}</strong>
                  <span>{m.text}</span>
                </li>
              );
            })}
          </ol>

          <div className={styles.internDone}>
            <CapIcon size={30} />
            <span>Complete the internship to receive your Diploma</span>
          </div>
        </div>
      )}

      {/* Semester detail panel (matches the slides) */}
      {openStep && openStep.detail.variant !== 'internship' && (
        <div
          key={openStep.label}
          id="dcit-sem-panel"
          className={styles.sem}
          role="region"
          aria-label={openStep.detail.title}
        >
          <span className={styles.semBadge}>{openStep.detail.badge}</span>
          <h3 className={styles.semTitle}>{openStep.detail.title}</h3>

          <ul className={styles.semModules}>
            {openStep.detail.modules.map((m) => {
              const MIcon = m.Icon;
              return (
                <li
                  key={m.name}
                  className={`${styles.semModule} ${m.highlight ? styles.semModuleHot : ''}`}
                >
                  <MIcon size={48} />
                  <span>{m.name}</span>
                </li>
              );
            })}
          </ul>

          <div className={styles.semBarWrap}>
            <div className={styles.semBar} aria-hidden="true">
              <span style={{ width: `${openStep.detail.progress * 100}%` }} />
            </div>
            {openStep.detail.flag && <FlagIcon size={28} className={styles.semFlag} />}
          </div>
        </div>
      )}

      <ul className={styles.facts}>
        {facts.map((f, i) => {
          const Icon = f.Icon;
          return (
            <li key={f.text} className={styles.fact} style={{ '--i': i }}>
              <div className={styles.factBody}>
                <Icon size={30} className={styles.factIcon} />
                <strong>{f.text}</strong>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Careers */}
      <div className={styles.careers}>
        <h3 className={styles.careersTitle}>Where DCIT Can Take You</h3>
        <ul className={styles.careerGrid}>
          {careers.map((c) => {
            const CIcon = c.Icon;
            return (
              <li key={c.name} className={styles.career}>
                <CIcon size={64} />
                <strong>{c.name}</strong>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}