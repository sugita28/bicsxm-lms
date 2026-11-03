import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.js';
import useScrollReveal from '../../hooks/useScrollReveal.js';
import mainImage from '../../assets/dcit-maindiv.png';
import styles from './Dcit.module.css';
import DcitGlance from './DcitGlance.jsx';
import DcitAccreditation from './DcitAccreditation.jsx';
import DcitPathway from './DcitPathway.jsx';

// Accreditation logos (save these in src/assets)
import qsLogo from '../../assets/qualifications-scotland.png';
import scqfLogo from '../../assets/scqf-logo.png';
import eqfLogo from '../../assets/eqf-logo.png';

// "How it works" step images: change these names to match your files in src/assets
import step1Img from '../../assets/step1-image.png';
import step2Img from '../../assets/step2-image.png';
import step3Img from '../../assets/step3-image.png';

// Career images (transparent PNGs)
import softwareImg from '../../assets/software-icon.png';
import dataImg from '../../assets/data-icon.png';
import cyberImg from '../../assets/cyber-icon.png';
import pmImg from '../../assets/pm-icon.png';

// Pathway pictures (optional). To use your own college and gate images:
// 1) save them in src/assets  2) remove the // below  3) add the props on <DcitPathway />
// import collegeImg from '../../assets/dcit-college.png';
// import gateImg from '../../assets/dcit-gate.png';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'learn', label: 'Programmes' },
  { id: 'steps', label: 'How it works' },
];

const faqs = [
  {
    q: 'What is Qualifications Scotland (QS)?',
    a: ['Qualifications Scotland (QS) is not for profit Government Sponsored agency accountable to the Scottish Government and sits at the heart of Scotland’s world-renowned education system. QS has over 100 years of experience in developing qualifications and qualification systems across the globe. LCCI GQ is the first and only institution from Nepal to be approved by QS.'],
  },
  {
    q: 'What is the Scottish Credit & Qualifications Framework (SCQF)?',
    a: [
      'SCQF is a globally recognized national qualifications framework in the UK and is managed by the Scottish Credit and Qualifications Framework Partnership. In order to be on the SCQF, LCCI Global Qualifications have gone through a rigorous and quality-assured process of ‘credit rating’.',
      'The SCQF Partnership includes members from the Quality Assurance Agency for Higher Education (QAA), College Development Network, the Qualifications Scotland (QS), and Universities Scotland.',
    ],
  },
  {
    q: 'What are SCQF Credit and SCQF Level?',
    a: ['Through the credit rating process, LCCI Global Qualifications have received SCQF credit points, which show how much learning has been achieved, and an SCQF level which shows how demanding the learning is.'],
  },
  {
    q: 'What is European Qualifications Framework (EQF)?',
    a: ['EQF is a European-wide qualifications framework that joins the qualifications of different European countries. LCCI GQ qualifications are benchmarked against the EQF, making it easier for European employers to compare LCCI GQ programmes against their own framework.'],
  },
  {
    q: 'How can I verify the recognition of LCCI Global Qualifications programme?',
    a: ['Only qualifications that are SCQF credit-rated are listed on the SCQF database. You can use Weblink below and search by ‘LCCI Global Qualifications’ (as “Qualification Owner”) in order to verify the recognition of LCCI GQ programmes within the national qualifications framework of Scotland:'],
    link: { href: 'https://scqf.org.uk/the-framework/search-database/', label: 'scqf.org.uk/the-framework/search-database/' },
  },
];

const steps = [
  {
    title: 'Open a course',
    text: 'Pick DCIT and see what you will be able to do by the end.',
    image: step1Img,
  },
  {
    title: 'Follow the lessons',
    text: 'Study at your own pace on your phone or laptop.',
    image: step2Img,
  },
  {
    title: 'Hand in your work',
    text: 'Submit assignments and take quizzes.',
    image: step3Img,
  },
];

// Career paths data using images
const careers = [
  {
    role: 'Software Engineer',
    image: softwareImg,
    tag: 'Top Role',
    tagClass: styles.tagBlue,
    skills: ['React', 'Python', 'Full Stack'],
  },
  {
    role: 'Data Analyst',
    image: dataImg,
    tag: 'Fast Growing',
    tagClass: styles.tagGreen,
    skills: ['SQL', 'Data Vis', 'Python'],
  },
  {
    role: 'Cybersecurity Analyst',
    image: cyberImg,
    tag: 'High Demand',
    tagClass: styles.tagOrange,
    skills: ['Security', 'Networks', 'Linux'],
  },
  {
    role: 'IT Project Manager',
    image: pmImg,
    tag: 'Leadership',
    tagClass: styles.tagPurple,
    skills: ['Agile', 'Scrum', 'Planning'],
  },
];

