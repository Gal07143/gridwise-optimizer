import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Battery, Zap, FileText, AlertCircle, Package, ChevronRight, Download, Settings, Code, FileCode, CheckCircle2, XCircle, Info, Activity } from 'lucide-react';

interface DeviceModel {
  id: string;
  manufacturer: string;
  model: string;
  deviceType: string;
  protocol: string;
  firmware: string;
  supported: boolean;
  hasManual: boolean;
  hasRegisterMap: boolean;
  description: string;
  technicalSpecs: {
    [key: string]: string | number;
  };
  knownIssues: string[];
  integrationNotes: string;
  configOptions: {
    name: string;
    description: string;
    defaultValue: string;
    options?: string[];
  }[];
  compatibleDevices?: {
    type: string;
    models: {
      id: string;
      manufacturer: string;
      model: string;
    }[];
  }[];
}

interface Document {
  id: string;
  documentType: string;
  documentName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  description: string;
  uploadedAt: string;
}

const mockDeviceModel: DeviceModel = {
  id: "1",
  manufacturer: "SolarEdge",
  model: "StorEdge SE10K",
  deviceType: "inverters",
  protocol: "Modbus TCP",
  firmware: "3.2415.9",
  supported: true,
  hasManual: true,
  hasRegisterMap: true,
  description: "The StorEdge SE10K is a high-performance hybrid inverter specifically designed for energy storage applications, featuring advanced monitoring and control capabilities.",
  technicalSpecs: {
    capacity: 10000,
    maxEfficiency: "98.3%",
    inputVoltage: "320-800V",
    maxCurrent: "16A",
    dimensions: "540 x 315 x 260 mm",
    weight: "33.2 kg",
    warrantyYears: 12,
    ipRating: "IP65"
  },
  knownIssues: [
    "Firmware version 3.21.x may have intermittent communication drops in high temperature environments",
    "Remote firmware updates may require multiple attempts on slow network connections",
    "Temperature sensors may report inaccurate values in firmware versions prior to 3.20"
  ],
  integrationNotes: "The StorEdge SE10K requires configuration of Modbus TCP settings in the installer interface before it can be properly connected to the management system. Default port is 502 and the default unit ID is 1.",
  configOptions: [
    {
      name: "Unit ID",
      description: "Modbus unit identifier",
      defaultValue: "1",
      options: ["1", "2", "3", "4"]
    },
    {
      name: "IP Configuration",
      description: "Network configuration method",
      defaultValue: "DHCP",
      options: ["DHCP", "Static"]
    },
    {
      name: "Power Limit",
      description: "Maximum output power percentage",
      defaultValue: "100",
      options: ["50", "75", "90", "100"]
    }
  ],
  compatibleDevices: [
    {
      type: "batteries",
      models: [
        { id: "2", manufacturer: "LG Chem", model: "RESU10H" },
        { id: "3", manufacturer: "BYD", model: "Battery-Box HV" },
        { id: "4", manufacturer: "Tesla", model: "Powerwall 2" }
      ]
    },
    {
      type: "meters",
      models: [
        { id: "5", manufacturer: "WattNode", model: "WNC-3Y-400-MB" },
        { id: "6", manufacturer: "Eastron", model: "SDM630" }
      ]
    }
  ]
};

const mockDocuments: Document[] = [
  {
    id: "1",
    documentType: "manual",
    documentName: "StorEdge SE10K Installation Manual",
    filePath: "/documents/se10k-install-guide.pdf",
    fileType: "pdf",
    fileSize: 4250,
    description: "Complete installation guide for StorEdge SE10K",
    uploadedAt: "2023-06-15T14:30:00Z"
  },
  {
    id: "2",
    documentType: "datasheet",
    documentName: "StorEdge SE10K Technical Datasheet",
    filePath: "/documents/se10k-datasheet.pdf",
    fileType: "pdf",
    fileSize: 1200,
    description: "Technical specifications and performance details",
    uploadedAt: "2023-06-15T14:30:00Z"
  },
  {
    id: "3",
    documentType: "register_map",
    documentName: "StorEdge SE10K Modbus Register Map",
    filePath: "/documents/se10k-modbus-map.xlsx",
    fileType: "xlsx",
    fileSize: 860,
    description: "Modbus TCP register addresses for data points and controls",
    uploadedAt: "2023-06-17T09:15:00Z"
  }
];

const DeviceModelDetailPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [deviceModel, setDeviceModel] = useState<DeviceModel | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceModel = async () => {
      try {
        setLoading(true);
        
        setTimeout(() => {
          setDeviceModel(mockDeviceModel);
          setDocuments(mockDocuments);
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching device model:', error);
        toast.error('Failed to fetch device model details');
        setLoading(false);
      }
    };

    fetchDeviceModel();
  }, [deviceId, navigate]);

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'batteries':
        return <Battery size={18} />;
      case 'inverters':
        return <Zap size={18} />;
      case 'ev-chargers':
        return <Zap size={18} />;
      case 'meters':
        return <Activity size={18} />;
      case 'controllers':
        return <Package size={18} />;
      default:
        return <Package size={18} />;
    }
  };

  const getDeviceTypeName = (type: string) => {
    switch (type) {
      case 'batteries':
        return 'Battery System';
      case 'inverters':
        return 'Inverter';
      case 'ev-chargers':
        return 'EV Charger';
      case 'meters':
        return 'Energy Meter';
      case 'controllers':
        return 'Controller';
      default:
        return type;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'manual':
        return <FileText size={16} />;
      case 'register_map':
        return <FileCode size={16} />;
      case 'datasheet':
        return <FileText size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full" />
        </div>
      </AppLayout>
    );
  }

  if (!deviceModel) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" asChild className="mr-4">
              <Link to="/integrations">
                <ArrowLeft size={16} className="mr-2" /> Back to Integrations
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center p-8 flex-col">
                <AlertCircle size={48} className="text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Device Model Not Found</h2>
                <p className="text-muted-foreground mb-4">The device model you're looking for does not exist or has been removed.</p>
                <Button asChild>
                  <Link to="/integrations">Return to Integrations</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" asChild className="mr-4">
            <Link to="/integrations">
              <ArrowLeft size={16} className="mr-2" /> Back to Integrations
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Link to={`/integrations/${deviceModel.deviceType}`} className="text-muted-foreground hover:text-foreground text-sm">
              {getDeviceTypeName(deviceModel.deviceType)}
            </Link>
            <ChevronRight size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium">{deviceModel.model}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 rounded-full bg-primary/10">
                        {getDeviceTypeIcon(deviceModel.deviceType)}
                      </div>
                      <Badge variant={deviceModel.supported ? 'default' : 'secondary'}>
                        {deviceModel.supported ? 'Supported' : 'Deprecated'}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{deviceModel.model}</CardTitle>
                    <CardDescription className="text-base">
                      Manufactured by <a href={`https://${deviceModel.manufacturer.toLowerCase().replace(/\s+/g, '')}.com`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{deviceModel.manufacturer}</a>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings size={14} className="mr-1" /> Configure
                    </Button>
                    <Button size="sm">
                      Add Device
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="mt-2">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="technical">Technical Specs</TabsTrigger>
                    <TabsTrigger value="documentation">Documentation</TabsTrigger>
                    <TabsTrigger value="configuration">Configuration</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6 pt-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground">{deviceModel.description || 'No description available.'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Integration Notes</h3>
                      <p className="text-muted-foreground">{deviceModel.integrationNotes || 'No integration notes available.'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Known Issues</h3>
                      {deviceModel.knownIssues && deviceModel.knownIssues.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          {deviceModel.knownIssues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No known issues reported.</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Compatible Devices</h3>
                      {deviceModel.compatibleDevices && deviceModel.compatibleDevices.length > 0 ? (
                        <div className="space-y-4">
                          {deviceModel.compatibleDevices.map((deviceCategory, index) => (
                            <div key={index}>
                              <h4 className="font-medium mb-1">Compatible {getDeviceTypeName(deviceCategory.type)}s</h4>
                              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                {deviceCategory.models.map((model, i) => (
                                  <li key={i}>
                                    <Link to={`/integrations/device/${model.id}`} className="text-primary hover:underline">
                                      {model.manufacturer} {model.model}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No compatible devices listed.</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="technical" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Protocol</dt>
                            <dd className="font-medium">{deviceModel.protocol}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Firmware Version</dt>
                            <dd className="font-medium">{deviceModel.firmware || 'N/A'}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-muted-foreground">Register Map Available</dt>
                            <dd className="font-medium flex items-center">
                              {deviceModel.hasRegisterMap ? 
                                <><CheckCircle2 size={16} className="text-green-500 mr-1" /> Yes</> : 
                                <><XCircle size={16} className="text-red-500 mr-1" /> No</>
                              }
                            </dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Technical Specifications</h3>
                        <dl className="space-y-2">
                          {Object.entries(deviceModel.technicalSpecs).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <dt className="text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</dt>
                              <dd className="font-medium">{value}</dd>
                            </div>
                          ))}
                          
                          {Object.keys(deviceModel.technicalSpecs).length === 0 && (
                            <p className="text-muted-foreground">No technical specifications available.</p>
                          )}
                        </dl>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documentation" className="pt-4">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Available Documentation</h3>
                        
                        {documents.length > 0 ? (
                          <div className="grid gap-4">
                            {documents.map(doc => (
                              <Card key={doc.id}>
                                <CardContent className="p-4 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-primary/10">
                                      {getDocumentIcon(doc.documentType)}
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{doc.documentName}</h4>
                                      <p className="text-xs text-muted-foreground">{doc.documentType.replace(/_/g, ' ')} • {doc.fileType.toUpperCase()} • {(doc.fileSize / 1024).toFixed(0)} KB</p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <Download size={14} />
                                    Download
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-8 border rounded-md">
                            <div className="text-center">
                              <Info size={24} className="mx-auto text-muted-foreground mb-2" />
                              <h4 className="font-medium mb-1">No documents available</h4>
                              <p className="text-muted-foreground text-sm">Documentation for this device model has not been uploaded yet.</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {deviceModel.hasRegisterMap && (
                        <div>
                          <h3 className="text-lg font-medium mb-3">Register Map</h3>
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-md bg-primary/10">
                                    <Code size={16} />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{deviceModel.model} Register Map</h4>
                                    <p className="text-xs text-muted-foreground">Modbus register definitions for direct integration</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Download size={14} className="mr-1" /> Download CSV
                                  </Button>
                                  <Button size="sm">
                                    View Map
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="configuration" className="pt-4">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Configuration Options</h3>
                      
                      {deviceModel.configOptions && deviceModel.configOptions.length > 0 ? (
                        <div className="space-y-4">
                          {deviceModel.configOptions.map((option, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <h4 className="font-medium">{option.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                                <div className="mt-2 flex items-center">
                                  <span className="text-xs font-medium">Default: </span>
                                  <Badge variant="outline" className="ml-2">{option.defaultValue}</Badge>
                                </div>
                                {option.options && (
                                  <div className="mt-2">
                                    <span className="text-xs font-medium">Available options:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {option.options.map((opt, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">{opt}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-8 border rounded-md">
                          <div className="text-center">
                            <Settings size={24} className="mx-auto text-muted-foreground mb-2" />
                            <h4 className="font-medium mb-1">No configuration options</h4>
                            <p className="text-muted-foreground text-sm">This device model doesn't have specific configuration options defined.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Device Type</dt>
                    <dd className="mt-1 flex items-center gap-1">
                      {getDeviceTypeIcon(deviceModel.deviceType)}
                      <span>{getDeviceTypeName(deviceModel.deviceType)}</span>
                    </dd>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                    <dd className="mt-1">
                      {deviceModel.supported ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Supported</Badge>
                      ) : (
                        <Badge variant="secondary">Deprecated</Badge>
                      )}
                    </dd>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Protocol</dt>
                    <dd className="mt-1">{deviceModel.protocol}</dd>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Documentation</dt>
                    <dd className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {deviceModel.hasManual ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : (
                          <XCircle size={14} className="text-muted-foreground" />
                        )}
                        <span className={!deviceModel.hasManual ? "text-muted-foreground" : ""}>User Manual</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {deviceModel.hasRegisterMap ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : (
                          <XCircle size={14} className="text-muted-foreground" />
                        )}
                        <span className={!deviceModel.hasRegisterMap ? "text-muted-foreground" : ""}>Register Map</span>
                      </div>
                    </dd>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Actions</dt>
                    <dd className="mt-2 space-y-2">
                      <Button className="w-full" size="sm">
                        Add Device
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        View Documentation
                      </Button>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DeviceModelDetailPage;
