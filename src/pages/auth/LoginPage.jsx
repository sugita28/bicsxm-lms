import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { adminApi, studentApi, teacherApi } from '../../api';
import AuthLayout from '../../components/auth/AuthLayout';
import ClayButton from '../../components/auth/ClayButton';
import FormInput from '../../components/auth/FormInput';
import { useAuthStore } from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const apis = {
  student: studentApi,
  teacher: teacherApi,
  admin: adminApi,
};

export default function LoginPage({ role: initialRole = 'student' }) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [serverError, setServerError] = useState('');
  const api = apis[selectedRole] || studentApi;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const response = await api.post('/auth/login/', values);
      const data = response.data;

      setAuth(selectedRole, {
        user: data.user || null,
        status: data.status,
        scope: data.scope,
      });

      toast.success('Signed in successfully!');

      // Route by status
      if (data.status === 'EMAIL_UNVERIFIED') {
        navigate(`/${selectedRole}/verify-email`, { state: { email: values.email } });
      } else if (data.status === 'PENDING_APPROVAL') {
        navigate(`/${selectedRole}/pending-approval`);
      } else if (data.status === 'REJECTED') {
        navigate(`/${selectedRole}/rejected`);
      } else {
        navigate(`/${selectedRole}/dashboard`);
      }
    } catch (err) {
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, msgs]) => {
          const message = Array.isArray(msgs) ? msgs[0] : msgs;
          setError(field, { message });
        });
      }

      // Handle specific 403 flow redirection codes
      if (err.code === 'email_not_verified') {
        toast.info(err.message || 'Please verify your email before logging in.');
        navigate(`/${selectedRole}/verify-email`, { state: { email: values.email } });
        return;
      }
      if (err.code === 'pending_admin_approval') {
        navigate(`/${selectedRole}/pending-approval`);
        return;
      }
      if (err.code === 'account_rejected') {
        navigate(`/${selectedRole}/rejected`, { state: { reason: err.rejectionReason } });
        return;
      }
      if (err.code === 'account_suspended') {
        const msg = 'Your account has been suspended. Please contact support.';
        setServerError(msg);
        toast.error(msg);
        return;
      }

      const generalMessage = err.message || 'Login failed. Please verify your credentials.';
      setServerError(generalMessage);
      toast.error(generalMessage);
    }
  };

  const isTeacher = selectedRole === 'teacher';
  const roleTitle = isTeacher ? 'Instructor Login' : 'Student Login';
  const signupLink = isTeacher ? '/teacher/signup' : '/student/signup';

  return (
    <AuthLayout
      role={selectedRole}
      title={roleTitle}
      subtitle="Enter your email and password to access your dashboard"
      footer={
        <span>
          Don&apos;t have an account? <Link to={signupLink}>Create account</Link>
        </span>
      }
    >
      {/* Role Toggle Selector */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.05)',
          padding: '4px',
          borderRadius: 'var(--r-pill, 999px)',
          marginBottom: '1.5rem',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <button
          type="button"
          onClick={() => { setSelectedRole('student'); setServerError(''); }}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--r-pill, 999px)',
            border: 'none',
            background: selectedRole === 'student' ? 'var(--surface, #ffffff)' : 'transparent',
            boxShadow: selectedRole === 'student' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
            fontWeight: '600',
            fontSize: '0.85rem',
            color: selectedRole === 'student' ? 'var(--accent-strong, #1e3a8a)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => { setSelectedRole('teacher'); setServerError(''); }}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--r-pill, 999px)',
            border: 'none',
            background: selectedRole === 'teacher' ? 'var(--surface, #ffffff)' : 'transparent',
            boxShadow: selectedRole === 'teacher' ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
            fontWeight: '600',
            fontSize: '0.85rem',
            color: selectedRole === 'teacher' ? 'var(--accent-strong, #1e3a8a)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Instructor
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/login')}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--r-pill, 999px)',
            border: 'none',
            background: 'transparent',
            fontWeight: '600',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          Admin 2FA
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && (
          <div
            role="alert"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--r-sm, 12px)',
              background: '#fee2e2',
              color: '#b91c1c',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(185, 28, 28, 0.2)',
            }}
          >
            {serverError}
          </div>
        )}

        <FormInput
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
          <Link
            to={`/${selectedRole}/forgot-password`}
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Forgot password?
          </Link>
        </div>

        <ClayButton type="submit" loading={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </ClayButton>
      </form>
    </AuthLayout>
  );
}
