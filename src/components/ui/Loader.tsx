import { motion } from "framer-motion";

type LoaderSize = "sm" | "md" | "lg";
type LoaderVariant = "circular" | "dots" | "pulse";

type LoaderProps = {
  size?: LoaderSize;
  variant?: LoaderVariant;
  label?: string;
  className?: string;
};

export default function Loader({
  size = "md",
  variant = "circular",
  label,
  className: customClassName,
}: LoaderProps) {
  const classes = [
    "loader",
    `loader--${size}`,
    `loader--${variant}`,
    customClassName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <div className={classes} role="status" aria-label={label || "Laden"}>
      {variant === "circular" && <CircularLoader />}
      {variant === "dots" && <DotsLoader />}
      {variant === "pulse" && <PulseLoader />}
      {label && <span className="loader__label">{label}</span>}
    </div>
  );
}

// Circular spinning loader
function CircularLoader() {
  return (
    <motion.div
      className="loader__circular"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Three dots bouncing
function DotsLoader() {
  const dotVariants = {
    start: { y: 0 },
    end: { y: -8 },
  };

  return (
    <div className="loader__dots">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="loader__dot"
          variants={dotVariants}
          initial="start"
          animate="end"
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// Pulsing circle
function PulseLoader() {
  return (
    <motion.div
      className="loader__pulse"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
