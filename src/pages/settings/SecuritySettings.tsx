import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SecuritySettings as SecuritySettingsType } from '@/types/settings';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const securitySettingsSchema = z.object({
  authentication: z.object({
    twoFactorEnabled: z.boolean(),
    sessionTimeout: z.number().min(5).max(120),
    passwordPolicy: z.object({
      minLength: z.number().min(8).max(32),
      requireSpecialChars: z.boolean(),
      requireNumbers: z.boolean(),
    }),
  }),
  encryption: z.object({
    enabled: z.boolean(),
    algorithm: z.string(),
    keyRotation: z.number().min(1).max(365),
  }),
  apiSecurity: z.object({
    rateLimiting: z.boolean(),
    allowedOrigins: z.array(z.string()),
    tokenExpiration: z.number().min(1).max(24),
  }),
  auditLogging: z.object({
    enabled: z.boolean(),
    retentionPeriod: z.number().min(1).max(365),
    logLevel: z.enum(['info', 'warning', 'error']),
  }),
});

const SecuritySettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SecuritySettingsType>({
    resolver: zodResolver(securitySettingsSchema),
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        const response = await fetch('/api/security-settings');
        const data = await response.json();
        
        // Set form values
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as keyof SecuritySettingsType, value);
        });
      } catch (err) {
        setError('Failed to load security settings');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data: SecuritySettingsType) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      await fetch('/api/security-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      setError('Failed to save security settings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
              <Switch
                id="twoFactor"
                checked={watch('authentication.twoFactorEnabled')}
                onCheckedChange={(checked) => setValue('authentication.twoFactorEnabled', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                {...register('authentication.sessionTimeout')}
              />
              {errors.authentication?.sessionTimeout && (
                <p className="text-red-500 text-sm">{errors.authentication.sessionTimeout.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="minLength">Minimum Password Length</Label>
              <Input
                id="minLength"
                type="number"
                {...register('authentication.passwordPolicy.minLength')}
              />
              {errors.authentication?.passwordPolicy?.minLength && (
                <p className="text-red-500 text-sm">{errors.authentication.passwordPolicy.minLength.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="requireSpecialChars">Require Special Characters</Label>
              <Switch
                id="requireSpecialChars"
                checked={watch('authentication.passwordPolicy.requireSpecialChars')}
                onCheckedChange={(checked) => setValue('authentication.passwordPolicy.requireSpecialChars', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="requireNumbers">Require Numbers</Label>
              <Switch
                id="requireNumbers"
                checked={watch('authentication.passwordPolicy.requireNumbers')}
                onCheckedChange={(checked) => setValue('authentication.passwordPolicy.requireNumbers', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="rateLimiting">Rate Limiting</Label>
              <Switch
                id="rateLimiting"
                checked={watch('apiSecurity.rateLimiting')}
                onCheckedChange={(checked) => setValue('apiSecurity.rateLimiting', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="tokenExpiration">Token Expiration (hours)</Label>
              <Input
                id="tokenExpiration"
                type="number"
                {...register('apiSecurity.tokenExpiration')}
              />
              {errors.apiSecurity?.tokenExpiration && (
                <p className="text-red-500 text-sm">{errors.apiSecurity.tokenExpiration.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Logging</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auditEnabled">Enable Audit Logging</Label>
              <Switch
                id="auditEnabled"
                checked={watch('auditLogging.enabled')}
                onCheckedChange={(checked) => setValue('auditLogging.enabled', checked)}
              />
            </div>
            
            <div>
              <Label htmlFor="retentionPeriod">Log Retention Period (days)</Label>
              <Input
                id="retentionPeriod"
                type="number"
                {...register('auditLogging.retentionPeriod')}
              />
              {errors.auditLogging?.retentionPeriod && (
                <p className="text-red-500 text-sm">{errors.auditLogging.retentionPeriod.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </ErrorBoundary>
  );
};

export default SecuritySettings; 