import { Link } from 'react-router-dom';
import styles from './CourseCard.module.css';

// "Web Development Basics" -> "WD"
const initials = (title) =>
  title
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export default function CourseCard({ course }) {
  return (
    <Link to={`/courses/${course.id}`} className={styles.card}>
      <div className={styles.top}>
        <span
          className={styles.tile}
          style={{ '--tile': `var(--tone-${course.id % 5})` }}
          aria-hidden="true"
        >
          {initials(course.title)}
        </span>
        <span className={styles.level}>{course.level}</span>
      </div>

      <div>
        <p className="eyebrow">{course.category}</p>
        <h3 className={styles.title}>{course.title}</h3>
      </div>

      <p className={styles.summary}>{course.summary}</p>

      <div className={styles.meta}>
        <span>{course.duration} · {course.lessons} lessons</span>
        <span className={styles.more}>View →</span>
      </div>
    </Link>
  );
}