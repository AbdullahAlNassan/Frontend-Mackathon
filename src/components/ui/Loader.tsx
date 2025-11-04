type LoaderProps = {
  size?: "sm" | "md" | "lg";
  inline?: boolean; // inline of block
  label?: string;
};

export default function Loader({
  size = "md",
  inline = true,
  label,
}: LoaderProps) {
  const className = [
    "loader",
    `loader--${size}`,
    inline ? "loader--inline" : "",
  ]
    .join(" ")
    .trim();

  return (
    <span
      className={className}
      role="status"
      aria-live="polite"
      aria-label={label || "Bezig"}
    >
      <span className="loader__spinner" aria-hidden />
      {label && <span className="loader__label">{label}</span>}
    </span>
  );
}
