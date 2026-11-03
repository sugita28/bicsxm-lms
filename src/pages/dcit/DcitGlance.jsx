import { useEffect, useRef, useState } from 'react';
import styles from './DcitGlance.module.css';
import {
  BookIcon,
  BriefcaseIcon,
  CalendarClockIcon,
  CalendarIcon,
  CapIcon,
  ChartIcon,
  ClipboardIcon,
  CodeBracketsIcon,
  CodeWindowIcon,
  DatabaseIcon,
  FlagIcon,
  HandshakeIcon,
  HomeCoinsIcon,
  KanbanIcon,
  LaptopIcon,
  LayersIcon,
  LogicIcon,
  MapPinIcon,
  NetworkIcon,
  OfficeIcon,
  PenToolIcon,
  PhoneIcon,
  PythonIcon,
  TreeIcon,
  TrophyIcon,
} from './GlanceIcons.jsx';

// Each module has `about` and `topics`: edit these to match your real syllabus.
const steps = [
  {
    label: 'Semester 1',
    Icon: BookIcon,
    detail: {
      badge: 'Semester 1 of 3',
      title: 'Web & Mobile Foundations',
      progress: 1 / 3,
      modules: [
        {
          name: 'Web Development with Django and API',
          Icon: CodeWindowIcon,
          about: 'Build dynamic websites and web services using the Django framework, and expose data through APIs.',
          topics: ['Django project structure', 'Models and views', 'Templates', 'REST APIs'],
        },
        {
          name: 'Mobile Application Development',
          Icon: PhoneIcon,
          about: 'Design and build apps for mobile devices, from interface layout to publishing.',
          topics: ['App lifecycle', 'Screens and navigation', 'Device features', 'Testing and release'],
        },
        {
          name: 'Software Development with Agile',
          Icon: KanbanIcon,
          about: 'Plan and deliver software in short iterations using Agile methods and team tools.',
          topics: ['Scrum and Kanban', 'User stories', 'Sprint planning', 'Team collaboration'],
        },
        {
          name: 'Usability and Web Design',
          Icon: PenToolIcon,
          about: 'Create clear, accessible and attractive interfaces based on user needs.',
          topics: ['Layout and typography', 'Colour and accessibility', 'Wireframing', 'Usability testing'],
        },
        {
          name: 'Advance Database Design',
          Icon: DatabaseIcon,
          about: 'Design efficient, reliable databases and write advanced queries.',
          topics: ['Normalisation', 'Advanced SQL', 'Indexing', 'Transactions and security'],
        },
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
        {
          name: 'Foundation of Software Development',
          Icon: CodeBracketsIcon,
          about: 'Learn the core principles of programming and how software is planned, written and tested.',
          topics: ['Algorithms and logic', 'Variables and control flow', 'Functions', 'Debugging'],
        },
        {
          name: 'Foundation of Database Design',
          Icon: DatabaseIcon,
          about: 'Understand how data is organised and stored, and build your first relational databases.',
          topics: ['Tables and keys', 'ER diagrams', 'Basic SQL', 'Data integrity'],
        },
        {
          name: 'Computer Network and Communication',
          Icon: NetworkIcon,
          about: 'Explore how computers connect and communicate, and how networks are set up and secured.',
          topics: ['Network models', 'IP addressing', 'Protocols', 'Basic security'],
        },
        {
          name: 'Programming with Python',
          Icon: PythonIcon,
          about: 'Write practical programs in Python, one of the most widely used languages in industry.',
          topics: ['Syntax and data types', 'Loops and functions', 'Files and modules', 'Object-oriented basics'],
        },
        {
          name: 'Office Solution Development',
          Icon: OfficeIcon,
          about: 'Automate and improve everyday office work with spreadsheets, documents and macros.',
          topics: ['Advanced spreadsheets', 'Formulas and macros', 'Reports', 'Workflow automation'],
        },
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
        {
          name: 'Data Structure and Algorithm',
          Icon: TreeIcon,
          about: 'Learn how to organise data and choose efficient algorithms for real problems.',
          topics: ['Lists, stacks, queues', 'Trees and graphs', 'Searching and sorting', 'Complexity'],
        },
        {
          name: 'Discrete Mathematics',
          Icon: LogicIcon,
          about: 'The mathematical foundations behind computing, logic and problem solving.',
          topics: ['Logic and sets', 'Relations and functions', 'Combinatorics', 'Graph theory'],
        },
        {
          name: 'Data Science with Python',
          Icon: ChartIcon,
          about: 'Analyse and visualise data with Python to find patterns and support decisions.',
          topics: ['Data cleaning', 'Pandas and NumPy', 'Visualisation', 'Intro to modelling'],
        },
        {
          name: 'Capstone Project',
          Icon: TrophyIcon,
          highlight: true,
          about: 'Bring everything together in a final project you design, build and present.',
          topics: ['Project proposal', 'Development', 'Documentation', 'Final presentation'],
        },
        {
          name: 'Skills for Employment',
          Icon: HandshakeIcon,
          about: 'Prepare for the workplace with professional and interview skills.',
          topics: ['CV and portfolio', 'Interview practice', 'Teamwork and communication', 'Professional ethics'],
        },
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

// Edit the years to match your real pathway (these are placeholders)
const pathway = {
  degree: { label: "Full Bachelor's Degree", years: 4 },
  dcit: { label: 'DCIT + Credit Transfer', years: 3 },
  note: 'Time and tuition saved (varies by university)',
};
const yearsSaved = pathway.degree.years - pathway.dcit.years;

const benefits = [
  { text: 'Fewer Years of Overseas Fees', Icon: CalendarClockIcon },
  { text: 'Lower Living Costs Abroad', Icon: HomeCoinsIcon },
  { text: 'Start Affordably in Nepal', Icon: MapPinIcon },
];

export default function DcitGlance() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [openLabel, setOpenLabel] = useState(null);
  const [openSubject, setOpenSubject] = useState(null);

  const openStep = steps.find((s) => s.label === openLabel && s.detail);
  const subject = openStep?.detail.modules?.find((m) => m.name === openSubject);

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

  // Switching semester closes any open subject
  useEffect(() => {
    setOpenSubject(null);
  }, [openLabel]);

  // Escape: close the subject first, then the semester panel
  useEffect(() => {
    if (!openLabel) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (openSubject) setOpenSubject(null);
      else setOpenLabel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openLabel, openSubject]);

  // "Subject details" button: reveal the section and open Semester 1
  useEffect(() => {
    const open = () => {
      setInView(true);
      setOpenLabel((cur) => cur ?? 'Semester 1');
    };
    window.addEventListener('dcit:open-subjects', open);
    return () => window.removeEventListener('dcit:open-subjects', open);
  }, []);

  const toggle = (label) => setOpenLabel((cur) => (cur === label ? null : label));
  const toggleSubject = (name) => setOpenSubject((cur) => (cur === name ? null : name));

  return (
    <section
      id="subjects"
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

      {/* Semester detail panel */}
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
              const active = openSubject === m.name;
              return (
                <li
                  key={m.name}
                  className={`${styles.semModule} ${m.highlight ? styles.semModuleHot : ''} ${active ? styles.semModuleActive : ''}`}
                >
                  <button
                    type="button"
                    className={styles.semModuleBtn}
                    aria-pressed={active}
                    aria-controls="dcit-subject-info"
                    onClick={() => toggleSubject(m.name)}
                  >
                    <MIcon size={48} />
                    <span>{m.name}</span>
                    <small className={styles.semHint}>{active ? 'Hide info' : 'View info'}</small>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Subject info */}
          {subject && (
            <div
              key={subject.name}
              id="dcit-subject-info"
              className={styles.subjectInfo}
              role="region"
              aria-label={subject.name}
            >
              <div className={styles.subjectHead}>
                <span className={styles.subjectIcon}>
                  <subject.Icon size={40} />
                </span>
                <div>
                  <small className={styles.subjectEyebrow}>{openStep.detail.badge}</small>
                  <h4 className={styles.subjectName}>{subject.name}</h4>
                </div>
                <button
                  type="button"
                  className={styles.subjectClose}
                  onClick={() => setOpenSubject(null)}
                  aria-label="Close subject info"
                >
                  ✕
                </button>
              </div>

              <p className={styles.subjectAbout}>{subject.about}</p>

              <p className={styles.subjectLabel}>What you will learn</p>
              <ul className={styles.subjectTopics}>
                {subject.topics.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

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

      {/* Save time and money abroad */}
      <div className={styles.save}>
        <h3 className={styles.saveTitle}>Save Time and Money Abroad</h3>

        <div className={styles.compare}>
          {[pathway.degree, pathway.dcit].map((row, i) => (
            <div key={row.label} className={styles.barRow}>
              <div className={styles.barLabel}>
                <strong>{row.label}</strong>
                <span>{row.years} years</span>
              </div>
              <div className={styles.barTrack}>
                <span
                  className={`${styles.barFill} ${i === 1 ? styles.barFillAlt : ''}`}
                  style={{ '--w': `${(row.years / pathway.degree.years) * 100}%` }}
                />
              </div>
            </div>
          ))}

          <div className={styles.saved}>
            <span className={styles.savedArrow} aria-hidden="true">↕</span>
            <strong>{yearsSaved} {yearsSaved === 1 ? 'year' : 'years'} saved</strong>
            <span>{pathway.note}</span>
          </div>
        </div>

        <ul className={styles.benefits}>
          {benefits.map((b) => {
            const BIcon = b.Icon;
            return (
              <li key={b.text} className={styles.benefit}>
                <span className={styles.benefitIcon}>
                  <BIcon size={44} />
                </span>
                <strong>{b.text}</strong>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}