
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Building, Home, Layers, Grid3X3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchSpaceHierarchy } from '@/services/myems';
import type { Space } from '@/types/myems';

interface SpaceTreeProps {
  spaces: Space[];
  onSelectSpace?: (space: Space) => void;
  selectedSpaceId?: string;
}

const SpaceIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'site':
      return <Home className="w-4 h-4" />;
    case 'building':
      return <Building className="w-4 h-4" />;
    case 'floor':
      return <Layers className="w-4 h-4" />;
    default:
      return <Grid3X3 className="w-4 h-4" />;
  }
};

const SpaceTree: React.FC<SpaceTreeProps> = ({ spaces, onSelectSpace, selectedSpaceId }) => {
  const [expandedSpaces, setExpandedSpaces] = useState<Record<string, boolean>>({});

  const toggleExpand = (spaceId: string) => {
    setExpandedSpaces(prev => ({
      ...prev,
      [spaceId]: !prev[spaceId]
    }));
  };

  return (
    <ul className="space-y-1">
      {spaces.map((space) => (
        <li key={space.id}>
          <div className={`flex items-center p-1 hover:bg-accent rounded-md ${selectedSpaceId === space.id ? 'bg-accent' : ''}`}>
            {space.children && space.children.length > 0 ? (
              <button 
                onClick={() => toggleExpand(space.id)} 
                className="mr-1 p-1 hover:bg-accent rounded-full"
              >
                {expandedSpaces[space.id] ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
              </button>
            ) : (
              <span className="ml-6"></span>
            )}
            
            <SpaceIcon type={space.type} />
            
            <button
              onClick={() => onSelectSpace && onSelectSpace(space)}
              className={`ml-2 text-sm hover:text-primary ${selectedSpaceId === space.id ? 'font-medium' : ''}`}
            >
              {space.name}
            </button>
          </div>
          
          {expandedSpaces[space.id] && space.children && space.children.length > 0 && (
            <div className="ml-6 mt-1">
              <SpaceTree 
                spaces={space.children} 
                onSelectSpace={onSelectSpace}
                selectedSpaceId={selectedSpaceId}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

interface SpaceHierarchyProps {
  onSelectSpace?: (space: Space) => void;
  selectedSpaceId?: string;
}

const SpaceHierarchy: React.FC<SpaceHierarchyProps> = ({ onSelectSpace, selectedSpaceId }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpaces = async () => {
      setLoading(true);
      const data = await fetchSpaceHierarchy();
      setSpaces(data);
      setLoading(false);
    };

    loadSpaces();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Spaces</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : spaces.length > 0 ? (
          <SpaceTree 
            spaces={spaces} 
            onSelectSpace={onSelectSpace}
            selectedSpaceId={selectedSpaceId}
          />
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No spaces found.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {/* Open dialog to add space */}}
            >
              Add Space
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpaceHierarchy;
