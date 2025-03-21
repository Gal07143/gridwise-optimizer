
import React from 'react';
import { Download, ExternalLink, BookOpen } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface IntegrationInstallationCardProps {
  categoryId: string;
}

const IntegrationInstallationCard: React.FC<IntegrationInstallationCardProps> = ({ categoryId }) => {
  const getInstallationGuides = () => {
    // In a real app, this would come from an API
    return [
      {
        id: '1',
        title: 'Quick Start Guide',
        description: 'Get up and running with basic installation steps',
        fileSize: '1.2 MB',
        fileType: 'PDF'
      },
      {
        id: '2',
        title: 'Advanced Configuration',
        description: 'Complete technical documentation for advanced setups',
        fileSize: '3.5 MB',
        fileType: 'PDF'
      },
      {
        id: '3',
        title: 'Troubleshooting',
        description: 'Common issues and their solutions',
        fileSize: '850 KB',
        fileType: 'PDF'
      }
    ];
  };
  
  const getCategoryName = () => {
    switch(categoryId) {
      case 'batteries': return 'Battery';
      case 'inverters': return 'Inverter';
      case 'ev-chargers': return 'EV Charger';
      case 'meters': return 'Meter';
      case 'controllers': return 'Controller';
      default: return 'Device';
    }
  };
  
  const handleDownloadGuide = (guideId: string, title: string) => {
    toast.success(`Downloading ${title}...`);
    
    setTimeout(() => {
      toast.info(`${title} downloaded successfully`);
    }, 1500);
  };
  
  const handleViewDocumentation = () => {
    toast.info("Opening external documentation");
    // In a real app, this would open a new tab with documentation
  };

  const guides = getInstallationGuides();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Installation Guides</CardTitle>
        <CardDescription>
          Documentation for installing and configuring {getCategoryName().toLowerCase()} devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {guides.map(guide => (
          <div key={guide.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div>
              <h4 className="font-medium text-sm">{guide.title}</h4>
              <p className="text-xs text-muted-foreground">{guide.description}</p>
              <div className="flex items-center mt-1 gap-2">
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {guide.fileType}
                </span>
                <span className="text-xs text-muted-foreground">
                  {guide.fileSize}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8"
              onClick={() => handleDownloadGuide(guide.id, guide.title)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" size="sm" onClick={handleViewDocumentation}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View All Documentation
        </Button>
        <Button variant="outline" size="sm">
          <BookOpen className="h-4 w-4 mr-2" />
          Installation Videos
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IntegrationInstallationCard;
