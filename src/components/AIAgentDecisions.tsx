import React, { useState, useEffect } from 'react';
import { AIAgentService, AgentDecision } from '@/services/aiAgentService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle, XCircle, AlertTriangle, Clock, 
  Activity, Battery, Sun, DollarSign, RefreshCw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AIAgentDecisionsProps {
  deviceId?: string;
  limit?: number;
}

export const AIAgentDecisions: React.FC<AIAgentDecisionsProps> = ({ 
  deviceId,
  limit = 10
}) => {
  const [agentService] = useState(() => new AIAgentService({
    automationLevel: 50,
    confidenceThreshold: 0.7,
    enableAutonomousActions: false,
    enablePredictiveMaintenance: true,
    enableCostOptimization: true,
    enableUserBehaviorLearning: true
  }));
  
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDecision, setSelectedDecision] = useState<AgentDecision | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Load decisions on component mount
  useEffect(() => {
    const loadDecisions = async () => {
      try {
        setLoading(true);
        await agentService.initialize();
        
        // Get all decisions
        const allDecisions = agentService.getDecisionLog();
        
        // Filter by device if provided
        const filteredDecisions = deviceId 
          ? allDecisions.filter(d => d.deviceId === deviceId)
          : allDecisions;
        
        // Sort by timestamp (newest first)
        const sortedDecisions = filteredDecisions.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        );
        
        // Apply limit
        const limitedDecisions = sortedDecisions.slice(0, limit);
        
        setDecisions(limitedDecisions);
        setLoading(false);
      } catch (err) {
        console.error('Error loading agent decisions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load agent decisions');
        setLoading(false);
      }
    };
    
    loadDecisions();
    
    return () => {
      agentService.dispose();
    };
  }, [deviceId, limit, agentService]);

  // Filter decisions by status
  const filteredDecisions = decisions.filter(decision => {
    if (activeTab === 'all') return true;
    return decision.status === activeTab;
  });

  // Handle decision selection
  const handleDecisionSelect = (decision: AgentDecision) => {
    setSelectedDecision(decision);
  };

  // Handle decision approval
  const handleApproveDecision = async () => {
    if (!selectedDecision) return;
    
    try {
      setActionInProgress(true);
      
      // Update decision status
      selectedDecision.status = 'approved';
      
      // Execute decision if it doesn't require approval
      if (!selectedDecision.requiresApproval) {
        await agentService.executeDecision(selectedDecision.id);
      }
      
      // Update decisions list
      setDecisions(prev => 
        prev.map(d => d.id === selectedDecision.id ? selectedDecision : d)
      );
      
      setSelectedDecision(null);
      setActionInProgress(false);
    } catch (err) {
      console.error('Error approving decision:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve decision');
      setActionInProgress(false);
    }
  };

  // Handle decision rejection
  const handleRejectDecision = async () => {
    if (!selectedDecision) return;
    
    try {
      setActionInProgress(true);
      
      // Update decision status
      selectedDecision.status = 'rejected';
      
      // Update decisions list
      setDecisions(prev => 
        prev.map(d => d.id === selectedDecision.id ? selectedDecision : d)
      );
      
      setSelectedDecision(null);
      setActionInProgress(false);
    } catch (err) {
      console.error('Error rejecting decision:', err);
      setError(err instanceof Error ? err.message : 'Failed to reject decision');
      setActionInProgress(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      
      // Re-initialize agent service
      await agentService.initialize();
      
      // Get all decisions
      const allDecisions = agentService.getDecisionLog();
      
      // Filter by device if provided
      const filteredDecisions = deviceId 
        ? allDecisions.filter(d => d.deviceId === deviceId)
        : allDecisions;
      
      // Sort by timestamp (newest first)
      const sortedDecisions = filteredDecisions.sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      );
      
      // Apply limit
      const limitedDecisions = sortedDecisions.slice(0, limit);
      
      setDecisions(limitedDecisions);
      setLoading(false);
    } catch (err) {
      console.error('Error refreshing decisions:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh decisions');
      setLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      case 'executed':
        return <Badge variant="default" className="flex items-center gap-1"><Activity className="h-3 w-3" /> Executed</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes('maintenance') || action.includes('health')) {
      return <Battery className="h-5 w-5 text-blue-500" />;
    } else if (action.includes('Optimize') || action.includes('energy')) {
      return <Sun className="h-5 w-5 text-yellow-500" />;
    } else if (action.includes('cost') || action.includes('savings')) {
      return <DollarSign className="h-5 w-5 text-green-500" />;
    } else {
      return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (decisions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Decisions</CardTitle>
          <CardDescription>No decisions available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No AI agent decisions found for this device.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI Agent Decisions</CardTitle>
          <CardDescription>Decisions made by the AI agent</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="executed">Executed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredDecisions.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No {activeTab} decisions found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDecisions.map((decision) => (
                  <div 
                    key={decision.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedDecision?.id === decision.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleDecisionSelect(decision)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        {getActionIcon(decision.action)}
                        <div>
                          <h3 className="font-medium">{decision.action}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(decision.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(decision.status)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">{decision.details}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 rounded-full bg-blue-500" 
                            style={{ width: `${decision.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs">{Math.round(decision.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {selectedDecision && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium mb-2">Decision Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Action:</span>
                <span className="font-medium">{selectedDecision.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span>{getStatusBadge(selectedDecision.status)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confidence:</span>
                <span>{Math.round(selectedDecision.confidence * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Requires Approval:</span>
                <span>{selectedDecision.requiresApproval ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Risk Level:</span>
                <span className={`font-medium ${
                  selectedDecision.impact.riskLevel === 'high' ? 'text-red-500' :
                  selectedDecision.impact.riskLevel === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {selectedDecision.impact.riskLevel.charAt(0).toUpperCase() + selectedDecision.impact.riskLevel.slice(1)}
                </span>
              </div>
              {selectedDecision.impact.energySavings && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Energy Savings:</span>
                  <span>{selectedDecision.impact.energySavings.toFixed(2)} kWh</span>
                </div>
              )}
              {selectedDecision.impact.costSavings && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Cost Savings:</span>
                  <span>${selectedDecision.impact.costSavings.toFixed(2)}</span>
                </div>
              )}
              {selectedDecision.impact.healthImprovement && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Health Improvement:</span>
                  <span>{(selectedDecision.impact.healthImprovement * 100).toFixed(1)}%</span>
                </div>
              )}
              <div className="mt-4">
                <h4 className="font-medium mb-1">Details:</h4>
                <p className="text-sm">{selectedDecision.details}</p>
              </div>
            </div>
            
            {selectedDecision.status === 'pending' && (
              <div className="mt-4 flex gap-2">
                <Button 
                  onClick={handleApproveDecision} 
                  disabled={actionInProgress}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleRejectDecision}
                  disabled={actionInProgress}
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 