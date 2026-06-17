import { useState } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type PasswordFieldProps = {
  label: string;
  id: string;
  registerProps: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
};

export default function PasswordField({
  label,
  id,
  registerProps,
  error,
  placeholder = 'Enter your password',
  autoComplete = 'current-password',
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-caption font-medium text-on-surface-variant">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          {...registerProps}
          id={id}
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="block w-full px-3 py-2 pr-20 border border-outline-variant rounded-md shadow-neu-inset bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-focus-glow focus:border-focus-glow"
        />
        <button
          type="button"
          onClick={() => setIsVisible((value) => !value)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-caption font-medium text-on-surface-variant hover:text-on-surface"
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <p className="mt-1 text-caption text-on-error-container">{error}</p>}
    </div>
  );
}
