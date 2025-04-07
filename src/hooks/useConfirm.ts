
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

  const confirm = useCallback((confirmOptions?: UseConfirmOptions) => {
    setOptions({ ...options, ...confirmOptions });
    setIsOpen(true);
    
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  }, [options]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef(true);
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef(false);
  }, [resolveRef]);

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

  return { confirm, ConfirmationDialog };
};

export default useConfirm;
