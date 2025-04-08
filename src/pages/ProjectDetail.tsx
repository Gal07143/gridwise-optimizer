
import React from 'react';
import { useParams } from 'react-router-dom';
import { Main } from '@/components/ui/main';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Main title={`Project ${id}`}>
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Details for project ID: {id}
      </p>
    </Main>
  );
};

export default ProjectDetail;
