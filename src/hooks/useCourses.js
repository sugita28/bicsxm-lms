import { useCallback, useEffect, useState } from 'react';

export default function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError('');

        // Later, swap this for your real API URL
        const res = await fetch('/data/courses.json', { signal: controller.signal });
        if (!res.ok) throw new Error('Could not load the courses. Please try again.');
        const data = await res.json();

        if (controller.signal.aborted) return;
        setCourses(data);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => setAttempt((a) => a + 1), []);

  return { courses, loading, error, reload };
}