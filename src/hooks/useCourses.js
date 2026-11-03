import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { studentApi } from '../api';

export default function useCourses(initialPage = 1) {
  const [courses, setCourses] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError('');

        const res = await studentApi.get('/courses/', {
          params: { page },
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;

        if (res.data && Array.isArray(res.data.results)) {
          setCourses(res.data.results);
          setCount(res.data.count ?? res.data.results.length);
          setNext(res.data.next ?? null);
          setPrevious(res.data.previous ?? null);
        } else if (Array.isArray(res.data)) {
          setCourses(res.data);
          setCount(res.data.length);
          setNext(null);
          setPrevious(null);
        } else {
          setCourses([]);
          setCount(0);
        }
      } catch (err) {
        if (axios.isCancel(err) || controller.signal.aborted) return;
        setError(err.message || 'Failed to load courses.');
        setCourses([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, attempt]);

  const reload = useCallback(() => setAttempt((a) => a + 1), []);
  const isEmpty = !loading && !error && courses.length === 0;

  return {
    courses,
    count,
    next,
    previous,
    page,
    setPage,
    loading,
    error,
    isEmpty,
    reload,
  };
}
