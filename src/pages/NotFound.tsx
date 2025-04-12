import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * NotFound component for displaying 404 error pages
 * Provides navigation options to return to home or go back
 */
const NotFound: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <h2 className="text-2xl font-semibold mt-2">Page Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="#" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound; 