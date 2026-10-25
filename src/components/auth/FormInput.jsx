import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

const FormInput = React.forwardRef(
  (
    {
      label,
      id,
      name,
      type = 'text',
      error,
      helperText,
      required = false,
      disabled = false,
      style,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputId = id || name;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem', ...style }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {label}
            {required && <span style={{ color: 'var(--danger, #b3342a)' }}>*</span>}
          </label>
        )}

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            id={inputId}
            name={name}
            type={inputType}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            style={{
              width: '100%',
              padding: isPassword ? '0.75rem 2.75rem 0.75rem 1rem' : '0.75rem 1rem',
              fontSize: '0.95rem',
              color: 'var(--text)',
              background: 'var(--surface)',
              borderRadius: 'var(--r-sm, 12px)',
              border: error
                ? '1.5px solid var(--danger, #b3342a)'
                : '1.5px solid transparent',
              boxShadow: 'var(--shadow-inset-sm)',
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              if (!error) {
                e.currentTarget.style.borderColor = 'var(--accent, #2f55ff)';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                e.currentTarget.style.borderColor = 'transparent';
              }
            }}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '0.75rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.25rem',
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <span
            id={`${inputId}-error`}
            role="alert"
            style={{
              fontSize: '0.8rem',
              color: 'var(--danger, #b3342a)',
              fontWeight: '500',
              marginTop: '0.15rem',
            }}
          >
            {error}
          </span>
        )}

        {helperText && !error && (
          <span
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginTop: '0.15rem',
            }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
