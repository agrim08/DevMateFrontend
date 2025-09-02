import { Button } from "../ui/button";

const ErrorBanner = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="p-3 bg-red-50 border-b border-red-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-red-700 text-sm">{error}</span>
      </div>
      <div className="flex items-center space-x-2">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-700 hover:bg-red-100 text-xs"
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-red-700 hover:bg-red-100 w-6 h-6 p-0"
          onClick={onDismiss}
        >
          ×
        </Button>
      </div>
    </div>
  );
};

export default ErrorBanner;