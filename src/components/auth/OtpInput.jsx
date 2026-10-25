import { useEffect, useRef } from 'react';

/**
 * 6-digit individual box OTP input component with auto-focus and clipboard paste.
 *
 * @param {Object} props
 * @param {string} props.value - 6-digit OTP string
 * @param {Function} props.onChange - Callback with full string
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.error]
 */
export default function OtpInput({ value = '', onChange, disabled = false, error }) {
  const inputsRef = useRef([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  useEffect(() => {
    // Focus first input box on initial render if empty
    if (!value && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (index, e) => {
    const char = e.target.value.slice(-1); // Only take latest char
    if (!/^\d*$/.test(char)) return; // Digits only

    const newDigits = [...digits];
    newDigits[index] = char;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    // Auto-focus next input if a digit was entered
    if (char && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0 && inputsRef.current[index - 1]) {
        inputsRef.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{1,6}$/.test(pastedData)) {
      const sanitized = pastedData.slice(0, 6);
      onChange(sanitized);
      const targetIndex = Math.min(sanitized.length, 5);
      if (inputsRef.current[targetIndex]) {
        inputsRef.current[targetIndex].focus();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
      <div
        role="group"
        aria-label="One-Time Password"
        style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of 6`}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            style={{
              width: '46px',
              height: '56px',
              fontSize: '1.5rem',
              fontWeight: '700',
              textAlign: 'center',
              color: 'var(--accent, #2f55ff)',
              background: 'var(--surface, #e5eaf3)',
              borderRadius: 'var(--r-sm, 12px)',
              border: error
                ? '2px solid var(--danger, #b3342a)'
                : digit
                ? '2px solid var(--accent, #2f55ff)'
                : '2px solid transparent',
              boxShadow: digit
                ? 'var(--shadow-raised-sm)'
                : 'var(--shadow-inset-sm)',
              outline: 'none',
              transition: 'all 0.15s ease',
              fontFamily: 'var(--font-display, Figtree, sans-serif)',
            }}
          />
        ))}
      </div>

      {error && (
        <span
          role="alert"
          style={{
            fontSize: '0.85rem',
            color: 'var(--danger, #b3342a)',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
