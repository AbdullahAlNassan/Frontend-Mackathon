export default function Loader({ size = 32 }: { size?: number }) {
  const spinnerStyle: React.CSSProperties = {
    width: size,
    height: size,
    border: "3px solid rgba(255,255,255,.2)",
    borderTopColor: "var(--color-primary)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "auto",
  };

  return <div style={spinnerStyle} />;
}
