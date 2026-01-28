import type { ReactNode } from "react";

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function Alert({
  variant = "info",
  title,
  children,
  className = "",
}: AlertProps) {
  const role: "alert" | "status" = variant === "error" ? "alert" : "status";
  const alertClass = ["alert", `alert--${variant}`, className].join(" ").trim();

  return (
    <div className={alertClass} role={role}>
      {title && <strong className="alert__title">{title}</strong>}
      <span className="alert__content">{children}</span>
    </div>
  );
}
