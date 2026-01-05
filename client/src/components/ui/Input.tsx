import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label py-1">
          <span className="label-text font-semibold">{label}</span>
        </label>
      )}
      <input
        className={`input input-bordered w-full px-4 py-2.5 ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && (
        <label className="label py-1">
          <span className="label-text-alt text-error flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </span>
        </label>
      )}
    </div>
  );
};
