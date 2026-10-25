import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.js';
import styles from './NotFound.module.css';

export default function NotFound() {
  usePageTitle('Page not found');

  return (
    <section className={`container ${styles.wrap}`}>
      <div className={styles.code} aria-hidden="true">404</div>
      <h1 className={styles.title}>This page does not exist.</h1>
      <p className={styles.text}>The link may be old, or the address was typed wrong.</p>
      <div className={styles.actions}>
        <Link to="/" className="btn btn--primary">Go home</Link>
        <Link to="/courses" className="btn btn--soft">See courses</Link>
      </div>
    </section>
  );
}