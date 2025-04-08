
import React from 'react';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';

const Sites = () => {
  return (
    <Main title="Sites">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sites Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Site
        </Button>
      </div>
      
      <div className="grid gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Site Management</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your energy sites from one central location</p>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create and manage all your energy sites, assign devices, and monitor performance metrics.
          </p>
        </div>
      </div>
    </Main>
  );
};

export default Sites;
