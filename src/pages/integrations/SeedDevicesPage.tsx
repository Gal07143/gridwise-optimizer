
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { seedDeviceModels } from '@/services/deviceModelsService';
import { ChevronLeft, Loader2, Database, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const SeedDevicesPage = () => {
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedComplete, setSeedComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setError(null);
    
    try {
      const result = await seedDeviceModels();
      
      if (result) {
        setSeedComplete(true);
        toast.success('Successfully seeded the device database!');
      } else {
        setError('Failed to seed the database. Check console for details.');
        toast.error('Database seeding failed');
      }
    } catch (err) {
      console.error('Error seeding database:', err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
      toast.error('An error occurred while seeding the database');
    } finally {
      setIsSeeding(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="p-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <div onClick={() => navigate(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </div>
          </Button>
          <h1 className="text-2xl font-semibold">Seed Device Database</h1>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Seed Utility
            </CardTitle>
            <CardDescription>
              Populate your device database with sample manufacturers and models for testing and development.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This utility will add 500+ sample device models to your database. This operation is intended for development and testing environments.
                It may take a few moments to complete.
              </AlertDescription>
            </Alert>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {seedComplete ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <h3 className="text-green-600 dark:text-green-400 font-medium mb-2">Database Seeded Successfully</h3>
                <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                  Your device database has been successfully populated with sample data.
                </p>
                <div className="flex gap-3">
                  <Button onClick={() => navigate('/integrations')}>
                    View Device Models
                  </Button>
                  <Button variant="outline" onClick={() => setSeedComplete(false)}>
                    Seed Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  Click the button to populate your database with sample device models.
                </p>
                <Button 
                  onClick={handleSeedDatabase} 
                  disabled={isSeeding}
                  className="min-w-[150px]"
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    'Seed Database'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate('/integrations')}>
            Back to Integrations
          </Button>
          
          {seedComplete && (
            <div className="text-sm text-muted-foreground">
              Added 500+ device models across multiple device categories
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default SeedDevicesPage;