export default function Dcit() {
  usePageTitle('Explore DCIT');

  // Every time DCIT is opened (click, back button, reload) start at the top.
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]);

  // Replay entrance animations every time an element enters the screen (up or down)
  useScrollReveal(location.key);

  // "Subject details" button: scroll to the semester component and open it
  const showSubjects = (e) => {
    e.preventDefault();
    document.getElementById('subjects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.dispatchEvent(new CustomEvent('dcit:open-subjects'));
  };

  return (
    <div className={`container section ${styles.page}`}>
      {/* Soft neumorphic background orbs (decorative) */}
      <div className={styles.bgOrbs} aria-hidden="true">
        <span className={`${styles.orb} ${styles.orbBlue}`} />
        <span className={`${styles.orb} ${styles.orbPeach}`} />
        <span className={`${styles.orb} ${styles.orbLavender}`} />
        <span className={`${styles.orb} ${styles.orbMint}`} />
      </div>

      <div className={styles.layout}>
        {/* LEFT: big card */}
        <aside className={styles.stage}>
          <div className={styles.hero}>
            <img className={styles.heroImage} src={mainImage} alt="Students learning in DCIT" />
            <div className={styles.heroShade} />
            <div className={styles.heroText}>
              <p className={styles.heroEyebrow} data-reveal>DCIT</p>
              <h1 className={styles.heroTitle} data-reveal style={{ '--d': '0.1s' }}>Explore DCIT</h1>
            </div>
          </div>

          <div className={styles.stageBody} data-reveal>
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
              <a href="#subjects" onClick={showSubjects} className={`btn btn--soft ${styles.arrowBtn}`}>
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
          {/* Card 1: Accreditation */}
          <section id="overview" className={styles.panel} data-reveal style={{ '--d': '0.1s' }}>
            <p className="eyebrow">Overview</p>
            <h2 className={styles.panelTitle}>Accreditation</h2>

            <div className={styles.quality}>
              <h3 className={styles.qualityTitle}>Quality Assured. Globally Benchmarked.</h3>

              <div className={`${styles.logoTile} ${styles.logoTileWide}`}>
                <img src={qsLogo} alt="Qualifications Scotland" />
              </div>

              <div className={styles.logoGrid}>
                <div className={styles.logoTile}>
                  <img src={scqfLogo} alt="SCQF – Scottish Credit and Qualifications Framework, Level 7" />
                </div>
                <div className={styles.logoTile}>
                  <img src={eqfLogo} alt="European Qualifications Framework, Level 5" />
                </div>
              </div>

              <p className={styles.qualityNote}>
                SCQF = Scottish Credit and Qualifications Framework | EQF = European Qualifications Framework
              </p>
            </div>
          </section>

          {/* Card 2: Programmes */}
          <section id="learn" className={styles.panel} data-reveal style={{ '--d': '0.2s' }}>
            <div className={styles.faq}>
              <h3 className={styles.faqHeading}>You may now be interested in knowing:</h3>
              <ol className={styles.faqList}>
                {faqs.map((f) => (
                  <li key={f.q} className={styles.faqItem}>
                    <h4 className={styles.faqQ}>{f.q}</h4>
                    {f.a.map((para) => (
                      <p key={para} className={styles.faqA}>{para}</p>
                    ))}
                    {f.link && (
                      <a href={f.link.href} target="_blank" rel="noopener noreferrer" className={styles.faqLink}>
                        {f.link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Card 3: How it works */}
          <section id="steps" className={styles.panel} data-reveal style={{ '--d': '0.3s' }}>
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

      {/* DCIT at a Glance: semesters, subjects, save time and money */}
      <DcitGlance key={location.key} />

      {/* Explore Career Paths */}
      <div className={styles.careersWrapper}>
        <div className={styles.bgDots} aria-hidden="true"></div>
        <div className={styles.bgWaveTeal} aria-hidden="true"></div>
        <div className={styles.bgWaveBlue} aria-hidden="true"></div>

        <div className={styles.careersHeader} data-reveal>
          <h2>Explore Career Paths</h2>
          <p>Discover the opportunities waiting for you after graduation.</p>
        </div>

        <div className={styles.careersGrid}>
          {careers.map((career, i) => (
            <div
              key={career.role}
              className={styles.careerCard}
              data-reveal
              style={{ '--d': `${i * 0.1}s` }}
            >
              <div className={styles.careerImageWrap}>
                <img src={career.image} alt={career.role} className={styles.careerImage} />
              </div>

              <h3 className={styles.careerRole}>{career.role}</h3>
              <span className={`${styles.careerTag} ${career.tagClass}`}>{career.tag}</span>

              <div className={styles.careerSkills}>
                {career.skills.map((skill) => (
                  <span key={skill} className={styles.skillPill}>{skill}</span>
                ))}
              </div>

              <a href="#" onClick={(e) => e.preventDefault()} className={styles.exploreLink}>
                Explore Role <span aria-hidden="true">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Accreditation: quality assurance and frameworks */}
      <DcitAccreditation key={location.key} />

      {/* Smarter Path: the shortcut and the 12+1 pathway, right under the accreditation graph */}
      <DcitPathway key={location.key} />
      {/* With your own pictures:
          <DcitPathway collegeImage={collegeImg} gateImage={gateImg} /> */}
    </div>
  );
}