import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { adminApi } from '../../api';
import AuthLayout from '../../components/auth/AuthLayout';
import ClayButton from '../../components/auth/ClayButton';
import OtpInput from '../../components/auth/OtpInput';
import { useAuthStore } from '../../store/authStore';


export default function AdminOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  // If accessed directly without an email in state, redirect to Step 1
  useEffect(() => {
    if (!email) {
      navigate('/admin/login', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the OTP.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await adminApi.post('/auth/login/verify-otp/', {
        email,
        otp,
      });

      // Cookies are now set — hydrate the store from /auth/me/ to get
      // the full user object with the correctly-cased status ('ACTIVE').
      await useAuthStore.getState().hydrate('admin');

      toast.success('Admin authentication verified!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.message || 'Invalid or expired OTP code.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsResending(true);
    setErrorMessage('');

    try {
      await adminApi.post('/auth/resend-otp/', { email });
      toast.success('A new OTP has been sent to your administrator email.');
      setResendCooldown(60);
      setOtp('');
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <AuthLayout
      role="admin"
      title="Two-Factor Authentication"
      subtitle={`Step 2 of 2: Enter the 6-digit code sent to ${email}`}
    >
      <form onSubmit={handleVerify}>
        <OtpInput
          value={otp}
          onChange={setOtp}
          disabled={isSubmitting}
          error={errorMessage}
        />

        <ClayButton
          type="submit"
          disabled={otp.length !== 6 || isSubmitting}
          loading={isSubmitting}
          style={{ marginBottom: '1rem' }}
        >
          {isSubmitting ? 'Verifying OTP...' : 'Authenticate & Enter Dashboard'}
        </ClayButton>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            style={{
              background: 'none',
              border: 'none',
              color: resendCooldown > 0 ? 'var(--text-muted)' : 'var(--accent, #2f55ff)',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              textDecoration: resendCooldown > 0 ? 'none' : 'underline',
              padding: '0.5rem',
            }}
          >
            {isResending
              ? 'Sending code...'
              : resendCooldown > 0
              ? `Resend code in ${resendCooldown}s`
              : "Didn't receive code? Resend Code"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
