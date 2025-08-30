import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessBannerProps {
  show: boolean;
  message: string;
  details?: string;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export function SuccessBanner({ 
  show, 
  message, 
  details, 
  onDismiss, 
  autoHide = true, 
  duration = 5000 
}: SuccessBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      if (autoHide) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [show, autoHide, duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg",
      "bg-green-50 border border-green-200 text-green-800",
      "animate-in slide-in-from-right-full duration-300"
    )}>
      <div className="flex items-start space-x-3">
        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{message}</p>
          {details && (
            <p className="text-sm text-green-700 mt-1">{details}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}