
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Tool,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Wrench,
  Clock4,
  FileText,
  History,
  User,
  BatteryCharging,
  RefreshCw,
  Zap,
  HelpCircle,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAnomalies,
  getMaintenanceRecommendations,
  getSystemHealthPrediction,
  type AnomalyDetection,
  type MaintenanceRecommendation,
  type SystemHealthPrediction
} from '@/services/predictiveMaintenanceService';
import { getDeviceMaintenanceRecords } from '@/services/devices/maintenanceService';

interface DeviceMaintenanceProps {
  deviceId: string;
  deviceType: string;
  deviceStatus: string;
  deviceName: string;
  installationDate?: string;
}

const DeviceMaintenance: React.FC<DeviceMaintenanceProps> = ({
  deviceId,
  deviceType,
  deviceStatus,
  deviceName,
  installationDate
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('health');
  const [maintenanceRecords, setMaintenanceRecords] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [recommendations, setRecommendations] = useState<MaintenanceRecommendation[]>([]);
  const [healthPrediction, setHealthPrediction] = useState<SystemHealthPrediction | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<MaintenanceRecommendation | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Load all data in parallel
        const [records, anomaliesData, recommendationsData, healthData] = await Promise.all([
          getDeviceMaintenanceRecords(deviceId),
          getAnomalies(deviceId),
          getMaintenanceRecommendations(deviceId),
          getSystemHealthPrediction(deviceId)
        ]);
        
        setMaintenanceRecords(records);
        setAnomalies(anomaliesData);
        setRecommendations(recommendationsData);
        setHealthPrediction(healthData);
      } catch (error) {
        console.error("Error loading maintenance data:", error);
        toast.error("Failed to load maintenance data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [deviceId]);
  
  const handleRefreshData = async () => {
    setIsLoading(true);
    toast.info("Refreshing maintenance data...");
    
    try {
      const [records, anomaliesData, recommendationsData, healthData] = await Promise.all([
        getDeviceMaintenanceRecords(deviceId),
        getAnomalies(deviceId),
        getMaintenanceRecommendations(deviceId),
        getSystemHealthPrediction(deviceId)
      ]);
      
      setMaintenanceRecords(records);
      setAnomalies(anomaliesData);
      setRecommendations(recommendationsData);
      setHealthPrediction(healthData);
      
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing maintenance data:", error);
      toast.error("Failed to refresh maintenance data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScheduleMaintenance = (recommendation: MaintenanceRecommendation) => {
    setSelectedRecommendation(recommendation);
    setShowScheduleDialog(true);
  };
  
  const confirmScheduleMaintenance = () => {
    if (!selectedRecommendation) return;
    
    toast.success(`Maintenance scheduled for ${selectedRecommendation.description}`);
    setShowScheduleDialog(false);
    setSelectedRecommendation(null);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getDeviceWarrantyInfo = () => {
    // Simulated warranty information based on device type
    const warranties = {
      'solar': { years: 25, parts: ['Panels', 'Mounting Hardware'], labor: 5 },
      'battery': { years: 10, parts: ['Cells', 'BMS', 'Inverter'], labor: 3 },
      'wind': { years: 15, parts: ['Blades', 'Generator', 'Controls'], labor: 2 },
      'ev_charger': { years: 5, parts: ['Charging Unit', 'Cable'], labor: 1 },
      'grid': { years: 10, parts: ['Inverter', 'Monitoring Hardware'], labor: 2 },
      'load': { years: 5, parts: ['Monitoring Equipment'], labor: 1 }
    };
    
    const defaultWarranty = { years: 5, parts: ['All Components'], labor: 1 };
    return warranties[deviceType as keyof typeof warranties] || defaultWarranty;
  };
  
  const warrantyInfo = getDeviceWarrantyInfo();
  
  // Calculate warranty status
  const calculateWarrantyStatus = () => {
    if (!installationDate) return { expired: true, daysLeft: 0, yearsLeft: 0 };
    
    const installDate = new Date(installationDate);
    const warrantyEndDate = new Date(installDate);
    warrantyEndDate.setFullYear(installDate.getFullYear() + warrantyInfo.years);
    
    const now = new Date();
    const diffTime = warrantyEndDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const yearsLeft = daysLeft / 365;
    
    return {
      expired: daysLeft <= 0,
      daysLeft: Math.max(0, daysLeft),
      yearsLeft: Math.max(0, Number(yearsLeft.toFixed(1)))
    };
  };
  
  const warrantyStatus = calculateWarrantyStatus();
  
  // Get device age
  const getDeviceAge = () => {
    if (!installationDate) return { years: 0, months: 0 };
    
    const installDate = new Date(installationDate);
    const now = new Date();
    
    const years = now.getFullYear() - installDate.getFullYear();
    const months = now.getMonth() - installDate.getMonth();
    
    let adjustedYears = years;
    let adjustedMonths = months;
    
    if (months < 0) {
      adjustedYears--;
      adjustedMonths = 12 + months;
    }
    
    return { years: adjustedYears, months: adjustedMonths };
  };
  
  const deviceAge = getDeviceAge();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Tool size={18} />
            Maintenance & Predictive Health
          </h3>
          <p className="text-sm text-muted-foreground">
            Monitor device health and schedule maintenance
          </p>
        </div>
        
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={handleRefreshData}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Health Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-24 mb-2" />
            ) : (
              <div className="flex items-center gap-2">
                <div className={`text-4xl font-bold ${getHealthColor(healthPrediction?.healthScore || 0)}`}>
                  {healthPrediction?.healthScore || 0}%
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-muted">
                  {healthPrediction?.healthScore && healthPrediction.healthScore >= 90 ? 'Excellent' :
                   healthPrediction?.healthScore && healthPrediction.healthScore >= 75 ? 'Good' :
                   healthPrediction?.healthScore && healthPrediction.healthScore >= 60 ? 'Fair' : 'Poor'}
                </div>
              </div>
            )}
            
            {isLoading ? (
              <Skeleton className="h-4 w-full mt-2" />
            ) : (
              <Progress 
                value={healthPrediction?.healthScore || 0} 
                className="h-2 mt-1"
              />
            )}
            
            {isLoading ? (
              <Skeleton className="h-4 w-full mt-2" />
            ) : healthPrediction ? (
              <div className="text-xs text-muted-foreground mt-2">
                <div className="flex justify-between">
                  <span>Remaining Lifespan:</span>
                  <span className="font-medium">
                    {Math.round(healthPrediction.remainingLifespan.hours / 24 / 365 * 10) / 10} years
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Failure Probability:</span>
                  <span className={`font-medium ${
                    healthPrediction.failureProbability > 0.2 ? 'text-red-500' : 
                    healthPrediction.failureProbability > 0.1 ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>
                    {Math.round(healthPrediction.failureProbability * 100)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground mt-2">
                No health prediction data available
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Warranty Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Warranty Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
              </>
            ) : (
              <>
                <div className="flex items-center mb-1">
                  <Tag size={16} className="mr-2 text-primary" />
                  <span className="text-sm font-medium">{warrantyInfo.years} Year Warranty</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {installationDate ? (
                    <>
                      <div className="flex justify-between mt-1">
                        <span>Installation Date:</span>
                        <span className="font-medium">{formatDate(installationDate)}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Device Age:</span>
                        <span className="font-medium">
                          {deviceAge.years > 0 ? `${deviceAge.years} ${deviceAge.years === 1 ? 'year' : 'years'}` : ''} 
                          {deviceAge.months > 0 ? ` ${deviceAge.months} ${deviceAge.months === 1 ? 'month' : 'months'}` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Warranty Status:</span>
                        {warrantyStatus.expired ? (
                          <span className="font-medium text-red-500">Expired</span>
                        ) : (
                          <span className="font-medium text-green-500">
                            {warrantyStatus.yearsLeft > 0 
                              ? `${warrantyStatus.yearsLeft} years left` 
                              : `${warrantyStatus.daysLeft} days left`}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-yellow-500 mt-2">
                      Installation date not recorded
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-xs">
                  <div className="font-medium">Covered Components:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {warrantyInfo.parts.map((part, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-blue-500/10 text-blue-600 border-blue-200"
                      >
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Next Maintenance Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Next Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </>
            ) : recommendations.length > 0 ? (
              <>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <div className="text-sm font-medium">
                    {formatDate(recommendations[0].dueDate)}
                  </div>
                  <Badge variant={recommendations[0].priority === 'critical' || recommendations[0].priority === 'high' 
                    ? 'destructive' 
                    : recommendations[0].priority === 'medium' 
                      ? 'default' 
                      : 'secondary'}>
                    {recommendations[0].priority.charAt(0).toUpperCase() + recommendations[0].priority.slice(1)}
                  </Badge>
                </div>
                
                <div className="mt-2 text-sm">
                  {recommendations[0].description}
                </div>
                
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Clock size={14} />
                  <span>Est. downtime: {recommendations[0].estimatedDowntime}</span>
                </div>
                
                <Button 
                  className="w-full mt-3 gap-1" 
                  size="sm"
                  onClick={() => handleScheduleMaintenance(recommendations[0])}
                >
                  <Calendar size={14} />
                  Schedule Maintenance
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center mb-1">
                  <CheckCircle size={16} className="mr-2 text-green-500" />
                  <span className="text-sm font-medium">No maintenance needed</span>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Device is operating normally and doesn't require maintenance at this time.
                </div>
                
                {healthPrediction && (
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Next check:</span>
                    <span className="font-medium">{formatDate(healthPrediction.nextMaintenanceDate)}</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health">Health Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">
            Recommendations 
            {recommendations.length > 0 && (
              <Badge className="ml-2" variant="destructive">{recommendations.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Maintenance History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="health" className="mt-4 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[150px] w-full" />
              </div>
            </div>
          ) : !healthPrediction ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Health data unavailable</AlertTitle>
              <AlertDescription>
                Could not load health metrics for this device. Try refreshing the data.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthPrediction.metrics.map((metric, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-base">{metric.name}</CardTitle>
                      <CardDescription>
                        Current vs Optimal
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-0">
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span className={`font-medium ${
                            metric.trend === 'improving' ? 'text-green-500' : 
                            metric.trend === 'degrading' ? 'text-red-500' : ''
                          }`}>
                            {metric.current}{metric.name.toLowerCase().includes('temperature') ? '°C' : '%'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Optimal:</span>
                          <span className="font-medium">{metric.optimal}{metric.name.toLowerCase().includes('temperature') ? '°C' : '%'}</span>
                        </div>
                        <Progress 
                          value={metric.name.toLowerCase().includes('wear') 
                            ? 100 - (metric.current / metric.optimal * 100)
                            : metric.current / metric.optimal * 100
                          } 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-1 pb-3">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <span>Trend: </span>
                        <Badge className="ml-2" variant={
                          metric.trend === 'improving' ? 'outline' : 
                          metric.trend === 'degrading' ? 'destructive' : 'secondary'
                        }>
                          {metric.trend.charAt(0).toUpperCase() + metric.trend.slice(1)}
                        </Badge>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {anomalies.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-base font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-500" />
                    <span>Detected Anomalies</span>
                  </h4>
                  
                  <div className="space-y-3">
                    {anomalies.map((anomaly, index) => (
                      <Alert key={index} variant={
                        anomaly.severity === 'high' ? 'destructive' : 
                        anomaly.severity === 'medium' ? 'default' : 'outline'
                      }>
                        <AlertTitle className="flex items-center gap-2">
                          {anomaly.metric}
                          <Badge>{anomaly.severity.charAt(0).toUpperCase() + anomaly.severity.slice(1)}</Badge>
                        </AlertTitle>
                        <AlertDescription>
                          <div className="text-sm mt-1">
                            Value: {anomaly.value} (Expected: {anomaly.expectedValue})
                          </div>
                          <div className="text-sm mt-1">
                            Deviation: {anomaly.deviation.toFixed(1)}% • Confidence: {anomaly.confidence * 100}%
                          </div>
                          
                          {anomaly.recommendations.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm font-medium">Recommendations:</div>
                              <ul className="list-disc pl-5 mt-1 text-sm">
                                {anomaly.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
              <Skeleton className="h-[120px] w-full" />
            </div>
          ) : recommendations.length === 0 ? (
            <Card className="bg-muted/20">
              <CardContent className="pt-6 pb-6 text-center">
                <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium">No Maintenance Recommendations</h3>
                <p className="text-muted-foreground mt-1">
                  This device is operating normally and doesn't require maintenance at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-1" variant={
                          recommendation.recommendationType === 'corrective' ? 'destructive' : 
                          recommendation.recommendationType === 'preventive' ? 'default' : 'secondary'
                        }>
                          {recommendation.recommendationType.charAt(0).toUpperCase() + recommendation.recommendationType.slice(1)}
                        </Badge>
                        <CardTitle className="text-base">{recommendation.description}</CardTitle>
                      </div>
                      <Badge variant={
                        recommendation.priority === 'critical' ? 'destructive' : 
                        recommendation.priority === 'high' ? 'destructive' : 
                        recommendation.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Due Date</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar size={14} />
                          <span className="text-sm font-medium">{formatDate(recommendation.dueDate)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Est. Downtime</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={14} />
                          <span className="text-sm font-medium">{recommendation.estimatedDowntime}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Est. Cost</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-sm font-medium">${recommendation.estimatedCost}</span>
                        </div>
                      </div>
                    </div>
                    
                    {recommendation.parts && recommendation.parts.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-muted-foreground mb-1">Required Parts</div>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.parts.map((part, i) => (
                            <Badge key={i} variant="outline" className={part.inStock 
                              ? "bg-green-500/10 text-green-600 border-green-200"
                              : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                            }>
                              {part.name} ({part.quantity}) {part.inStock ? '✓' : '⚠️'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {recommendation.steps && recommendation.steps.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-muted-foreground mb-1">Maintenance Steps</div>
                        <ul className="text-xs list-disc pl-5">
                          {recommendation.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      className="w-full gap-1" 
                      size="sm"
                      onClick={() => handleScheduleMaintenance(recommendation)}
                    >
                      <Calendar size={14} />
                      Schedule Maintenance
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
            </div>
          ) : maintenanceRecords.length === 0 ? (
            <Card className="bg-muted/20">
              <CardContent className="pt-6 pb-6 text-center">
                <History size={36} className="text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No Maintenance History</h3>
                <p className="text-muted-foreground mt-1">
                  This device has no recorded maintenance history.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[400px] rounded-md border p-4">
              <div className="relative pl-6 pb-6">
                {maintenanceRecords.map((record, index) => (
                  <div key={record.id} className="mb-6 relative">
                    <div className="absolute left-[-27px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Wrench size={12} className="text-primary-foreground" />
                    </div>
                    
                    {index < maintenanceRecords.length - 1 && (
                      <div className="absolute left-[-25px] top-5 w-1 h-[calc(100%-10px)] bg-border"></div>
                    )}
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {record.maintenance_type}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {record.completed_date ? 'Completed' : 'Scheduled'}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                    <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <FileText size={14} className="mr-2" />
                                  View Report
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <History size={14} className="mr-2" />
                                  View Timeline
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="font-medium">
                              {record.completed_date ? formatDate(record.completed_date) : formatDate(record.scheduled_date)}
                            </span>
                          </div>
                          
                          {record.performed_by && (
                            <div>
                              <span className="text-muted-foreground">Performed by: </span>
                              <span className="font-medium">{record.performed_by}</span>
                            </div>
                          )}
                        </div>
                        
                        {record.description && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Description: </span>
                            <span>{record.description}</span>
                          </div>
                        )}
                        
                        {record.notes && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Notes: </span>
                            <span>{record.notes}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Schedule Maintenance Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              {selectedRecommendation && `Schedule maintenance for ${selectedRecommendation.description}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Recommended Date</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedRecommendation && formatDate(selectedRecommendation.dueDate)}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar size={14} className="mr-2" />
                  Change Date
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Maintenance Type</div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    selectedRecommendation?.recommendationType === 'corrective' ? 'destructive' : 
                    selectedRecommendation?.recommendationType === 'preventive' ? 'default' : 'secondary'
                  }>
                    {selectedRecommendation?.recommendationType.charAt(0).toUpperCase() + 
                     selectedRecommendation?.recommendationType.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedRecommendation?.priority.charAt(0).toUpperCase() + 
                     selectedRecommendation?.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Maintenance Details</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Estimated downtime: </span>
                    <span className="font-medium">{selectedRecommendation?.estimatedDowntime}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Estimated cost: </span>
                    <span className="font-medium">${selectedRecommendation?.estimatedCost}</span>
                  </div>
                </div>
              </div>
              
              {selectedRecommendation?.parts && selectedRecommendation.parts.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Required Parts</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecommendation.parts.map((part, i) => (
                      <Badge key={i} variant="outline" className={part.inStock 
                        ? "bg-green-500/10 text-green-600 border-green-200"
                        : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
                      }>
                        {part.name} ({part.quantity}) {part.inStock ? '✓' : '⚠️'}
                      </Badge>
                    ))}
                  </div>
                  
                  {selectedRecommendation.parts.some(p => !p.inStock) && (
                    <div className="text-xs text-yellow-600 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      <span>Some parts are not in stock and may need to be ordered</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmScheduleMaintenance}>
              <Calendar size={16} className="mr-1" />
              Confirm Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceMaintenance;
