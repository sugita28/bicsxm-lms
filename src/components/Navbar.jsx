import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { site } from '../siteConfig.js';
import logo from '../assets/logo.png';
import { useAuthStore } from '../store/authStore.js';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const navigate = useNavigate();

  const student = useAuthStore((state) => state.student);
  const teacher = useAuthStore((state) => state.teacher);
  const admin = useAuthStore((state) => state.admin);
  const logout = useAuthStore((state) => state.logout);

  // Check if any role is active
  const activeRole = admin.user
    ? 'admin'
    : teacher.user
    ? 'teacher'
    : student.user
    ? 'student'
    : null;

  const currentUser = activeRole ? { student, teacher, admin }[activeRole]?.user : null;

  const handleLogout = async (roleToLogout) => {
    await logout(roleToLogout);
    close();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <header className={styles.header}>
      <div className="container">
        <nav className={styles.nav} aria-label="Main">
          <Link to="/" className={styles.brand} onClick={close}>
            <img src={logo} alt="" className={styles.logo} />
            <span>{site.name}</span>
          </Link>

          <button
            className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`${styles.navContent} ${open ? styles.navContentOpen : ''}`}>
            <ul className={styles.links}>
              {site.nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} className={linkClass} onClick={close}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className={styles.authGroup}>
              {activeRole ? (
                <div className={styles.userMenu}>
                  <Link
                    to={`/${activeRole}/dashboard`}
                    className={styles.dashboardBtn}
                    onClick={close}
                  >
                    <span className={styles.roleBadge}>{activeRole}</span>
                    <span>{currentUser?.full_name?.split(' ')[0] || 'Dashboard'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleLogout(activeRole)}
                    className={styles.logoutBtn}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className={styles.authBtns}>
                  <Link to="/login" className={styles.loginBtn} onClick={close}>
                    Log In
                  </Link>
                  <Link to="/signup" className={styles.signupBtn} onClick={close}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}