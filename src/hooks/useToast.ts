
import { toast } from 'sonner';

export interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  id?: string;
}

export const useToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    return toast.success(message, options);
  };

  const error = (message: string, options?: ToastOptions) => {
    return toast.error(message, options);
  };

  const info = (message: string, options?: ToastOptions) => {
    return toast.info(message, options);
  };

  const warning = (message: string, options?: ToastOptions) => {
    return toast.warning(message, options);
  };

  const custom = (message: React.ReactNode, options?: ToastOptions) => {
    return toast(message, options);
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    success,
    error,
    info,
    warning,
    custom,
    dismiss,
    toast // Export the raw toast object as well
  };
};

export default useToast;
