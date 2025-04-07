
import { useState } from 'react';

export interface UseConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export interface UseConfirmReturn {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirm: (callback: () => void) => void;
}

const useConfirm = (options?: UseConfirmOptions): UseConfirmReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState<() => void>(() => () => {});
  const [confirmationState, setConfirmationState] = useState({
    title: options?.title || 'Confirm Action',
    message: options?.message || 'Are you sure you want to proceed with this action?',
    confirmText: options?.confirmText || 'Confirm',
    cancelText: options?.cancelText || 'Cancel',
  });

  const confirm = (callback: () => void) => {
    setCallback(() => callback);
    setIsOpen(true);
  };

  const onConfirm = () => {
    setIsOpen(false);
    callback();
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    ...confirmationState,
    onConfirm,
    onCancel,
    confirm,
  };
};

export default useConfirm;
