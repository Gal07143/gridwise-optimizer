
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, DollarSign, BarChart3 } from 'lucide-react';
import { fetchEnergySavingProjects } from '@/services/myems';
import type { EnergySavingProject } from '@/types/myems';

interface ProjectCardProps {
  project: EnergySavingProject;
  onClick?: (project: EnergySavingProject) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned':
      return 'secondary';
    case 'in-progress':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // Calculate progress based on dates
  const calculateProgress = () => {
    if (project.status === 'completed') return 100;
    if (project.status === 'cancelled') return 0;
    
    const now = new Date();
    const start = new Date(project.start_date);
    
    if (project.end_date) {
      const end = new Date(project.end_date);
      if (now > end) return 100;
      
      const total = end.getTime() - start.getTime();
      const current = now.getTime() - start.getTime();
      return Math.round((current / total) * 100);
    }
    
    return 0;
  };
  
  const progress = calculateProgress();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick && onClick(project)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{project.name}</h3>
          <Badge variant={getStatusColor(project.status) as any}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description || 'No description provided.'}
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>
              {new Date(project.start_date).toLocaleDateString()} 
              {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
            </span>
          </div>
          
          {project.investment_cost && (
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{project.investment_cost} {project.currency || 'USD'}</span>
            </div>
          )}
          
          {project.target_savings && (
            <div className="flex items-center text-sm">
              <BarChart3 className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Target: {project.target_savings} {project.target_unit}</span>
            </div>
          )}
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ProjectListProps {
  onSelectProject?: (project: EnergySavingProject) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<EnergySavingProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const data = await fetchEnergySavingProjects();
      setProjects(data);
      setLoading(false);
    };

    loadProjects();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Energy Saving Projects</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onClick={onSelectProject}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No energy saving projects found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectList;
