import { http, HttpResponse } from 'msw';

export const handlers = [
  // Student ping
  http.get('/api/student/dashboard/ping/', () => {
    return HttpResponse.json({ role: 'student', message: 'pong' });
  }),

  // Student refresh
  http.post('/api/student/auth/token/refresh/', () => {
    return HttpResponse.json({ status: 'ACTIVE', scope: 'full' });
  }),

  // Teacher ping
  http.get('/api/teacher/dashboard/ping/', () => {
    return HttpResponse.json({ role: 'teacher', message: 'pong' });
  }),

  // Admin ping
  http.get('/api/admin/dashboard/ping/', () => {
    return HttpResponse.json({ role: 'admin', message: 'pong' });
  }),
];
