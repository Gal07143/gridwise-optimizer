// components/admin/AIModelTrainer.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';

const AIModelTrainer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const trainModel = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/train');
      setResult(`Model trained: R² = ${res.data.score}`);
    } catch (err) {
      setResult('Training failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Trainer</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={trainModel} disabled={loading}>
          {loading ? 'Training...' : 'Train Now'}
        </Button>
        {result && <p className="text-sm mt-2">{result}</p>}
      </CardContent>
    </Card>
  );
};

export default AIModelTrainer;
