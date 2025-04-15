
declare module 'sonner' {
  import React from 'react';

  export interface ToastOptions {
    id?: string;
    duration?: number;
    icon?: React.ReactNode;
    description?: React.ReactNode;
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
    title?: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
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
    (message: React.ReactNode, data?: ToastOptions): string;
    success: (message: React.ReactNode, data?: ToastOptions) => string;
    error: (message: React.ReactNode, data?: ToastOptions) => string;
    info: (message: React.ReactNode, data?: ToastOptions) => string;
    warning: (message: React.ReactNode, data?: ToastOptions) => string;
    loading: (message: React.ReactNode, data?: ToastOptions) => string;
    custom: (component: (id: string) => JSX.Element, data?: ToastOptions) => string;
    dismiss: (id?: string) => void;
    promise: <T>(
      promise: Promise<T>,
      msgs: {
        loading: React.ReactNode;
        success: React.ReactNode | ((data: T) => React.ReactNode);
        error: React.ReactNode | ((error: Error) => React.ReactNode);
      },
      options?: ToastOptions
    ) => Promise<T>;
    update: (
      id: string,
      data: { message?: React.ReactNode; description?: React.ReactNode } & ToastOptions
    ) => void;
  }

  export const Toaster: React.FC<ToasterProps>;
  export const toast: ToastT;
}
