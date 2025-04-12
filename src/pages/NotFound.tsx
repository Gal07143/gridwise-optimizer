import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Page not found</p>
      <Button onClick={() => navigate('/')}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default NotFound; 