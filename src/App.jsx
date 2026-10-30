import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import NotFound from './pages/NotFound.jsx';
import adminRoutes from './routes/adminRoutes.jsx';
import publicRoutes from './routes/publicRoutes.jsx';
import studentRoutes from './routes/studentRoutes.jsx';
import teacherRoutes from './routes/teacherRoutes.jsx';
import { useAuthStore } from './store/authStore';

export default function App() {
  const hydrateAll = useAuthStore((state) => state.hydrateAll);

  useEffect(() => {
    // Hydrate existing sessions across student, teacher, and admin on load
    hydrateAll();
  }, [hydrateAll]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        {publicRoutes}
        {studentRoutes}
        {teacherRoutes}
        {adminRoutes}

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}