
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  Download, 
  ArrowUpDown, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Mock data until database is ready
const mockDeviceModels = {
  'batteries': [
    { id: 'b1', manufacturer: 'Tesla', model: 'Powerwall 2', protocol: 'Modbus TCP', firmware: 'v1.45.2', supported: true, hasManual: true },
    { id: 'b2', manufacturer: 'LG Chem', model: 'RESU10H', protocol: 'CAN bus', firmware: 'v2.3.0', supported: true, hasManual: true },
    { id: 'b3', manufacturer: 'Sonnen', model: 'eco 8', protocol: 'REST API', firmware: 'v1.2.3', supported: true, hasManual: true },
    { id: 'b4', manufacturer: 'BYD', model: 'Battery-Box Premium HVS', protocol: 'Modbus RTU', firmware: 'v1.9', supported: true, hasManual: false },
    { id: 'b5', manufacturer: 'Pylontech', model: 'US2000 Plus', protocol: 'RS485', firmware: 'v2.0', supported: true, hasManual: true },
  ],
  'inverters': [
    { id: 'i1', manufacturer: 'SMA', model: 'Sunny Boy 5.0', protocol: 'Modbus TCP', firmware: 'v3.20.13.R', supported: true, hasManual: true },
    { id: 'i2', manufacturer: 'Fronius', model: 'Symo 10.0-3-M', protocol: 'Solar API', firmware: 'v3.15.1-4', supported: true, hasManual: true },
    { id: 'i3', manufacturer: 'SolarEdge', model: 'SE10K', protocol: 'Modbus TCP', firmware: 'v4.10.12', supported: true, hasManual: true },
    { id: 'i4', manufacturer: 'ABB', model: 'UNO-DM-5.0-TL-PLUS', protocol: 'Aurora Protocol', firmware: 'v1.2.3', supported: false, hasManual: false },
    { id: 'i5', manufacturer: 'Huawei', model: 'SUN2000-10KTL-M1', protocol: 'Modbus TCP', firmware: 'v1.0.35', supported: true, hasManual: true },
  ],
  'ev-chargers': [
    { id: 'ev1', manufacturer: 'ChargePoint', model: 'Home Flex', protocol: 'OCPP 1.6J', firmware: 'v5.1.2', supported: true, hasManual: true },
    { id: 'ev2', manufacturer: 'Tesla', model: 'Wall Connector', protocol: 'Proprietary', firmware: 'v1.45.0', supported: true, hasManual: true },
    { id: 'ev3', manufacturer: 'JuiceBox', model: 'Pro 40', protocol: 'JuiceNet API', firmware: 'v2.12.6', supported: true, hasManual: false },
    { id: 'ev4', manufacturer: 'Wallbox', model: 'Pulsar Plus', protocol: 'Modbus TCP', firmware: 'v3.4.2', supported: false, hasManual: true },
  ],
  'meters': [
    { id: 'm1', manufacturer: 'Schneider Electric', model: 'PowerLogic PM5560', protocol: 'Modbus RTU', firmware: 'v10.6.1', supported: true, hasManual: true },
    { id: 'm2', manufacturer: 'ABB', model: 'B23 212-100', protocol: 'Modbus TCP', firmware: 'v2.0', supported: true, hasManual: true },
    { id: 'm3', manufacturer: 'Siemens', model: 'SENTRON PAC3200', protocol: 'Modbus TCP', firmware: 'v1.2', supported: true, hasManual: true },
  ],
  'controllers': [
    { id: 'c1', manufacturer: 'Schneider Electric', model: 'EcoStruxure Microgrid Controller', protocol: 'Modbus TCP/REST API', firmware: 'v3.2.1', supported: true, hasManual: true },
    { id: 'c2', manufacturer: 'ABB', model: 'Microgrid Plus Controller', protocol: 'OPC UA', firmware: 'v2.5.0', supported: true, hasManual: true },
    { id: 'c3', manufacturer: 'Siemens', model: 'SICAM A8000 Microgrid Controller', protocol: 'IEC 61850', firmware: 'v4.60', supported: false, hasManual: true },
  ]
};

const categoryNames = {
  'batteries': 'Battery Systems',
  'inverters': 'Inverters',
  'ev-chargers': 'EV Chargers',
  'meters': 'Energy Meters',
  'controllers': 'Microgrid Controllers'
};

const IntegrationCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState('manufacturer');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // This would be replaced by a real database query
  const deviceModels = categoryId ? mockDeviceModels[categoryId as keyof typeof mockDeviceModels] || [] : [];
  
  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort devices
  const filteredDevices = deviceModels.filter(device => {
    const query = searchQuery.toLowerCase();
    return (
      device.manufacturer.toLowerCase().includes(query) ||
      device.model.toLowerCase().includes(query) ||
      device.protocol.toLowerCase().includes(query)
    );
  }).filter(device => {
    if (activeTab === 'all') return true;
    if (activeTab === 'supported') return device.supported;
    if (activeTab === 'unsupported') return !device.supported;
    return true;
  }).sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    
    return 0;
  });
  
  const handleViewManual = (deviceId: string) => {
    // This would open the manual in a real app
    toast.info('Opening device manual...');
  };
  
  const categoryName = categoryId ? categoryNames[categoryId as keyof typeof categoryNames] || 'Devices' : 'Devices';
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">{categoryName}</h1>
            <p className="text-muted-foreground">
              Browse and manage {categoryName.toLowerCase()} integrations by manufacturer
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            <Button asChild>
              <Link to={`/integrations/add-device-model?type=${categoryId}`}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add {categoryName.slice(0, -1)}
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by manufacturer, model or protocol..." 
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="supported">Supported</TabsTrigger>
              <TabsTrigger value="unsupported">Unsupported</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Device Models</CardTitle>
            <CardDescription>
              {filteredDevices.length} {categoryName.toLowerCase()} found matching your criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('manufacturer')}>
                    <div className="flex items-center">
                      Manufacturer
                      {sortField === 'manufacturer' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('model')}>
                    <div className="flex items-center">
                      Model
                      {sortField === 'model' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('protocol')}>
                    <div className="flex items-center">
                      Protocol
                      {sortField === 'protocol' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('firmware')}>
                    <div className="flex items-center">
                      Firmware
                      {sortField === 'firmware' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('supported')}>
                    <div className="flex items-center">
                      Status
                      {sortField === 'supported' && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Documentation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.length > 0 ? (
                  filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.manufacturer}</TableCell>
                      <TableCell>{device.model}</TableCell>
                      <TableCell>{device.protocol}</TableCell>
                      <TableCell>{device.firmware}</TableCell>
                      <TableCell>
                        {device.supported ? (
                          <Badge className="bg-green-500">Supported</Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500 text-amber-500">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Not Supported
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {device.hasManual ? (
                          <Button variant="ghost" size="sm" onClick={() => handleViewManual(device.id)}>
                            <FileText className="h-4 w-4 mr-1" />
                            Manual
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">No manual</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/integrations/device/${device.id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No devices found matching your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" size="sm" className="text-muted-foreground">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
            <Button size="sm" asChild>
              <Link to="/integrations/add-device-model">
                Add New Device
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default IntegrationCategoryPage;
