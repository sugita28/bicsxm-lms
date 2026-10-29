import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import styles from './DcitBanner.module.css';
import dcitImage from '../assets/dcit-courses.png';

const topics = ['Lessons', 'Assignments', 'Quizzes', 'Progress tracking'];

const highlights = [
  'Structured lessons with notes, files and video',
  'Assignments with deadlines and written feedback',
  'Quizzes that mark themselves',
  'Grades and progress you can check any time',
];

export default function DcitBanner() {
  return (
    <section className="container section">
      <Reveal>
        <div className={styles.banner}>
          <span className={styles.orb} aria-hidden="true" />

          <div className={styles.content}>
            <p className="eyebrow">DCIT</p>
            <h2 className={styles.title}>Explore DCIT courses</h2>
            <p className={styles.text}>
              Everything you need to study DCIT is in one place. Open a course,
              follow the lessons in order, hand in your work and see your
              results as they come in.
            </p>
            <p className={styles.text}>
              Study on your phone or laptop, at your own pace, and always know
              what to do next.
            </p>

            <ul className={styles.highlights}>
              {highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <ul className={styles.chips}>
              {topics.map((t) => (
                <li key={t} className={styles.chip}>{t}</li>
              ))}
            </ul>

            <Link to="/courses" className={`btn btn--primary ${styles.cta}`}>
              Explore DCIT
            </Link>
          </div>

          <div className={styles.media}>
            <img
              className={styles.image}
              src={dcitImage}
              alt="Students learning in a DCIT course"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}