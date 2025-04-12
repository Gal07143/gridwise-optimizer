
import React, { useState } from 'react';
import { toast } from 'sonner';

// Create a default export for AIOverview component
const AIOverview = () => {
  const [isTraining, setIsTraining] = useState(false);

  // Update the toast calls in the file
  const trainModel = async () => {
    try {
      setIsTraining(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success('AI model trained successfully');
    } catch (error) {
      toast.error('Failed to train AI model');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div>
      <h1>AI Overview Page</h1>
      <button onClick={trainModel} disabled={isTraining}>
        {isTraining ? 'Training...' : 'Train Model'}
      </button>
    </div>
  );
};

export default AIOverview;
