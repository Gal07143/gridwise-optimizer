
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassPanel from '@/components/ui/GlassPanel';
import DeviceForm from '@/components/devices/DeviceForm';
import DevicePageHeader from '@/components/devices/DevicePageHeader';
import { useDeviceForm } from '@/hooks/useDeviceForm';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { validateDeviceForm, errorsToRecord } from '@/utils/validation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const AddDevice = () => {
  const {
    device,
    isSubmitting,
    isLoadingSite,
    hasSiteError,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack
  } = useDeviceForm();
  
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [isOnline, setIsOnline] = React.useState<boolean>(navigator.onLine);
  const isMobile = useIsMobile();
  
  // Listen for online/offline events
  React.useEffect(() => {
    const handleOffline = () => setIsOnline(false);
    const handleOnline = () => setIsOnline(true);
    
    // Add event listeners
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Cleanup
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);
  
  const handleValidatedSubmit = (e?: React.FormEvent) => {
    const errors = validateDeviceForm(device);
    const errorRecord = errorsToRecord(errors);
    
    setValidationErrors(errorRecord);
    
    if (errors.length === 0) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <ErrorBoundary>
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <DevicePageHeader 
              title="Add New Device"
              subtitle="Add a new energy device to the system"
              onBack={navigateBack}
              onSave={handleValidatedSubmit}
              isSaving={isSubmitting}
            />
            
            {!isOnline && (
              <Alert variant="destructive" className="mb-4">
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Network Unavailable</AlertTitle>
                <AlertDescription>
                  You're currently offline. Device creation will be queued until connection is restored.
                </AlertDescription>
              </Alert>
            )}
            
            {hasSiteError && (
              <Alert className="mb-4 border-yellow-500 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Site Configuration Issue</AlertTitle>
                <AlertDescription>
                  Using fallback site configuration. Some features may be limited.
                </AlertDescription>
              </Alert>
            )}
            
            {isLoadingSite ? (
              <div className="flex justify-center p-6">
                <LoadingSpinner size="lg" />
                <span className="ml-2">Loading site information...</span>
              </div>
            ) : (
              <GlassPanel className={`${isMobile ? 'p-4' : 'p-6'}`}>
                <DeviceForm 
                  device={device}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  validationErrors={validationErrors}
                />
              </GlassPanel>
            )}
          </div>
        </ErrorBoundary>
      </div>
      <Toaster position="top-right" closeButton />
    </div>
  );
};

export default AddDevice;
