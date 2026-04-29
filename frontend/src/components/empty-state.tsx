import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={`flex flex-col items-center justify-center text-center py-16 px-4 text-gray-400 ${className ?? ""}`}
  >
    {icon && (
      <div className="mb-4 text-gray-500" aria-hidden="true">
        {icon}
      </div>
    )}
    <h2 className="text-lg font-semibold text-white mb-1">{title}</h2>
    {description && <p className="text-sm">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
