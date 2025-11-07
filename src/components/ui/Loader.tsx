type LoaderProps = {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  label?: string;
  className?: string;
};

export default function Loader({ 
  size = "md", 
  variant = "spinner",
  label,
  className = ""
}: LoaderProps) {
  const baseClass = "loader";
  const variantClass = `loader--${variant}`;
  const sizeClass = `loader--${size}`;
  
  const fullClassName = [
    baseClass,
    variantClass,
    sizeClass,
    className
  ].join(" ").trim();

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return (
          <div className="loader__dots" aria-hidden>
            <span></span>
            <span></span>
            <span></span>
          </div>
        );
      case "pulse":
        return <div className="loader__pulse" aria-hidden></div>;
      case "spinner":
      default:
        return <div className="loader__spinner" aria-hidden></div>;
    }
  };

  return (
    <div
      className={fullClassName}
      role="status"
      aria-live="polite"
      aria-label={label || "Bezig met laden"}
    >
      {renderLoader()}
      {label && <span className="loader__label">{label}</span>}
    </div>
  );
}