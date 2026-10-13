import { Link, useParams } from 'react-router-dom';
import useCourses from '../hooks/useCourses.js';
import usePageTitle from '../hooks/usePageTitle.js';
import CourseCard from '../components/CourseCard.jsx';
import styles from './CourseDetail.module.css';

const initials = (title) =>
  title
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export default function CourseDetail() {
  const { courseId } = useParams(); // from the URL: /courses/:courseId
  const { courses, loading, error, reload } = useCourses();

  const course = courses.find((c) => String(c.id) === courseId);
  usePageTitle(course ? course.title : 'Course');

  if (loading) {
    return (
      <div className="container">
        <div className={`skeleton ${styles.pageSkeleton}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.state}>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={reload}>Try again</button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container">
        <div className={styles.state}>
          <h1>Course not found</h1>
          <p>We could not find a course with that address.</p>
          <Link to="/courses" className="btn btn--primary">Back to courses</Link>
        </div>
      </div>
    );
  }

  const related = courses
    .filter((c) => c.category === course.category && c.id !== course.id)
    .slice(0, 3);

  const facts = [
    ['Category', course.category],
    ['Level', course.level],
    ['Duration', course.duration],
    ['Lessons', course.lessons],
    ['Instructor', course.instructor],
  ];

  return (
    <div className="container">
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link to="/courses">Courses</Link>
        <span aria-hidden="true">/</span>
        <span>{course.title}</span>
      </nav>

      <header className={styles.head}>
        <span
          className={styles.tile}
          style={{ '--tile': `var(--tone-${course.id % 5})` }}
          aria-hidden="true"
        >
          {initials(course.title)}
        </span>
        <div>
          <p className="eyebrow">{course.category}</p>
          <h1 className={styles.title}>{course.title}</h1>
          <p className={styles.summary}>{course.summary}</p>
        </div>
      </header>

      <div className={styles.layout}>
        <section>
          <h2 className={styles.sectionTitle}>What you will be able to do</h2>
          <ul className={styles.outcomes}>
            {course.outcomes.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <aside className={styles.aside}>
          <h2 className={styles.asideTitle}>Course details</h2>
          <dl className={styles.facts}>
            {facts.map(([label, value]) => (
              <div key={label} className={styles.fact}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <Link
            to={`/contact?course=${encodeURIComponent(course.title)}`}
            className={`btn btn--primary ${styles.fullBtn}`}
          >
            Ask about this course
          </Link>
        </aside>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.sectionTitle}>More in {course.category}</h2>
          <div className={styles.relatedGrid}>
            {related.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </section>
      )}
    </div>
  );
}