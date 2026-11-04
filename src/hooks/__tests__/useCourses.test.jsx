import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import useCourses from '../useCourses';

describe('useCourses hook', () => {
  it('handles initial loading state and successful paginated course load', async () => {
    server.use(
      http.get('/api/student/courses/', ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page') || '1';
        return HttpResponse.json({
          count: 2,
          next: null,
          previous: null,
          results: [
            { id: 'c1', title: `Course 1 on page ${page}` },
            { id: 'c2', title: `Course 2 on page ${page}` },
          ],
        });
      }),
    );

    const { result } = renderHook(() => useCourses());

    // Initially loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('');
    expect(result.current.courses).toHaveLength(2);
    expect(result.current.courses[0].title).toBe('Course 1 on page 1');
    expect(result.current.count).toBe(2);
    expect(result.current.isEmpty).toBe(false);
  });

  it('handles empty state properly', async () => {
    server.use(
      http.get('/api/student/courses/', () => {
        return HttpResponse.json({
          count: 0,
          next: null,
          previous: null,
          results: [],
        });
      }),
    );

    const { result } = renderHook(() => useCourses());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('');
    expect(result.current.courses).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.isEmpty).toBe(true);
  });

  it('handles error states', async () => {
    server.use(
      http.get('/api/student/courses/', () => {
        return new HttpResponse(
          JSON.stringify({ detail: 'Internal server failure' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );

    const { result } = renderHook(() => useCourses());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeTruthy();
    expect(result.current.courses).toEqual([]);
    expect(result.current.isEmpty).toBe(false);
  });

  it('handles 401 unauthenticated response', async () => {
    server.use(
      http.get('/api/student/courses/', () => {
        return new HttpResponse(
          JSON.stringify({ detail: 'Authentication credentials were not provided.' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } },
        );
      }),
    );

    const { result } = renderHook(() => useCourses());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeTruthy();
    expect(result.current.courses).toEqual([]);
  });

  it('handles pagination navigation and reload', async () => {
    let capturedPage = null;
    server.use(
      http.get('/api/student/courses/', ({ request }) => {
        const url = new URL(request.url);
        capturedPage = url.searchParams.get('page');
        return HttpResponse.json({
          count: 20,
          next: 'http://localhost/api/student/courses/?page=3',
          previous: 'http://localhost/api/student/courses/?page=1',
          results: [{ id: 'c3', title: `Course on page ${capturedPage}` }],
        });
      }),
    );

    const { result } = renderHook(() => useCourses(1));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(capturedPage).toBe('1');

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => expect(capturedPage).toBe('2'));
    expect(result.current.courses[0].title).toBe('Course on page 2');
    expect(result.current.next).toBe('http://localhost/api/student/courses/?page=3');
    expect(result.current.previous).toBe('http://localhost/api/student/courses/?page=1');
  });
});

