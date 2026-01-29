import Loader from "./Loader";

type PageLoaderProps = {
  text?: string;
  variant?: "circular" | "dots" | "pulse";
};

export default function PageLoader({ 
  text = "Bezig met laden...", 
  variant = "circular" 
}: PageLoaderProps) {
  return (
    <div className="page-loader">
      <div className="page-loader__content">
        <Loader size="lg" variant={variant} />
        {text && <span className="page-loader__text">{text}</span>}
      </div>
    </div>
  );
}