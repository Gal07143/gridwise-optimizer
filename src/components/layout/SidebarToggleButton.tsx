
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarToggleButtonProps {
  expanded: boolean;
  onClick: () => void;
  isMobile?: boolean;
  className?: string;
}

const SidebarToggleButton = ({ 
  expanded, 
  onClick, 
  isMobile, 
  className 
}: SidebarToggleButtonProps) => {
  return (
    <Button 
      variant={isMobile ? "outline" : "ghost"}
      size={expanded && !isMobile ? "default" : "icon"} 
      onClick={onClick}
      className={cn("w-full", className)}
    >
      {expanded && !isMobile ? (
        <>
          <Menu size={16} className="mr-2" />
          Collapse
        </>
      ) : (
        <Menu size={16} />
      )}
    </Button>
  );
};

export default SidebarToggleButton;
