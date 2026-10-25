import { LayoutDashboard, LogOut, Shield, Users } from 'lucide-react';
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

  // Poll or check pending teachers count for sidebar badge
  useEffect(() => {
    let mounted = true;
    async function checkPending() {
      try {
        const res = await adminApi.get('/teachers/?status=pending');
        if (mounted && Array.isArray(res.data)) {
          setPendingCount(res.data.length);
        }
      } catch {
        // Silent catch for background badge count
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

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div>
          <Link to="/admin/dashboard" className={styles.logoRow}>
            <div className={styles.logoIcon}>
              <Shield size={22} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.logoText}>LMS Admin</span>
              <span className={styles.adminPill}>Root</span>
            </div>
          </Link>

          <nav className={styles.navSection}>
            <span className={styles.navSectionTitle}>Navigation</span>

            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <div className={styles.navLeft}>
                <LayoutDashboard size={18} />
                <span>Dashboard Overview</span>
              </div>
            </NavLink>

            <NavLink
              to="/admin/dashboard/users"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <div className={styles.navLeft}>
                <Users size={18} />
                <span>User Management</span>
              </div>
              {pendingCount > 0 && (
                <span className={styles.badge} title={`${pendingCount} pending instructor approvals`}>
                  {pendingCount}
                </span>
              )}
            </NavLink>
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
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
