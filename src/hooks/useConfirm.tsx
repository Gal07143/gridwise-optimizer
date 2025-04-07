import { useState, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UseConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmOptions>({
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  });
  
  const [resolveRef, setResolveRef] = useState<(value: boolean) => void>(() => () => {});
  const [callback, setCallback] = useState<(() => void) | null>(null);

  const confirm = useCallback((confirmOptions?: UseConfirmOptions | (() => Promise<void>)) => {
    if (typeof confirmOptions === 'function') {
      setCallback(() => confirmOptions as () => Promise<void>);
      setIsOpen(true);
      return Promise.resolve();
    }
    
    setOptions(prev => ({ ...prev, ...confirmOptions }));
    setIsOpen(true);
    
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  }, [options]);

  const onConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef(true);
    if (callback) {
      callback();
    }
  }, [resolveRef, callback]);

  const onCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef(false);
    setCallback(null);
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const ConfirmationDialog = useCallback(() => {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{options.cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{options.confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }, [isOpen, options, handleCancel, handleConfirm]);

  return { confirm, ConfirmationDialog, isOpen, onConfirm, onCancel };
};

export default useConfirm;
