
import React from 'react';
import { useAppStore } from '@/store/appStore';
import HighTechEnergyFlow from './HighTechEnergyFlow';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnergyFlowWidgetProps {
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showLink?: boolean;
}

const EnergyFlowWidget: React.FC<EnergyFlowWidgetProps> = ({ 
  className,
  variant = 'default',
  showLink = true
}) => {
  const { currentSite } = useAppStore();

  return (
    <div className={cn("relative", className)}>
      <HighTechEnergyFlow 
        siteId={currentSite?.id} 
        variant={variant}
      />
      
      {showLink && (
        <div className="absolute bottom-4 right-4">
          <Button 
            asChild 
            variant="secondary" 
            size="sm" 
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
          >
            <Link to="/energy-optimization" className="flex items-center gap-1">
              Optimize Energy <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnergyFlowWidget;
