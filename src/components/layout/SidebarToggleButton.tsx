
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface SidebarToggleButtonProps {
  expanded: boolean; // Changed from isExpanded to expanded
  toggleSidebar: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({ expanded, toggleSidebar }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full"
      onClick={toggleSidebar}
      aria-label={expanded ? 'Collapse Sidebar' : 'Expand Sidebar'}
    >
      {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
    </Button>
  );
};

export default SidebarToggleButton;
