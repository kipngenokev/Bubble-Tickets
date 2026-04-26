import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  label = "Loading…",
  className,
}) => (
  <div
    role="status"
    aria-live="polite"
    className={`flex flex-col items-center justify-center py-16 text-gray-400 ${className ?? ""}`}
  >
    <Loader2 className="h-8 w-8 animate-spin mb-2" aria-hidden="true" />
    <p className="text-sm">{label}</p>
  </div>
);

export default LoadingState;
