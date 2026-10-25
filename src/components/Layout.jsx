import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const { pathname } = useLocation();

  // Start at the top whenever the page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      {/* key replays the page animation on each route change */}
      <main id="main" key={pathname} className="page">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}