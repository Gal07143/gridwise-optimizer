
import { toast } from 'sonner';

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
