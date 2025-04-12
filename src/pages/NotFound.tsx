import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * NotFound component for displaying 404 error pages
 * Provides navigation options and suggestions for common paths
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Common paths that users might be looking for
  const suggestions = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/devices', label: 'Devices' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/settings', label: 'Settings' },
  ];

  // Find suggestions based on the current path
  const relevantSuggestions = suggestions.filter(suggestion =>
    suggestion.path.toLowerCase().includes(location.pathname.toLowerCase()) ||
    suggestion.label.toLowerCase().includes(location.pathname.toLowerCase())
  );

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto rounded-full bg-red-100 dark:bg-red-900/20 p-3 w-fit">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-4xl font-bold">404</CardTitle>
            <CardDescription className="text-xl">Page Not Found</CardDescription>
            <p className="text-muted-foreground">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="flex-1" 
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            {relevantSuggestions.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Did you mean to visit:
                </h3>
                <div className="grid gap-2">
                  {relevantSuggestions.map((suggestion) => (
                    <Button
                      key={suggestion.path}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(suggestion.path)}
                    >
                      {suggestion.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground pt-4">
              <p>If you believe this is a mistake, please contact</p>
              <a 
                href="mailto:support@gridwise.com" 
                className="text-primary hover:text-primary/90 hover:underline"
              >
                support@gridwise.com
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound; 