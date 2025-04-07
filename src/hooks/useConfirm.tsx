
import { useState } from 'react';

interface UseConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

interface UseConfirmResult {
  isOpen: boolean;
  confirm: (callback: () => void) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

const useConfirm = (options: UseConfirmOptions = {}): UseConfirmResult => {
  const {
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed with this action?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState<(() => void) | null>(null);

  const confirm = (cb: () => void) => {
    setCallback(() => cb);
    setIsOpen(true);
  };

  const onConfirm = () => {
    if (callback) {
      callback();
    }
    setIsOpen(false);
    setCallback(null);
  };

  const onCancel = () => {
    setIsOpen(false);
    setCallback(null);
  };

  return {
    isOpen,
    confirm,
    onConfirm,
    onCancel,
    title,
    message,
    confirmText,
    cancelText,
  };
};

export default useConfirm;
