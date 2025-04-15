
declare module 'react-hot-toast' {
  import { ReactNode } from 'react';

  export type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

  export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom';

  export interface Toast {
    id: string;
    type: ToastType;
    message: ReactNode;
    icon?: ReactNode;
    duration?: number;
    pauseDuration: number;
    position?: ToastPosition;
    ariaProps: {
      role: 'status' | 'alert';
      'aria-live': 'assertive' | 'off' | 'polite';
    };
    style?: React.CSSProperties;
    className?: string;
    createdAt: number;
    visible: boolean;
    height?: number;
  }

  export interface ToasterProps {
    position?: ToastPosition;
    toastOptions?: DefaultToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
    children?: (toast: Toast) => JSX.Element;
  }

  export interface DefaultToastOptions {
    duration?: number;
    style?: React.CSSProperties;
    className?: string;
    position?: ToastPosition;
    icon?: ReactNode;
    ariaProps?: {
      role?: 'status' | 'alert';
      'aria-live'?: 'assertive' | 'off' | 'polite';
    };
  }

  export type ToastOptions = Partial<
    Pick<Toast, 'id' | 'icon' | 'duration' | 'ariaProps' | 'className' | 'style' | 'position'>
  >;

  export interface ToastHandler {
    (message: ReactNode, options?: ToastOptions): string;
    success(message: ReactNode, options?: ToastOptions): string;
    error(message: ReactNode, options?: ToastOptions): string;
    loading(message: ReactNode, options?: ToastOptions): string;
    custom(component: ReactNode, options?: ToastOptions): string;
  }

  export const Toaster: React.FC<ToasterProps>;
  export const toast: ToastHandler;
  export const useToasterStore: () => {
    toasts: Toast[];
    pausedAt: number | undefined;
  };

  export default toast;
}
