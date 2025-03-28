
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Server, Cpu, Broadcast, 
  HardDrive, WifiIcon, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

// Knowledge base categories
const categories = [
  { id: 'devices', name: 'Devices', icon: <HardDrive className="h-5 w-5" /> },
  { id: 'protocols', name: 'Communication Protocols', icon: <Broadcast className="h-5 w-5" /> },
  { id: 'inverters', name: 'Inverters', icon: <Cpu className="h-5 w-5" /> },
  { id: 'meters', name: 'Energy Meters', icon: <Server className="h-5 w-5" /> },
  { id: 'wireless', name: 'Wireless Solutions', icon: <WifiIcon className="h-5 w-5" /> },
];

// Mock knowledge base items
const knowledgeItems = [
  // Devices
  {
    id: 'device-1',
    category: 'devices',
    title: 'Battery Storage Systems',
    description: 'Overview of battery storage technologies and integration with energy systems.',
    tags: ['battery', 'storage', 'lithium-ion', 'lead-acid'],
    content: `
      # Battery Storage Systems
      
      Battery energy storage systems (BESS) store electricity for use at a later time. They are critical components in modern energy management systems, especially those with renewable energy sources.
      
      ## Common Battery Technologies
      
      - **Lithium-ion**: High energy density, long cycle life, but more expensive
      - **Lead-acid**: Lower cost, proven technology, but shorter lifespan
      - **Flow batteries**: Excellent for long-duration storage, scalable
      
      ## Integration Considerations
      
      When integrating battery storage with your energy management system:
      
      1. **Sizing**: Carefully consider capacity needs based on load profiles
      2. **Inverter compatibility**: Ensure DC/AC conversion is efficient
      3. **Management systems**: Battery management systems (BMS) are critical
      4. **Temperature control**: Batteries require proper thermal management
      
      ## Maintenance Requirements
      
      Regular maintenance ensures optimal performance and longevity:
      
      - Monitor cell balancing and voltage
      - Check thermal management systems
      - Perform capacity tests periodically
      - Update firmware as recommended
    `,
    lastUpdated: '2023-11-15',
  },
  {
    id: 'device-2',
    category: 'devices',
    title: 'Solar PV Systems',
    description: 'Components, installation, and maintenance of solar photovoltaic systems.',
    tags: ['solar', 'pv', 'panels', 'renewable'],
    content: `
      # Solar PV Systems
      
      Solar photovoltaic (PV) systems convert sunlight directly into electricity through semiconductor materials.
      
      ## Key Components
      
      - **PV modules/panels**: Convert sunlight to DC electricity
      - **Inverters**: Convert DC to AC electricity
      - **Mounting systems**: Secure panels to roofs or ground
      - **Monitoring systems**: Track performance and identify issues
      
      ## Integration with EMS
      
      Solar PV systems can be integrated with energy management systems to:
      
      1. Optimize self-consumption
      2. Manage excess generation
      3. Coordinate with battery storage
      4. Provide data for energy forecasting
      
      ## Maintenance Best Practices
      
      - Clean panels regularly to remove dust and debris
      - Inspect for physical damage or degradation
      - Monitor inverter performance
      - Check electrical connections
    `,
    lastUpdated: '2023-10-20',
  },
  // Protocols
  {
    id: 'protocol-1',
    category: 'protocols',
    title: 'Modbus Protocol',
    description: 'Implementation and use of Modbus in energy management systems.',
    tags: ['modbus', 'communication', 'RTU', 'TCP/IP'],
    content: `
      # Modbus Protocol
      
      Modbus is a serial communications protocol developed in 1979 for use with programmable logic controllers (PLCs). It has become a de facto standard for industrial electronic device communication.
      
      ## Modbus Variants
      
      - **Modbus RTU**: Serial protocol using binary encoding
      - **Modbus ASCII**: Serial protocol using ASCII encoding
      - **Modbus TCP/IP**: Ethernet-based implementation
      
      ## Register Types
      
      Modbus uses four types of registers:
      
      1. **Coils** (00001-09999): Single-bit, read-write
      2. **Discrete Inputs** (10001-19999): Single-bit, read-only
      3. **Input Registers** (30001-39999): 16-bit, read-only
      4. **Holding Registers** (40001-49999): 16-bit, read-write
      
      ## Implementation Tips
      
      - Ensure proper termination in RTU networks
      - Set consistent baud rates and parity
      - Use proper addressing for all devices
      - Consider timeouts and retry mechanisms
      
      ## Common Issues
      
      - Addressing offsets (zero vs one-based)
      - Byte order (endianness)
      - Timing issues in RTU implementations
      - Network collisions
    `,
    lastUpdated: '2023-09-05',
  },
  {
    id: 'protocol-2',
    category: 'protocols',
    title: 'BACnet Protocol',
    description: 'Understanding BACnet for building automation and control networks.',
    tags: ['bacnet', 'building', 'automation', 'HVAC'],
    content: `
      # BACnet Protocol
      
      BACnet (Building Automation and Control Networks) is a data communication protocol designed specifically for building automation and control equipment.
      
      ## BACnet Network Types
      
      - **BACnet/IP**: Uses standard IP networks
      - **BACnet MS/TP**: Master-Slave/Token-Passing over RS-485
      - **BACnet ARCNET**: Token-passing protocol
      - **BACnet Ethernet**: Direct Ethernet implementation
      
      ## Object Types
      
      BACnet uses an object-oriented approach with standard object types:
      
      - Analog Input, Output, Value
      - Binary Input, Output, Value
      - Multi-state Input, Output, Value
      - Schedule, Calendar
      - Trend Log
      - Device
      
      ## Integration Considerations
      
      When integrating BACnet devices:
      
      1. Ensure device instance IDs are unique
      2. Configure proper network numbers
      3. Consider routing between networks
      4. Test discovery and binding procedures
      
      ## Troubleshooting
      
      - Use Wireshark with BACnet plugins
      - Verify device IDs and network numbers
      - Check MS/TP polarity and termination
      - Validate service support in devices
    `,
    lastUpdated: '2023-08-12',
  },
  // Inverters
  {
    id: 'inverter-1',
    category: 'inverters',
    title: 'String Inverters',
    description: 'Selection, installation, and maintenance of string inverters for solar PV systems.',
    tags: ['inverter', 'string', 'solar', 'conversion'],
    content: `
      # String Inverters
      
      String inverters convert DC electricity from a string (series) of solar panels into AC electricity for use in buildings or the grid.
      
      ## Key Features
      
      - Typically used for residential and small commercial installations
      - Cost-effective for systems with consistent panel orientation
      - Central monitoring and control point
      - Efficiency typically 95-98%
      
      ## Selection Criteria
      
      When selecting a string inverter:
      
      1. **Sizing**: Match capacity to PV array size (typically 80-100% DC:AC ratio)
      2. **Voltage window**: Ensure PV string voltage matches inverter input range
      3. **Grid compatibility**: Verify compliance with local grid requirements
      4. **Monitoring capabilities**: Consider data logging and remote monitoring needs
      
      ## Installation Best Practices
      
      - Install in shaded, well-ventilated areas
      - Maintain clearances for cooling
      - Ensure proper grounding
      - Protect from water and dust ingress
      
      ## Maintenance
      
      - Clean cooling fins and vents
      - Check for error codes
      - Monitor DC and AC connections
      - Update firmware as recommended
    `,
    lastUpdated: '2023-07-25',
  },
  // Meters
  {
    id: 'meter-1',
    category: 'meters',
    title: 'Advanced Metering Infrastructure',
    description: 'Understanding AMI systems and smart meters for energy management.',
    tags: ['ami', 'smart meter', 'measurement', 'monitoring'],
    content: `
      # Advanced Metering Infrastructure (AMI)
      
      AMI systems include smart meters, communication networks, and data management systems that enable two-way communication between utilities and customers.
      
      ## Components of AMI
      
      - **Smart meters**: Digital meters with communication capabilities
      - **Communication network**: Wireless, PLC, cellular, or fiber
      - **Head-end system**: Manages communications and data collection
      - **Meter data management system**: Stores and processes meter data
      
      ## Benefits for Energy Management
      
      - Granular energy consumption data (15-minute to hourly intervals)
      - Remote monitoring and diagnostics
      - Support for time-of-use pricing
      - Outage detection and restoration confirmation
      
      ## Integration with EMS
      
      When integrating AMI with energy management systems:
      
      1. Consider data format compatibility
      2. Determine polling frequency requirements
      3. Plan for data storage and archiving
      4. Implement data validation processes
      
      ## Data Security Considerations
      
      - Encryption for data transmission
      - Access control for meter data
      - Compliance with privacy regulations
      - Regular security assessments
    `,
    lastUpdated: '2023-06-18',
  },
  // Wireless
  {
    id: 'wireless-1',
    category: 'wireless',
    title: 'LoRaWAN for Energy Monitoring',
    description: 'Implementing low-power, long-range communication for energy devices.',
    tags: ['lorawan', 'lpwan', 'iot', 'wireless'],
    content: `
      # LoRaWAN for Energy Monitoring
      
      LoRaWAN (Long Range Wide Area Network) is a low-power, wide-area networking protocol designed for wireless battery-operated devices in regional, national, or global networks.
      
      ## Key Characteristics
      
      - Long range: 2-5 km in urban areas, 15+ km in rural areas
      - Low power consumption: 10+ years battery life possible
      - Low bandwidth: 0.3-50 kbps
      - Secure: End-to-end encryption
      
      ## Network Architecture
      
      - **End devices**: Sensors and actuators with LoRa capability
      - **Gateways**: Receive LoRa signals and connect to network server
      - **Network server**: Manages the network and eliminates duplicates
      - **Application server**: Processes and presents data
      
      ## Energy Monitoring Applications
      
      - Remote meter reading
      - Submetering in large facilities
      - Equipment monitoring
      - Environmental sensing
      
      ## Implementation Considerations
      
      1. Coverage planning and site surveys
      2. Gateway placement for optimal coverage
      3. Device class selection (A, B, or C)
      4. Payload optimization for battery life
      
      ## Limitations
      
      - Not suitable for high-bandwidth applications
      - Potential interference in dense deployments
      - Regional frequency regulations
      - Limited downlink capabilities
    `,
    lastUpdated: '2023-05-10',
  },
];

