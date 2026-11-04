import {
  Award,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  GraduationCap,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  MapPin,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import { useAuthStore } from '../../store/authStore';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state.admin || {});
  const logout = useAuthStore((state) => state.logout);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function checkPending() {
      try {
        const res = await adminApi.get('/teachers/?status=pending');
        if (mounted && Array.isArray(res.data)) {
          setPendingCount(res.data.length);
        }
      } catch {
        // Quiet catch for badge
      }
    }
    checkPending();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout('admin');
    navigate('/admin/login');
  };

  const navItem = (to, icon, label, badge = null, end = false) => (
    <NavLink
      key={to}
      to={to}
      end={end}
      className={({ isActive }) =>
        `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
      }
    >
      <div className={styles.navLeft}>
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className={styles.badge} title={badge.title}>
          {badge.count}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <Link to="/admin/dashboard" className={styles.logoRow}>
            <div className={styles.logoIcon}>
              <Shield size={22} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.logoText}>LMS Admin</span>
              <span className={styles.adminPill}>Root</span>
            </div>
          </Link>

          <div className={styles.sidebarNavScroll}>
            {/* Overview */}
            <nav className={styles.navSection} style={{ marginBottom: '1.25rem' }}>
              <span className={styles.navSectionTitle}>Overview</span>
              {navItem('/admin/dashboard', <LayoutDashboard size={18} />, 'Dashboard', null, true)}
            </nav>

            {/* Academics */}
            <nav className={styles.navSection} style={{ marginBottom: '1.25rem' }}>
              <span className={styles.navSectionTitle}>Academics</span>
              {navItem('/admin/dashboard/programmes', <Award size={18} />, 'Programmes')}
              {navItem('/admin/dashboard/batches', <Layers size={18} />, 'Batches')}
              {navItem('/admin/dashboard/semesters', <BookOpen size={18} />, 'Semesters')}
              {navItem('/admin/dashboard/subjects', <BookOpen size={18} />, 'Subjects')}
              {navItem('/admin/dashboard/teaching-assignments', <UserCheck size={18} />, 'Teacher Assignments')}
            </nav>

            {/* Students */}
            <nav className={styles.navSection} style={{ marginBottom: '1.25rem' }}>
              <span className={styles.navSectionTitle}>Students</span>
              {navItem('/admin/dashboard/students', <GraduationCap size={18} />, 'Students')}
              {navItem('/admin/dashboard/enrollments', <CheckSquare size={18} />, 'Enrollments')}
            </nav>

            {/* Schedule & Calendar */}
            <nav className={styles.navSection} style={{ marginBottom: '1.25rem' }}>
              <span className={styles.navSectionTitle}>Schedule</span>
              {navItem('/admin/dashboard/timetable', <Clock size={18} />, 'Timetable Slots')}
              {navItem('/admin/dashboard/holidays', <MapPin size={18} />, 'Holidays')}
              {navItem('/admin/dashboard/calendar', <Calendar size={18} />, 'Academic Calendar')}
            </nav>

            {/* Operations */}
            <nav className={styles.navSection} style={{ marginBottom: '1.25rem' }}>
              <span className={styles.navSectionTitle}>Operations</span>
              {navItem('/admin/dashboard/attendance', <CheckSquare size={18} />, 'Attendance')}
              {navItem('/admin/dashboard/progress', <TrendingUp size={18} />, 'Progress Tracking')}
            </nav>

            {/* System */}
            <nav className={styles.navSection}>
              <span className={styles.navSectionTitle}>System</span>
              {navItem(
                '/admin/dashboard/users',
                <Users size={18} />,
                'User Accounts',
                pendingCount > 0
                  ? { count: pendingCount, title: `${pendingCount} pending instructor approvals` }
                  : null
              )}
              {navItem('/admin/dashboard/audit-logs', <History size={18} />, 'Audit Trail')}
            </nav>
          </div>

          <div className={styles.sidebarFooter}>
            <div className={styles.adminUserCard}>
              <div className={styles.adminInfo}>
                <p className={styles.adminName}>{user?.full_name || 'Super Admin'}</p>
                <p className={styles.adminEmail}>{user?.email || 'admin@lms.local'}</p>
              </div>
            </div>

            <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
