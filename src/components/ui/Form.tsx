import type { ReactNode, FormHTMLAttributes } from "react";

type FormProps = FormHTMLAttributes<HTMLFormElement> & {
  children: ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
};

export default function Form({ 
  children, 
  className = "", 
  spacing = "md",
  ...props 
}: FormProps) {
  const spacingClass = `form--spacing-${spacing}`;
  const fullClassName = `form ${spacingClass} ${className}`.trim();

  return (
    <form className={fullClassName} {...props}>
      {children}
    </form>
  );
}