interface KnowledgeItemProps {
  item: (typeof knowledgeItems)[0];
  onSelect: (item: (typeof knowledgeItems)[0]) => void;
}

const KnowledgeItem: React.FC<KnowledgeItemProps> = ({ item, onSelect }) => {
  return (
    <div 
      className="p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors flex justify-between items-center"
      onClick={() => onSelect(item)}
    >
      <div>
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3} more
            </Badge>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

export const KnowledgeDatabase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('devices');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<(typeof knowledgeItems)[0] | null>(null);
  const [filteredItems, setFilteredItems] = useState<(typeof knowledgeItems)>([]);

  useEffect(() => {
    // Filter items based on category and search query
    const filtered = knowledgeItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
    
    setFilteredItems(filtered);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-card">
        <h2 className="text-2xl font-semibold flex items-center">
          <BookOpen className="mr-2 h-6 w-6" />
          Knowledge Database
        </h2>
        <p className="text-muted-foreground mt-1">
          Reference materials for devices and protocols used in energy management systems
        </p>
      </div>

      {selectedItem ? (
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center border-b">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedItem(null)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h3 className="font-medium">{selectedItem.title}</h3>
              <p className="text-xs text-muted-foreground">Last updated: {selectedItem.lastUpdated}</p>
            </div>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {selectedItem.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={idx} className="text-2xl font-bold mt-4 mb-2">{paragraph.replace('# ', '')}</h1>;
                } else if (paragraph.startsWith('## ')) {
                  return <h2 key={idx} className="text-xl font-semibold mt-4 mb-2">{paragraph.replace('## ', '')}</h2>;
                } else if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={idx} className="list-disc pl-5 my-2">
                      {paragraph.split('\n').map((item, i) => (
                        <li key={i}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.match(/^\d\./)) {
                  return (
                    <ol key={idx} className="list-decimal pl-5 my-2">
                      {paragraph.split('\n').map((item, i) => {
                        const content = item.replace(/^\d+\.\s/, '');
                        return <li key={i}>{content}</li>;
                      })}
                    </ol>
                  );
                } else {
                  return <p key={idx} className="my-2">{paragraph}</p>;
                }
              })}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedItem.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search knowledge base..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="devices" value={selectedCategory} onValueChange={setSelectedCategory}>
            <div className="p-4 border-b">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  All
                </TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                    {category.icon}
                    <span className="ml-2 hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-auto">
              <TabsContent value="all" className="m-0">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <KnowledgeItem key={item.id} item={item} onSelect={setSelectedItem} />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium">No items found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search criteria
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {categories.map(category => (
                <TabsContent key={category.id} value={category.id} className="m-0">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <KnowledgeItem key={item.id} item={item} onSelect={setSelectedItem} />
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <category.icon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-medium">No {category.name.toLowerCase()} found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default KnowledgeDatabase;
