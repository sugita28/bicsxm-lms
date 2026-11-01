import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.js';
import mainImage from '../../assets/dcit-maindiv.png';
import styles from './Dcit.module.css';
import DcitGlance from './DcitGlance.jsx';

// To use a second picture, add the file to src/assets, for example
// dcit-campus.png, then replace the line below with:
// import storyImage from '../../assets/dcit-campus.png';
const storyImage = mainImage;

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'learn', label: 'Programmes' },
  { id: 'steps', label: 'How it works' },
];

// Edit these numbers and labels to match your college
const stats = [
  { value: '24/7', label: 'Study access' },
  { value: '100%', label: 'Online' },
  { value: 'Auto', label: 'Quiz marking' },
  { value: 'Live', label: 'Progress' },
];

const programmes = [
  { name: 'Diploma in Computing and IT (18 Months)', scqf: 7, credit: 139, eqf: 5 },
  { name: 'Professional Diploma in Animation (18 Months)', scqf: 7, credit: 124, eqf: 5 },
  { name: 'Foundation Diploma in Computing & IT (6 Months)', scqf: 7, credit: 45, eqf: 5 },
  { name: 'Certificate in Computing & IT (3 Months)', scqf: 7, credit: 18, eqf: 5 },
  { name: 'Certificate in Data Science and Analytics (3 Months)', scqf: 7, credit: 18, eqf: 5 },
];

const steps = [
  { title: 'Open a course', text: 'Pick DCIT and see what you will be able to do by the end.', image: mainImage },
  { title: 'Follow the lessons', text: 'Study at your own pace on your phone or laptop.', image: storyImage },
  { title: 'Hand in your work', text: 'Submit assignments and take quizzes.', image: mainImage },
];

export default function Dcit() {
  usePageTitle('Explore DCIT');

  return (
    <div className={`container section ${styles.page}`}>
      <div className={styles.layout}>
        {/* LEFT: big card */}
        <aside className={styles.stage}>
          <div className={styles.hero}>
            <img className={styles.heroImage} src={mainImage} alt="Students learning in DCIT" />
            <div className={styles.heroShade} />
            <div className={styles.heroText}>
              <p className={`${styles.heroEyebrow} anim-up`}>DCIT</p>
              <h1 className={`${styles.heroTitle} anim-up`} style={{ '--d': '0.1s' }}>Explore DCIT</h1>
            </div>
          </div>

          <div className={styles.stageBody}>
            <h2 className={styles.stageTitle}>Why choose DCIT?</h2>

            <div className={styles.copy}>
              <p className={styles.text}>
                The aim of the Diploma in Computing and IT qualification is to prepare
                students for a rewarding and successful career in the Computing and IT
                Industry by preparing students with the theory, knowledge, industry skills,
                technology, and professionalism essential to take the first step and
                subsequently transition into the workplace or the prospect to pursue their
                higher studies.
              </p>

              <p className={styles.text}>
                Upon completion of the course, the students will be well versed in the
                computing industry and will be able to work independently and even
                supervise to some extent in the area of Software development, database
                design, using Python for programming, web designing, computer networking,
                using agile for software development, web development through the use of
                Django and API. The students will also be able to demonstrate the skills
                learned during the program and will have the required soft skills to
                utilize the knowledge and skills about Computing and IT in the workplace.
              </p>
            </div>

            <nav className={styles.tabs} aria-label="DCIT sections">
              {tabs.map((t) => (
                <a key={t.id} href={`#${t.id}`} className={styles.tab}>
                  {t.label}
                </a>
              ))}
            </nav>

            <div className={styles.actions}>
              <Link to="/signup" className="btn btn--primary">Enroll now</Link>
              <a href="#overview" className={`btn btn--soft ${styles.arrowBtn}`}>
                Subject details
                <span className={styles.arrow} aria-hidden="true">→</span>
              </a>
            </div>

            <Link to="/" className={styles.backLink}>
              <span className={styles.backArrow} aria-hidden="true">←</span>
              Back to LMS home
            </Link>
          </div>
        </aside>

        {/* RIGHT: three cards */}
        <div className={styles.pages}>
          {/* Card 1: Overview */}
          <section id="overview" className={styles.panel} style={{ '--d': '0.1s' }}>
            <p className="eyebrow">Overview</p>
            <h2 className={styles.panelTitle}>DCIT at a glance</h2>

            <ul className={styles.stats}>
              {stats.map((s) => (
                <li key={s.label} className={styles.stat}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>

            <img className={styles.panelImage} src={storyImage} alt="DCIT students" />
            <p className={styles.text}>
              prospect to pursue their higher studies
            </p>
          </section>

          {/* Card 2: Programmes table */}
          <section id="learn" className={styles.panel} style={{ '--d': '0.2s' }}>
            <p className="eyebrow">Programmes</p>
            <h2 className={styles.panelTitle}>Qualifications offered</h2>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Programme</th>
                    <th scope="col" className={styles.num}>SCQF Level</th>
                    <th scope="col" className={styles.num}>SCQF Credit Point</th>
                    <th scope="col" className={styles.num}>EQF Level</th>
                  </tr>
                </thead>
                <tbody>
                  {programmes.map((p) => (
                    <tr key={p.name}>
                      <th scope="row">{p.name}</th>
                      <td className={styles.num}>{p.scqf}</td>
                      <td className={styles.num}>{p.credit}</td>
                      <td className={styles.num}>{p.eqf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Card 3 */}
          <section id="steps" className={styles.panel} style={{ '--d': '0.3s' }}>
            <p className="eyebrow">How it works</p>
            <h2 className={styles.panelTitle}>Three simple steps</h2>
            <ul className={styles.steps}>
              {steps.map((s, i) => (
                <li key={s.title} className={styles.step}>
                  <img className={styles.stepImage} src={s.image} alt="" />
                  <div>
                    <span className={styles.stepNum}>Step {i + 1}</span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* BOTTOM: DCIT at a Glance timeline, above the footer */}
      <DcitGlance />
    </div>
  );
}