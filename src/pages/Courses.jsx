import { useSearchParams } from 'react-router-dom';
import useCourses from '../hooks/useCourses.js';
import usePageTitle from '../hooks/usePageTitle.js';
import CourseCard from '../components/CourseCard.jsx';
import Reveal from '../components/Reveal.jsx';
import styles from './Courses.module.css';

export default function Courses() {
  usePageTitle('Courses');
  const { courses, loading, error, reload } = useCourses();

  // Filters live in the URL: /courses?category=Design&q=canva
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const search = params.get('q') || '';

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'All') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const categories = ['All', ...new Set(courses.map((c) => c.category))];

  const filtered = courses.filter((c) => {
    const matchesCategory = category === 'All' || c.category === category;
    const text = `${c.title} ${c.summary} ${c.instructor}`.toLowerCase();
    return matchesCategory && text.includes(search.trim().toLowerCase());
  });

  return (
    <div className="container">
      <header className={styles.header}>
        <p className="eyebrow anim-up">Courses</p>
        <h1 className="anim-up" style={{ '--d': '0.08s' }}>Pick something to learn</h1>
        <p className={`${styles.sub} anim-up`} style={{ '--d': '0.16s' }}>
          Short, practical courses. Open one to see what you will be able to do by the end.
        </p>
      </header>

      {!loading && !error && (
        <div className={styles.controls}>
          <input
            className={styles.search}
            type="search"
            placeholder="Search by course, topic or instructor"
            aria-label="Search courses"
            value={search}
            onChange={(e) => update('q', e.target.value)}
          />

          <div className={styles.filters}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filter} ${category === cat ? styles.filterActive : ''}`}
                onClick={() => update('category', cat)}
                aria-pressed={category === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" />)}
        </div>
      )}

      {error && (
        <div className={styles.state}>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={reload}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className={styles.count} aria-live="polite">
            {filtered.length} of {courses.length} courses
          </p>

          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.map((course, i) => (
                <Reveal key={course.id} delay={(i % 3) * 90}>
                  <CourseCard course={course} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className={styles.state}>
              <p>No courses match that search.</p>
              <button
                className="btn btn--soft"
                onClick={() => setParams({}, { replace: true })}
              >
                Clear filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}