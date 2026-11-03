import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
  server.resetHandlers();
  // Clear cookies in jsdom
  document.cookie = '';
});
afterAll(() => server.close());
