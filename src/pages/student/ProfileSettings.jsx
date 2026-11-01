import {
  ArrowLeft,
  AtSign,
  Camera,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Headphones,
  KeyRound,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { studentApi } from '../../api';
import StatusBadge from '../../components/auth/StatusBadge';
import { useAuthStore } from '../../store/authStore';
import styles from './ProfileSettings.module.css';

const USERNAME_RE = /^[A-Za-z0-9_]{3,30}$/;
const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

function Avatar({ src, size }) {
  const box = { width: size, height: size };
  if (src) {
    return <img className={styles.avatar} style={box} src={src} alt="Profile" />;
  }
  return (
    <div className={styles.avatar} style={box}>
      <User size={size * 0.46} />
    </div>
  );
}

function PasswordField({ id, label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <div className={styles.inputWrap}>
        <KeyRound size={17} className={styles.icon} />
        <input
          id={id}
          className={styles.input}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className={styles.eye}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { user, status } = useAuthStore((state) => state.student || {});
  const logout = useAuthStore((state) => state.logout);

  const [section, setSection] = useState('account');

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Keep the form in step with the store (for example after a save)
  useEffect(() => {
    setFullName(user?.full_name || '');
    setUsername(user?.username || '');
  }, [user?.full_name, user?.username]);

  // Free the temporary preview URL when it changes or the page closes
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const trimmedName = fullName.trim();
  const trimmedUsername = username.trim();
  const usernameValid = USERNAME_RE.test(trimmedUsername);
  const usernameInvalid = trimmedUsername.length > 0 && !usernameValid;
  const dirty =
    trimmedName !== (user?.full_name || '') ||
    trimmedUsername !== (user?.username || '') ||
    Boolean(photoFile);

  const strength = getStrength(newPassword);
  const mismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;
  const shownPhoto = photoPreview || user?.avatar || '';

  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setSection('account');
  };

  const saveProfile = async () => {
    if (!trimmedName) {
      toast.error('Please enter your account name.');
      return;
    }
    if (usernameInvalid) {
      toast.error('Username: 3 to 30 letters, numbers or underscores.');
      return;
    }

    setSavingProfile(true);
    try {
      const body = new FormData();
      body.append('full_name', trimmedName);
      body.append('username', trimmedUsername);
      if (photoFile) body.append('avatar', photoFile);

      const res = await studentApi.patch('/profile/', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const saved = res.data?.user || res.data || {};
      useAuthStore.setState((state) => ({
        student: {
          ...state.student,
          user: {
            ...state.student?.user,
            ...saved,
            full_name: trimmedName,
            username: trimmedUsername,
          },
        },
      }));
      setPhotoFile(null);
      setPhotoPreview('');
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err?.message || 'Could not update your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Fill in your current and new password.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await studentApi.post('/profile/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed.');
    } catch (err) {
      toast.error(err?.message || 'Could not change your password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout('student');
    navigate('/student/login');
  };

  const menu = [
    { id: 'account', label: 'Account info', hint: 'Name, username, photo', Icon: User },
    { id: 'password', label: 'Password', hint: 'Change your password', Icon: ShieldCheck },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <button type="button" className={styles.back} onClick={() => navigate('/student/dashboard')}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>

        <div className={styles.layout}>
          {/* ---------- Left: profile card + menu ---------- */}
          <aside className={styles.side}>
            <section className={styles.profileCard}>
              <div className={styles.avatarWrap}>
                <Avatar src={shownPhoto} size={104} />
                <button
                  type="button"
                  className={styles.cameraBadge}
                  onClick={() => fileRef.current?.click()}
                  aria-label="Change photo"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={pickPhoto}
                  className={styles.hidden}
                />
              </div>

              <h1 className={styles.name}>{user?.full_name || 'Student'}</h1>
              <p className={styles.handle}>{user?.username ? `@${user.username}` : 'No username yet'}</p>
              <p className={styles.email}>{user?.email}</p>
              <StatusBadge status={status || 'ACTIVE'} />
            </section>

            <nav className={styles.menu} aria-label="Profile settings">
              {menu.map(({ id, label, hint, Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`${styles.menuItem} ${section === id ? styles.menuActive : ''}`}
                  onClick={() => setSection(id)}
                  aria-current={section === id ? 'page' : undefined}
                >
                  <span className={styles.chip}><Icon size={18} /></span>
                  <span className={styles.menuText}>
                    <strong>{label}</strong>
                    <small>{hint}</small>
                  </span>
                  <ChevronRight size={18} className={styles.chevron} />
                </button>
              ))}

              <button type="button" className={`${styles.menuItem} ${styles.danger}`} onClick={handleLogout}>
                <span className={styles.chip}><LogOut size={18} /></span>
                <span className={styles.menuText}>
                  <strong>Sign out</strong>
                  <small>Leave this account</small>
                </span>
              </button>
            </nav>

            <Link to="/contact" className={styles.help}>
              <span className={styles.chip}><Headphones size={20} /></span>
              <span className={styles.menuText}>
                <strong>How can we help you?</strong>
                <small>Contact support</small>
              </span>
              <ChevronRight size={18} className={styles.chevron} />
            </Link>
          </aside>

          {/* ---------- Right: selected section ---------- */}
          <main className={styles.panel}>
            {section === 'account' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProfile();
                }}
              >
                <header className={styles.panelHead}>
                  <h2>Account info</h2>
                  <p>Update how your name and username appear across the portal.</p>
                </header>

                {photoFile && (
                  <div className={styles.notice}>
                    <Camera size={16} />
                    <span>
                      New photo selected: <strong>{photoFile.name}</strong>. Click Save changes to upload it.
                    </span>
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="full_name">Account name</label>
                  <div className={styles.inputWrap}>
                    <User size={17} className={styles.icon} />
                    <input
                      id="full_name"
                      className={styles.input}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="username">Username</label>
                  <div className={`${styles.inputWrap} ${usernameInvalid ? styles.invalid : ''}`}>
                    <AtSign size={17} className={styles.icon} />
                    <input
                      id="username"
                      className={styles.input}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      placeholder="your_username"
                    />
                    {usernameValid && (
                      <span className={styles.tick} aria-label="Valid username"><Check size={14} /></span>
                    )}
                  </div>
                  <p className={`${styles.hint} ${usernameInvalid ? styles.hintError : ''}`}>
                    3 to 30 letters, numbers or underscores.
                  </p>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email address</label>
                  <div className={`${styles.inputWrap} ${styles.locked}`}>
                    <Mail size={17} className={styles.icon} />
                    <input id="email" className={styles.input} value={user?.email || ''} disabled readOnly />
                  </div>
                  <p className={styles.hint}>Your email is used to sign in and cannot be changed here.</p>
                </div>

                <div className={styles.actions}>
                  <button type="submit" className="btn btn--primary" disabled={!dirty || savingProfile}>
                    <Save size={16} /> {savingProfile ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            )}

            {section === 'password' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  savePassword();
                }}
              >
                <header className={styles.panelHead}>
                  <h2>Password</h2>
                  <p>Use a strong password that you do not use anywhere else.</p>
                </header>

                <PasswordField
                  id="current_password"
                  label="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <PasswordField
                  id="new_password"
                  label="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />

                {newPassword && (
                  <div className={styles.meter} aria-live="polite">
                    <div className={styles.bars}>
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`${styles.bar} ${i < strength ? styles[`level${strength}`] : ''}`}
                        />
                      ))}
                    </div>
                    <span className={styles.meterLabel}>{STRENGTH_LABELS[strength]}</span>
                  </div>
                )}

                <PasswordField
                  id="confirm_password"
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                {mismatch && <p className={`${styles.hint} ${styles.hintError}`}>Passwords do not match.</p>}

                <div className={styles.actions}>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
                  >
                    <KeyRound size={16} /> {savingPassword ? 'Updating...' : 'Update password'}
                  </button>
                </div>
              </form>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}