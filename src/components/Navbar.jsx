import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { site } from '../siteConfig.js';
import logo from '../assets/logo.png';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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

          <ul className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
            {site.nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass} onClick={close}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}