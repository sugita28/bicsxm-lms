import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const roleLabels = {
  student: { label: 'Student Portal', badgeClass: styles.badgeStudent },
  teacher: { label: 'Instructor Portal', badgeClass: styles.badgeTeacher },
  admin: { label: 'Administrative Portal', badgeClass: styles.badgeAdmin },
};

/**
 * Centered card layout for authentication flows (Login, Signup, Verify, Reset).
 *
 * @param {Object} props
 * @param {('student'|'teacher'|'admin')} [props.role='student']
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.footer]
 */
export default function AuthLayout({
  role = 'student',
  title,
  subtitle,
  children,
  footer,
}) {
  const roleConfig = roleLabels[role.toLowerCase()] || roleLabels.student;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.blob1} aria-hidden="true" />
      <div className={styles.blob2} aria-hidden="true" />

      <main className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logoRow}>
            <div className={styles.logoIcon}>
              <BookOpen size={20} />
            </div>
            <span className={styles.logoText}>LMS Academy</span>
          </Link>

          <div>
            <span className={`${styles.roleBadge} ${roleConfig.badgeClass}`}>
              {roleConfig.label}
            </span>
          </div>

          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        {children}

        {footer && <div className={styles.footerLinks}>{footer}</div>}

        <div style={{ textAlign: 'center' }}>
          <Link to="/" className={styles.backHome}>
            <ArrowLeft size={16} /> Back to LMS Home
          </Link>
        </div>
      </main>
    </div>
  );
}
