import type { ReactNode } from "react";

type FormFieldProps = {
  children: ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
  required?: boolean;
};

export default function FormField({
  children,
  label,
  error,
  helperText,
  className = "",
  required = false
}: FormFieldProps) {
  return (
    <div className={`form-field ${className}`.trim()}>
      {label && (
        <label className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}
      
      <div className="form-field__control">
        {children}
      </div>

      {!error && helperText && (
        <div className="form-field__helper">{helperText}</div>
      )}
      
      {error && (
        <div className="form-field__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}