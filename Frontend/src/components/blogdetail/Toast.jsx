import React, { useEffect } from 'react';
import { XIcon, AlertCircleIcon, CheckCircleIcon, InfoIcon } from 'lucide-react';

const toastConfig = {
  success: { className: 'bg-foreground text-background', Icon: CheckCircleIcon },
  error: { className: 'bg-destructive text-destructive-foreground', Icon: AlertCircleIcon },
  info: { className: 'bg-secondary text-secondary-foreground', Icon: InfoIcon },
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const { className, Icon } = toastConfig[type] || toastConfig.info;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-lg ${className} animate-in slide-in-from-right`}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default Toast;