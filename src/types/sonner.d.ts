
declare module 'sonner' {
  import { ReactNode } from 'react';

  export interface ToastOptions {
    id?: string;
    duration?: number;
    icon?: ReactNode;
    description?: ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
    cancel?: {
      label: string;
      onClick: () => void;
    };
    onDismiss?: () => void;
    onAutoClose?: () => void;
    className?: string;
    style?: React.CSSProperties;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    important?: boolean;
  }

  export interface ToasterProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    hotkey?: string;
    richColors?: boolean;
    expand?: boolean;
    duration?: number;
    visibleToasts?: number;
    closeButton?: boolean;
    theme?: 'light' | 'dark' | 'system';
    toastOptions?: ToastOptions;
    className?: string;
    style?: React.CSSProperties;
    offset?: string | number;
    dir?: 'rtl' | 'ltr' | 'auto';
  }

  export interface Toast {
    id: string;
    title?: ReactNode;
    description?: ReactNode;
    icon?: ReactNode;
    duration?: number;
    promise?: Promise<any>;
    cancel?: () => void;
    onDismiss?: () => void;
    onAutoClose?: () => void;
    action?: {
      label: string;
      onClick: () => void;
    };
    cancel?: {
      label: string;
      onClick: () => void;
    };
    type?: 'success' | 'error' | 'loading' | 'default';
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
    important?: boolean;
  }

  export interface ToastT {
    (message: ReactNode, data?: ToastOptions): string;
    success: (message: ReactNode, data?: ToastOptions) => string;
    error: (message: ReactNode, data?: ToastOptions) => string;
    info: (message: ReactNode, data?: ToastOptions) => string;
    warning: (message: ReactNode, data?: ToastOptions) => string;
    loading: (message: ReactNode, data?: ToastOptions) => string;
    custom: (component: (id: string) => JSX.Element, data?: ToastOptions) => string;
    dismiss: (id?: string) => void;
    promise: <T>(
      promise: Promise<T>,
      msgs: {
        loading: ReactNode;
        success: ReactNode | ((data: T) => ReactNode);
        error: ReactNode | ((error: Error) => ReactNode);
      },
      options?: ToastOptions
    ) => Promise<T>;
    update: (
      id: string,
      data: { message?: ReactNode; description?: ReactNode } & ToastOptions
    ) => void;
  }

  export const Toaster: React.FC<ToasterProps>;
  export const toast: ToastT;
}
