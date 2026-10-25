import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { adminApi } from '../../api';
import AuthLayout from '../../components/auth/AuthLayout';
import ClayButton from '../../components/auth/ClayButton';
import FormInput from '../../components/auth/FormInput';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid administrator email.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      // Step 1: submit credentials -> server generates OTP and sends email
      const response = await adminApi.post('/auth/login/', values);

      if (response.data.requires_otp) {
        toast.info('Verification code sent to your admin email.');
        navigate('/admin/login/verify-otp', {
          state: { email: values.email },
        });
      }
    } catch (err) {
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, msgs]) => {
          const message = Array.isArray(msgs) ? msgs[0] : msgs;
          setError(field, { message });
        });
      }
      const msg = err.message || 'Invalid administrator credentials.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      role="admin"
      title="Admin Portal"
      subtitle="Step 1 of 2: Authenticate with administrator credentials"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && (
          <div
            role="alert"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--r-sm)',
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
          label="Administrator Email"
          type="email"
          autoComplete="email"
          placeholder="admin@lms.local"
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
            to="/admin/forgot-password"
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
          {isSubmitting ? 'Authenticating...' : 'Continue to Step 2 →'}
        </ClayButton>
      </form>
    </AuthLayout>
  );
}
