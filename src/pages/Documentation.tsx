
import React, { useState } from 'react';
import { Book, FileText, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AppLayout from '@/components/layout/AppLayout';

const Documentation = () => {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Documentation</h1>
          <p className="text-muted-foreground">Energy Management System Documentation and Resources</p>
        </div>
        
        <div className="max-w-4xl mx-auto text-center py-12">
          <Book className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-4">Documentation Coming Soon</h2>
          <p className="text-muted-foreground mb-6">
            We're currently building out our documentation library. Check back soon for comprehensive guides, 
            tutorials, and reference materials.
          </p>
          <div className="flex justify-center gap-4">
            <div className="p-4 border rounded-lg bg-muted/20 w-60 text-center">
              <FileText className="mx-auto mb-2" />
              <h3 className="font-medium mb-1">User Guides</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
            <div className="p-4 border rounded-lg bg-muted/20 w-60 text-center">
              <Search className="mx-auto mb-2" />
              <h3 className="font-medium mb-1">API Reference</h3>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Documentation;
