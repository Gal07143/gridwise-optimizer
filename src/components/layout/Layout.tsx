import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './Navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeProvider } from '@/components/theme/theme-provider';

/**
 * Layout component that provides the main structure for the application
 * Includes navigation, theme support, and toast notifications
 */
const Layout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="gridwise-theme">
      <div className="relative min-h-screen flex flex-col bg-background">
        <Navigation />
        <ScrollArea className="flex-1">
          <main className="container mx-auto p-6">
            <Outlet />
          </main>
        </ScrollArea>
        <footer className="border-t py-4 px-6">
          <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Gridwise. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: "bg-background text-foreground border border-border",
            success: {
              className: "bg-background text-foreground border-green-500",
              iconTheme: {
                primary: "hsl(var(--success))",
                secondary: "hsl(var(--success-foreground))",
              },
            },
            error: {
              className: "bg-background text-foreground border-destructive",
              iconTheme: {
                primary: "hsl(var(--destructive))",
                secondary: "hsl(var(--destructive-foreground))",
              },
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
};

export default Layout; 