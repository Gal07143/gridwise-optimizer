
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Brain, Cpu, LineChart, Zap, BarChart2, Sliders, AlertTriangle, Check, BrainCircuit } from 'lucide-react';

const AIOverview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [modelTraining, setModelTraining] = useState(false);
  
  // Sample AI model data
  const aiModels = [
    { id: '1', name: 'Energy Forecast', type: 'prediction', accuracy: 92, lastTrained: '2025-03-15', status: 'active' },
    { id: '2', name: 'Anomaly Detection', type: 'classification', accuracy: 88, lastTrained: '2025-03-10', status: 'active' },
    { id: '3', name: 'Load Disaggregation', type: 'clustering', accuracy: 78, lastTrained: '2025-02-28', status: 'training' },
    { id: '4', name: 'Maintenance Predictor', type: 'regression', accuracy: 85, lastTrained: '2025-03-05', status: 'active' },
  ];
  
  // Sample performance data
  const performanceData = [
    { date: '2025-02', forecast: 91, anomaly: 84, disaggregation: 76, maintenance: 82 },
    { date: '2025-03', forecast: 92, anomaly: 88, disaggregation: 78, maintenance: 85 },
    { date: '2025-04', forecast: 94, anomaly: 89, disaggregation: 80, maintenance: 87 },
    { date: '2025-05', forecast: 93, anomaly: 91, disaggregation: 82, maintenance: 86 },
    { date: '2025-06', forecast: 95, anomaly: 90, disaggregation: 83, maintenance: 89 },
  ];
  
  // Sample AI-driven insights
  const insights = [
    { id: '1', message: 'Battery charging efficiency decreased by 4% in the last week', severity: 'warning', timestamp: '2025-04-11T10:30:00Z' },
    { id: '2', message: 'Solar production forecasted to be 15% above average tomorrow', severity: 'info', timestamp: '2025-04-11T11:15:00Z' },
    { id: '3', message: 'Inverter #2 showing early signs of performance degradation', severity: 'warning', timestamp: '2025-04-11T09:45:00Z' },
    { id: '4', message: 'Peak demand successfully reduced by 22% using AI optimization', severity: 'success', timestamp: '2025-04-10T18:20:00Z' },
  ];
  
  const handleTrainModel = (id: string) => {
    setModelTraining(true);
    setTimeout(() => {
      setModelTraining(false);
      // In a real app, this would update the model's last trained date
    }, 3000);
  };
  
  return (
    <Main title="AI Overview">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            AI System Overview
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage the AI systems powering your energy management
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-muted/40 p-1 rounded-lg mb-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 bg-transparent h-auto p-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-background py-2 rounded-md"
            >
              <Brain className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="models" 
              className="data-[state=active]:bg-background py-2 rounded-md"
            >
              <Cpu className="h-4 w-4 mr-2" />
              AI Models
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="data-[state=active]:bg-background py-2 rounded-md"
            >
              <LineChart className="h-4 w-4 mr-2" />
              AI Insights
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline">4 Models</Badge>
                </div>
                <h3 className="text-2xl font-bold mt-4">AI Models</h3>
                <p className="text-muted-foreground">Active and monitored</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <BarChart2 className="h-6 w-6 text-primary" />
                  </div>
                  <Badge>85.8%</Badge>
                </div>
                <h3 className="text-2xl font-bold mt-4">Avg. Accuracy</h3>
                <p className="text-muted-foreground">Across all models</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">18% Savings</Badge>
                </div>
                <h3 className="text-2xl font-bold mt-4">Energy Optimized</h3>
                <p className="text-muted-foreground">With AI assistance</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">7 Detected</Badge>
                </div>
                <h3 className="text-2xl font-bold mt-4">Anomalies</h3>
                <p className="text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  AI Model Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis dataKey="date" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Accuracy']} />
                      <Bar dataKey="forecast" name="Energy Forecast" fill="#3b82f6" />
                      <Bar dataKey="anomaly" name="Anomaly Detection" fill="#f59e0b" />
                      <Bar dataKey="disaggregation" name="Load Disaggregation" fill="#10b981" />
                      <Bar dataKey="maintenance" name="Maintenance Predictor" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map(insight => {
                    const IconComponent = insight.severity === 'warning' ? AlertTriangle : 
                      insight.severity === 'success' ? Check : LineChart;
                    
                    const bgColor = insight.severity === 'warning' ? 'bg-amber-100' :
                      insight.severity === 'success' ? 'bg-green-100' :
                      'bg-blue-100';
                    
                    const textColor = insight.severity === 'warning' ? 'text-amber-800' :
                      insight.severity === 'success' ? 'text-green-800' :
                      'text-blue-800';
                    
                    return (
                      <div key={insight.id} className={`p-3 rounded-lg ${bgColor} ${textColor}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div>
                            <p>{insight.message}</p>
                            <p className="text-xs opacity-80 mt-1">
                              {new Date(insight.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="text-center mt-4">
                    <Button variant="outline">View All Insights</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiModels.map(model => (
              <Card key={model.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{model.name}</CardTitle>
                    <Badge 
                      variant={model.status === 'active' ? 'outline' : 'secondary'}
                      className={model.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                    >
                      {model.status === 'training' ? 'Training' : 'Active'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Accuracy</span>
                        <span className="text-sm font-medium">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-medium capitalize">{model.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Trained</p>
                        <p className="font-medium">{new Date(model.lastTrained).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm">
                        <Sliders className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button 
                        size="sm"
                        disabled={modelTraining || model.status === 'training'}
                        onClick={() => handleTrainModel(model.id)}
                      >
                        {modelTraining || model.status === 'training' ? (
                          <>
                            <span className="animate-spin mr-2">◌</span>
                            Training...
                          </>
                        ) : (
                          <>
                            <Cpu className="h-4 w-4 mr-2" />
                            Train Model
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.concat(insights).map((insight, index) => {
                  const IconComponent = insight.severity === 'warning' ? AlertTriangle : 
                    insight.severity === 'success' ? Check : LineChart;
                  
                  const bgColor = insight.severity === 'warning' ? 'bg-amber-100' :
                    insight.severity === 'success' ? 'bg-green-100' :
                    'bg-blue-100';
                  
                  const textColor = insight.severity === 'warning' ? 'text-amber-800' :
                    insight.severity === 'success' ? 'text-green-800' :
                    'text-blue-800';
                  
                  return (
                    <div key={`${insight.id}-${index}`} className={`p-4 rounded-lg ${bgColor} ${textColor}`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{insight.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs opacity-80">
                              {new Date(insight.timestamp).toLocaleString()}
                            </p>
                            <Button size="sm" variant="outline" className="h-7">
                              Take Action
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default AIOverview;
