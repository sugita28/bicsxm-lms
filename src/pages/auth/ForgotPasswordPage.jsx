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

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

const apis = {
  student: studentApi,
  teacher: teacherApi,
  admin: adminApi,
};

export default function ForgotPasswordPage({ role = 'student' }) {
  const navigate = useNavigate();
  const [submittedEmail, setSubmittedEmail] = useState('');
  const api = apis[role] || studentApi;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    try {
      await api.post('/auth/password-reset/request/', values);
      setSubmittedEmail(values.email);
      toast.success('If an account exists, a reset code was sent.');
    } catch {
      // Always treat as success to avoid email enumeration
      setSubmittedEmail(values.email);
    }
  };

  const loginLink = `/${role}/login`;

  return (
    <AuthLayout
      role={role}
      title="Reset Your Password"
      subtitle="Enter your account email to receive a password recovery code"
      footer={
        <span>
          Remember your password? <Link to={loginLink}>Sign in</Link>
        </span>
      }
    >
      {submittedEmail ? (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--r-sm)',
              background: '#e6f7ed',
              color: '#15803d',
              border: '1px solid rgba(21, 128, 61, 0.25)',
              marginBottom: '1.5rem',
              fontSize: '0.925rem',
              lineHeight: '1.5',
            }}
          >
            If an LMS account exists for <strong>{submittedEmail}</strong>, a one-time reset code has been sent. Please check your inbox and spam folder.
          </div>

          <ClayButton
            onClick={() =>
              navigate(`/${role}/reset-password?email=${encodeURIComponent(submittedEmail)}`)
            }
          >
            Enter Reset Code →
          </ClayButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Account Email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <ClayButton type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Sending code...' : 'Send Recovery Code'}
          </ClayButton>
        </form>
      )}
    </AuthLayout>
  );
}
