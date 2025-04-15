
declare module 'sonner' {
  import { ReactNode, CSSProperties, FC, ReactElement } from 'react';

  export type ToastTypes = 'normal' | 'success' | 'error' | 'loading';

  export interface ToastClassnames {
    toast?: string;
    title?: string;
    description?: string;
    loader?: string;
    closeButton?: string;
    cancelButton?: string;
    actionButton?: string;
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
  }

  export interface ToastOptions {
    id?: string | number;
    icon?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    duration?: number;
    dismissible?: boolean;
    cancel?: {
      label: string;
      onClick?: () => void;
    };
    action?: {
      label: string;
      onClick?: () => void;
    };
    onDismiss?: (toast: ToastOptions) => void;
    onAutoClose?: (toast: ToastOptions) => void;
    className?: string;
    style?: CSSProperties;
    position?: Position;
    important?: boolean;
    unstyled?: boolean;
    classNames?: ToastClassnames;
    actionButtonStyle?: CSSProperties;
    cancelButtonStyle?: CSSProperties;
    closeButtonStyle?: CSSProperties;
    descriptionStyle?: CSSProperties;
    loaderStyle?: CSSProperties;
    titleStyle?: CSSProperties;
  }

  export type Position =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

  export interface ToasterProps {
    position?: Position;
    hotkey?: string | string[];
    richColors?: boolean;
    expand?: boolean;
    duration?: number;
    visibleToasts?: number;
    closeButton?: boolean;
    toastOptions?: ToastOptions;
    theme?: 'light' | 'dark' | 'system';
    dir?: 'rtl' | 'ltr' | 'auto';
    offset?: string | number;
    gap?: number;
    loadingIcon?: ReactNode;
    containerAriaLabel?: string;
  }

  export const Toaster: FC<ToasterProps>;

  export const toast: {
    (message: ReactNode, options?: ToastOptions): string | number;
    success: (message: ReactNode, options?: ToastOptions) => string | number;
    error: (message: ReactNode, options?: ToastOptions) => string | number;
    info: (message: ReactNode, options?: ToastOptions) => string | number;
    warning: (message: ReactNode, options?: ToastOptions) => string | number;
    loading: (message: ReactNode, options?: ToastOptions) => string | number;
    dismiss: (id?: string | number) => void;
    custom: (component: ReactNode, options?: ToastOptions) => string | number;
    message: (message: ReactNode, options?: ToastOptions) => string | number;
    promise: <T>(promise: Promise<T>, options?: {
      loading?: ReactNode;
      success?: ReactNode | ((data: T) => ReactNode);
      error?: ReactNode | ((error: any) => ReactNode);
      finally?: () => void;
      id?: string | number;
    }) => Promise<T>;
  };
}
