import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { studentApi, teacherApi } from '../../api';
import AuthLayout from '../../components/auth/AuthLayout';
import ClayButton from '../../components/auth/ClayButton';
import OtpInput from '../../components/auth/OtpInput';
import { useAuthStore } from '../../store/authStore';

const apis = {
  student: studentApi,
  teacher: teacherApi,
};

function StepDots({ current, total = 3 }) {
  return (
    <div
      aria-label={`Step ${current} of ${total}`}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{
            width: i + 1 === current ? '26px' : '10px',
            height: '10px',
            borderRadius: '999px',
            background: i + 1 <= current ? 'var(--accent, #2f55ff)' : 'rgba(0,0,0,0.12)',
            transition: 'all 0.25s ease',
          }}
        />
      ))}
      <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        Step {current} of {total}
      </span>
    </div>
  );
}

export default function VerifyEmailPage({ role = 'student' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const resetRole = useAuthStore((state) => state.resetRole);

  // Email can come from React Router navigation state, URL query param, or auth store
  const storedUser = useAuthStore((state) => state[role]?.user);
  const email =
    location.state?.email ||
    searchParams.get('email') ||
    storedUser?.email ||
    '';

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [verified, setVerified] = useState(false);

  // 10-minute countdown timer (600 seconds)
  const [expiresIn, setExpiresIn] = useState(600);

  // 60-second resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState(60);

  const redirectTimer = useRef(null);
  const api = apis[role] || studentApi;

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Clean up the redirect timer if the page unmounts
  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const goToLogin = () => {
    navigate(`/${role}/login`, { state: { email, verified: true }, replace: true });
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const payload = email ? { email, otp } : { otp };
      await api.post('/auth/verify-otp/', payload);

      // Clear the temporary EMAIL_UNVERIFIED session so RoleGuard can't bounce us back here
      resetRole(role);

      toast.success('Email successfully verified!');
      setVerified(true);

      // Show the success step briefly, then move to the login form
      redirectTimer.current = setTimeout(goToLogin, 1500);
    } catch (err) {
      const msg = err.message || 'Verification failed.';
      setErrorMessage(msg);

      if (err.code === 'already_verified' || err.status === 409) {
        resetRole(role);
        toast.info('Email is already verified. Redirecting to login...');
        goToLogin();
        return;
      }

      if (err.code === 'otp_attempts_exceeded' || err.code === 'OTP_MAX_ATTEMPTS') {
        setIsLockedOut(true);
        setAttemptsRemaining(0);
        toast.error('Maximum attempts exceeded. Please request a new code.');
      } else if (err.code === 'otp_invalid' || err.code === 'OTP_INVALID') {
        const match = msg.match(/(\d+)\s+attempt/i);
        if (match) {
          setAttemptsRemaining(parseInt(match[1], 10));
        }
        toast.error(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setErrorMessage('');
    setIsResending(true);

    try {
      const payload = email ? { email } : {};
      await api.post('/auth/resend-otp/', payload);
      toast.success('A fresh verification code has been dispatched to your email.');
      setExpiresIn(600);
      setResendCooldown(60);
      setIsLockedOut(false);
      setAttemptsRemaining(null);
      setOtp('');
    } catch (err) {
      if (err.status === 429 || err.code === 'otp_cooldown') {
        const match = err.message?.match(/(\d+)\s*sec/i);
        const waitSec = match ? parseInt(match[1], 10) : 60;
        setResendCooldown(waitSec);
        toast.error(`Too many attempts. Please try again in ${waitSec} seconds.`);
      } else {
        toast.error(err.message || 'Could not resend verification code.');
      }
    } finally {
      setIsResending(false);
    }
  };

  // Step 3: success screen shown just before the login form
  if (verified) {
    return (
      <AuthLayout
        role={role}
        title="Email verified"
        subtitle="Your account is ready. Taking you to the login form..."
      >
        <StepDots current={3} />
        <div style={{ textAlign: 'center', padding: '1rem 0 0.5rem' }}>
          <div
            aria-hidden="true"
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              fontSize: '2rem',
              color: 'var(--success, #1f8a5b)',
              background: 'var(--surface, #e5eaf3)',
              boxShadow: 'var(--shadow-raised-sm)',
            }}
          >
            ✓
          </div>
          <ClayButton type="button" onClick={() => { clearTimeout(redirectTimer.current); goToLogin(); }}>
            Continue to login
          </ClayButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      role={role}
      title="Verify Your Email"
      subtitle={
        email
          ? `We sent a 6-digit verification code to ${email}`
          : 'Please enter the 6-digit verification code sent to your email'
      }
    >
      <StepDots current={2} />

      <form onSubmit={handleVerify}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: expiresIn > 60 ? 'var(--text-muted)' : 'var(--danger, #b3342a)',
            }}
          >
            Code expires in: <strong>{formatTime(expiresIn)}</strong>
          </span>
        </div>

        <OtpInput
          value={otp}
          onChange={setOtp}
          disabled={isSubmitting || isLockedOut}
          error={errorMessage}
        />

        {attemptsRemaining !== null && attemptsRemaining > 0 && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--danger, #b3342a)',
              marginBottom: '1rem',
              fontWeight: '600',
            }}
          >
            {attemptsRemaining} attempt{attemptsRemaining > 1 ? 's' : ''} remaining before lockout.
          </div>
        )}

        {isLockedOut && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--r-sm)',
              background: '#fee2e2',
              color: '#b91c1c',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
              fontWeight: '600',
            }}
          >
            This code has been locked due to too many failed attempts. Click &ldquo;Resend Code&rdquo; below to receive a new one.
          </div>
        )}

        <ClayButton
          type="submit"
          disabled={otp.length !== 6 || isSubmitting || isLockedOut}
          loading={isSubmitting}
          style={{ marginBottom: '1rem' }}
        >
          {isSubmitting ? 'Verifying...' : 'Verify Code'}
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