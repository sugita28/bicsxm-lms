import { Link } from 'react-router-dom';
import useCourses from '../hooks/useCourses.js';
import usePageTitle from '../hooks/usePageTitle.js';
import CourseCard from '../components/CourseCard.jsx';
import Reveal from '../components/Reveal.jsx';
import styles from './Home.module.css';
import DcitBanner from '../components/DcitBanner.jsx';

const steps = [
  {
    title: 'Teachers set up the course',
    text: 'Add lessons, notes and videos, then set due dates for assignments and quizzes.',
  },
  {
    title: 'Students work at their own pace',
    text: 'Each student sees what is next, what is late and what is done, on a phone or a laptop.',
  },
  {
    title: 'Progress stays visible',
    text: 'Grades and completion update as work comes in, so nobody waits until the end of term to find out how it is going.',
  },
];

const features = [
  'Course pages with lessons, files and video',
  'Assignments with deadlines and written feedback',
  'Quizzes that mark themselves',
  'Announcements to a whole class at once',
  'A progress and grade overview for every student',
  'Separate accounts for students, teachers and administrators',
];

export default function Home() {
  usePageTitle('');
  const { courses, loading, error } = useCourses();
  const featured = courses.slice(0, 3);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className={`container ${styles.hero}`}>
        <div>
          <p className="eyebrow anim-up">Learning management system</p>
          <h1 className={`${styles.title} anim-up`} style={{ '--d': '0.08s' }}>
            Classes, assignments and grades in one calm place.
          </h1>
          <p className={`${styles.lead} anim-up`} style={{ '--d': '0.16s' }}>
            BICSXM builds learning software for schools and training centres.
            Teachers post the work, students hand it in, and everyone can see
            where they stand.
          </p>
          <div className={`${styles.actions} anim-up`} style={{ '--d': '0.24s' }}>
            <Link to="/login" className="btn btn--primary">Log In</Link>
            <Link to="/signup" className="btn btn--soft">Create Account</Link>
            <Link to="/courses" className="btn btn--soft">Browse courses</Link>
          </div>
        </div>

        {/* Decorative illustration of the student view */}
        <div className={`${styles.stage} anim-up`} style={{ '--d': '0.2s' }} aria-hidden="true">
          <span className={styles.blobA} />
          <span className={styles.blobB} />

          <div className={styles.glass}>
            <p className={styles.glassLabel}>Week 3 of 5</p>
            <h2 className={styles.glassTitle}>Python for Beginners</h2>

            <div className={styles.dialRow}>
              <div className={styles.dial} style={{ '--p': 60 }}>
                <span className={styles.dialValue}>60%</span>
              </div>
              <p className={styles.dialText}>Course progress</p>
            </div>

            <ul className={styles.tasks}>
              <li className={styles.task}>
                <span className={`${styles.check} ${styles.checkDone}`} />
                Lesson 12: Loops
                <span className={styles.taskMeta}>Done</span>
              </li>
              <li className={styles.task}>
                <span className={styles.check} />
                Quiz: Functions
                <span className={styles.taskMeta}>Due Fri</span>
              </li>
              <li className={styles.task}>
                <span className={styles.check} />
                Assignment 3
                <span className={styles.taskMeta}>Draft</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="container section">
        <Reveal>
          <div className={styles.head}>
            <p className="eyebrow">How it works</p>
            <h2>How a class runs on BICSXM</h2>
          </div>
        </Reveal>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100}>
              <div className={styles.step}>
                <span className={styles.stepNo}>{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- What's inside ---------- */}
      <section className="container section">
        <div className={styles.inside}>
          <Reveal>
            <div className={styles.head}>
              <p className="eyebrow">What is inside</p>
              <h2>Everything a course needs, nothing it does not</h2>
              <p>
                We keep the feature list short on purpose. These are the parts
                teachers and students use every week.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ul className={styles.featureList}>
              {features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      
      {/* ---------- DCIT banner ---------- */}
      <DcitBanner />

    

      {/* ---------- Featured courses ---------- */}
      <section className="container section">
        <div className={styles.rowHead}>
          <div className={styles.head}>
            <p className="eyebrow">Courses</p>
            <h2>Start with one of these</h2>
          </div>
          <Link to="/courses" className="btn btn--soft">All courses</Link>
        </div>

        {error && <p className={styles.note}>Courses are unavailable right now.</p>}

        <div className={styles.courses}>
          {loading && Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" />)}
          {featured.map((course, i) => (
            <Reveal key={course.id} delay={i * 100}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- Call to action ---------- */}
      <section className={`container ${styles.ctaWrap}`}>
        <span className={styles.ctaBlobA} aria-hidden="true" />
        <span className={styles.ctaBlobB} aria-hidden="true" />
        <Reveal>
          <div className={styles.cta}>
            <h2>Want this for your school or training centre?</h2>
            <p>
              Tell us how many students you teach and what you use today. We
              will reply with how BICSXM could fit.
            </p>
            <Link to="/contact" className="btn btn--primary">Contact us</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}