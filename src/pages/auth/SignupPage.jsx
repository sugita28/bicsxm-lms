import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { studentApi, teacherApi } from '../../api';
import AuthLayout from '../../components/auth/AuthLayout';
import ClayButton from '../../components/auth/ClayButton';
import FormInput from '../../components/auth/FormInput';
import { useAuthStore } from '../../store/authStore';

const signupSchema = z
  .object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character.'),
    confirm_password: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  });

const apis = {
  student: studentApi,
  teacher: teacherApi,
};

export default function SignupPage({ role: initialRole = 'student' }) {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [serverError, setServerError] = useState('');
  const api = apis[selectedRole] || studentApi;

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { full_name: '', email: '', password: '', confirm_password: '' },
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const payload = {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
      };

      const response = await api.post('/auth/signup/', payload);
      const data = response.data;

      setAuth(selectedRole, {
        user: null,
        status: data.status || 'EMAIL_UNVERIFIED',
        scope: data.scope || 'limited',
      });

      toast.success('Account created! Please verify your email with the OTP sent.');
      navigate(`/${selectedRole}/verify-email`, { state: { email: values.email } });
    } catch (err) {
      if (err.code === 'account_exists' || err.status === 409) {
        const msg = 'An account with this email already exists. Please log in.';
        setServerError(msg);
        toast.error(msg);
        return;
      }
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, msgs]) => {
          const message = Array.isArray(msgs) ? msgs[0] : msgs;
          setError(field, { message });
        });
      }
      const generalMessage = err.message || 'Registration failed. Please check your information.';
      setServerError(generalMessage);
      toast.error(generalMessage);
    }
  };

  const isTeacher = selectedRole === 'teacher';
  const roleTitle = isTeacher ? 'Become an Instructor' : 'Create Student Account';
  const loginLink = isTeacher ? '/teacher/login' : '/student/login';

  return (
    <AuthLayout
      role={selectedRole}
      title={roleTitle}
      subtitle={
        isTeacher
          ? 'Apply to teach and share your expertise on LMS Academy'
          : 'Join thousands of students learning today'
      }
      footer={
        <span>
          Already have an account? <Link to={loginLink}>Sign in</Link>
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
          label="Full Name"
          placeholder="Jane Doe"
          required
          autoComplete="name"
          error={errors.full_name?.message}
          {...register('full_name')}
        />

        <FormInput
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          helperText="At least 8 characters, with 1 uppercase, 1 number, and 1 symbol."
          error={errors.password?.message}
          {...register('password')}
        />

        {passwordValue && (
          <div style={{ marginBottom: '1rem', marginTop: '-0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Strength Hint:{' '}
            <span
              style={{
                fontWeight: '700',
                color:
                  passwordValue.length >= 8 && /[A-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue) && /[^A-Za-z0-9]/.test(passwordValue)
                    ? 'var(--success, #1f8a5b)'
                    : 'var(--danger, #b3342a)',
              }}
            >
              {passwordValue.length >= 8 && /[A-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue) && /[^A-Za-z0-9]/.test(passwordValue)
                ? 'Strong Password'
                : 'Requirements not fully met'}
            </span>
          </div>
        )}

        <FormInput
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        <ClayButton type="submit" loading={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </ClayButton>
      </form>
    </AuthLayout>
  );
}
