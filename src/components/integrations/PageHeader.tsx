
import React from 'react';
import { ChevronLeft, Download, Upload, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface PageHeaderProps {
  categoryName: string;
  categoryId?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ categoryName, categoryId }) => {
  const handleImportDevices = () => {
    toast.info("Import devices dialog would open here");
  };

  const handleExportCatalog = () => {
    toast.success("Exporting device catalog...");
    setTimeout(() => {
      toast.info("Device catalog exported successfully");
    }, 1500);
  };

  const handleShowHelp = () => {
    toast.info("Device Integration Help", {
      description: "This page shows all compatible device models for the selected category. You can filter, sort, and view details for each model.",
      duration: 5000,
    });
  };

  const getCategoryIcon = () => {
    switch(categoryId) {
      case 'batteries':
        return "🔋";
      case 'inverters':
        return "⚡";
      case 'ev-chargers':
        return "🚗";
      case 'meters':
        return "📊";
      case 'controllers':
        return "🎮";
      default:
        return "📱";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/integrations">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold flex items-center">
            <span className="mr-2">{getCategoryIcon()}</span>
            {categoryName}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleImportDevices}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import device models from file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleExportCatalog}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export full device catalog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleShowHelp}>
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help and information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Browse and manage {categoryName.toLowerCase()} device models compatible with your energy management system.
      </p>
    </div>
  );
};

export default PageHeader;
