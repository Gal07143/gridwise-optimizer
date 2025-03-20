
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { useSecurityStatus, securityAudits, securityScores } from '@/hooks/useSecurityStatus';
import SecurityHeader from '@/components/security/SecurityHeader';
import SecurityOverview from '@/components/security/SecurityOverview';
import RecentActivityCard from '@/components/security/RecentActivityCard';
import AccessControlTab from '@/components/security/AccessControlTab';
import EncryptionTab from '@/components/security/EncryptionTab';
import AuditLogTab from '@/components/security/AuditLogTab';

const Security = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isLoading, overallScore, getScoreColor, getProgressColor, handleRunScan } = useSecurityStatus();
  
  return (
    <AppLayout>
      <div className="p-6 animate-in">
        <SecurityHeader isLoading={isLoading} onRunScan={handleRunScan} />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="encryption">Encryption</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SecurityOverview 
              overallScore={overallScore}
              scoreColor={getScoreColor(overallScore)}
              progressColor={getProgressColor}
              securityScores={securityScores}
            />
            <RecentActivityCard audits={securityAudits} />
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <AccessControlTab />
          </TabsContent>

          <TabsContent value="encryption" className="space-y-6">
            <EncryptionTab />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogTab audits={securityAudits} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Security;
