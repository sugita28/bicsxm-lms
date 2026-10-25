import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { adminApi, studentApi, teacherApi } from '../../api';
import AuthLayout from '../../components/auth/AuthLayout';
import ClayButton from '../../components/auth/ClayButton';
import FormInput from '../../components/auth/FormInput';
import OtpInput from '../../components/auth/OtpInput';

const resetSchema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    otp: z.string().length(6, 'Please enter all 6 digits of the recovery code.'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Must contain at least one number.')
      .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character.'),
    confirm_password: z.string().min(1, 'Please confirm your new password.'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match.',
    path: ['confirm_password'],
  });

const apis = {
  student: studentApi,
  teacher: teacherApi,
  admin: adminApi,
};

export default function ResetPasswordPage({ role = 'student' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [serverError, setServerError] = useState('');
  const api = apis[role] || studentApi;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: emailParam,
      otp: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const otpValue = watch('otp', '');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await api.post('/auth/password-reset/confirm/', {
        email: values.email,
        otp: values.otp,
        new_password: values.new_password,
      });

      toast.success('Password successfully reset! Please sign in with your new password.');
      navigate(`/${role}/login`);
    } catch (err) {
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, msgs]) => {
          const message = Array.isArray(msgs) ? msgs[0] : msgs;
          setError(field, { message });
        });
      }
      const msg = err.message || 'Password reset failed. Please ensure the code is valid.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      role={role}
      title="Create New Password"
      subtitle="Enter the 6-digit recovery code and choose a new password"
      footer={
        <span>
          Back to <Link to={`/${role}/login`}>Sign in</Link>
        </span>
      }
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
          label="Account Email"
          type="email"
          required
          readOnly={Boolean(emailParam)}
          style={{ opacity: emailParam ? 0.9 : 1 }}
          error={errors.email?.message}
          {...register('email')}
        />

        <div style={{ marginBottom: '1.25rem' }}>
          <label
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text)',
              display: 'block',
              textAlign: 'center',
            }}
          >
            6-Digit Verification Code <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <OtpInput
            value={otpValue}
            onChange={(val) => setValue('otp', val, { shouldValidate: true })}
            error={errors.otp?.message}
          />
        </div>

        <FormInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          helperText="At least 8 characters, with 1 uppercase, 1 number, and 1 symbol."
          error={errors.new_password?.message}
          {...register('new_password')}
        />

        <FormInput
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        <ClayButton type="submit" loading={isSubmitting}>
          {isSubmitting ? 'Resetting password...' : 'Update Password'}
        </ClayButton>
      </form>
    </AuthLayout>
  );
}
