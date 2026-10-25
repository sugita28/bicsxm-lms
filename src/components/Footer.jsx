import { Link } from 'react-router-dom';
import { site } from '../siteConfig.js';
import logo from '../assets/logo.png';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.panel}>
          <div>
            <div className={styles.brand}>
              <img src={logo} alt="" className={styles.logo} />
              <span>{site.name}</span>
            </div>
            <p className={styles.tagline}>{site.tagline}</p>
          </div>

          <div>
            <h2 className={styles.heading}>Pages</h2>
            <ul className={styles.list}>
              {site.nav.map((item) => (
                <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Portals</h2>
            <ul className={styles.list}>
              <li><Link to="/student/login">Student Login</Link></li>
              <li><Link to="/teacher/login">Instructor Login</Link></li>
              <li><Link to="/admin/login">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Get in touch</h2>
            <ul className={styles.list}>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><Link to="/contact">Send us a message</Link></li>
            </ul>
          </div>
        </div>

        <p className={styles.legal}>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}