import React, { useState, useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { EnhancedEnergyFlow } from '@/components/energy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  ArrowDownUp,
  BadgeDollarSign,
  BarChart,
  Battery,
  BatteryCharging,
  Bell,
  Bolt,
  BoltSlash,
  Box,
  Building,
  CalendarDays,
  Car,
  ChartBar,
  ChevronDown,
  Clock12,
  CreditCard,
  Database,
  Flame,
  Gauge,
  Home,
  Info,
  LifeBuoy,
  Lightbulb,
  LucideIcon,
  Minus,
  MoreHorizontal,
  Package,
  Plus,
  Power,
  RefreshCw,
  Search,
  Settings,
  Share,
  Sun,
  Terminal,
  ToggleLeft,
  ToggleRight,
  Trash,
  User,
  Warehouse,
  WifiOff,
  X,
  Zap
} from 'lucide-react';

const EnergyFlow = () => {
  const [solarProduction, setSolarProduction] = useState(75);
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [gridConsumption, setGridConsumption] = useState(30);
  const [houseConsumption, setHouseConsumption] = useState(60);
  const [chargeRate, setChargeRate] = useState(25);
  const [dischargeRate, setDischargeRate] = useState(20);
  const [isCharging, setIsCharging] = useState(true);
  const [isDischarging, setIsDischarging] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSolarProduction((prev) => {
        const change = Math.random() * 10 - 5;
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue));
      });

      setBatteryLevel((prev) => {
        let change = 0;
        if (isCharging) {
          change = Math.random() * 5;
        } else if (isDischarging) {
          change = -(Math.random() * 5);
        }
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue));
      });

      setGridConsumption((prev) => {
        const change = Math.random() * 10 - 5;
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue));
      });

      setHouseConsumption((prev) => {
        const change = Math.random() * 10 - 5;
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isCharging, isDischarging]);

  const handleMouseEnter = (element: string) => {
    let content;
    switch (element) {
      case 'solar':
        content = (
          <div>
            <p>Solar Panel Production</p>
            <p>Current Output: {solarProduction}%</p>
            <p>Generating clean energy from the sun.</p>
          </div>
        );
        break;
      case 'battery':
        content = (
          <div>
            <p>Battery Storage</p>
            <p>Current Level: {batteryLevel}%</p>
            <p>Storing excess energy for later use.</p>
          </div>
        );
        break;
      case 'grid':
        content = (
          <div>
            <p>Grid Consumption</p>
            <p>Current Draw: {gridConsumption}%</p>
            <p>Drawing power from the grid.</p>
          </div>
        );
        break;
      case 'house':
        content = (
          <div>
            <p>House Consumption</p>
            <p>Current Usage: {houseConsumption}%</p>
            <p>Energy being used by the house.</p>
          </div>
        );
        break;
      default:
        content = <p>No information available.</p>;
    }
    setTooltipContent(content);
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Energy Flow Visualization</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="energy-source"
          onMouseEnter={() => handleMouseEnter('solar')}
          onMouseLeave={handleMouseLeave}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <Sun className="w-12 h-12 text-yellow-500 mb-2" />
            <CardTitle>Solar Production</CardTitle>
            <Progress value={solarProduction} />
            <span className="text-sm mt-1">{solarProduction}%</span>
          </CardContent>
        </Card>

        <Card
          className="energy-source"
          onMouseEnter={() => handleMouseEnter('battery')}
          onMouseLeave={handleMouseLeave}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <BatteryCharging className="w-12 h-12 text-green-500 mb-2" />
            <CardTitle>Battery Level</CardTitle>
            <Progress value={batteryLevel} />
            <span className="text-sm mt-1">{batteryLevel}%</span>
          </CardContent>
        </Card>

        <Card
          className="energy-source"
          onMouseEnter={() => handleMouseEnter('grid')}
          onMouseLeave={handleMouseLeave}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <Bolt className="w-12 h-12 text-blue-500 mb-2" />
            <CardTitle>Grid Consumption</CardTitle>
            <Progress value={gridConsumption} />
            <span className="text-sm mt-1">{gridConsumption}%</span>
          </CardContent>
        </Card>

        <Card
          className="energy-source"
          onMouseEnter={() => handleMouseEnter('house')}
          onMouseLeave={handleMouseLeave}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <Home className="w-12 h-12 text-gray-500 mb-2" />
            <CardTitle>House Consumption</CardTitle>
            <Progress value={houseConsumption} />
            <span className="text-sm mt-1">{houseConsumption}%</span>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Battery Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="chargeRate">Charge Rate</Label>
                <span>{chargeRate}%</span>
              </div>
              <Slider
                id="chargeRate"
                defaultValue={[chargeRate]}
                max={100}
                step={1}
                onValueChange={(value) => setChargeRate(value[0])}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="dischargeRate">Discharge Rate</Label>
                <span>{dischargeRate}%</span>
              </div>
              <Slider
                id="dischargeRate"
                defaultValue={[dischargeRate]}
                max={100}
                step={1}
                onValueChange={(value) => setDischargeRate(value[0])}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch id="charging" checked={isCharging} onCheckedChange={setIsCharging} />
            <Label htmlFor="charging">Charging</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="discharging" checked={isDischarging} onCheckedChange={setIsDischarging} />
            <Label htmlFor="discharging">Discharging</Label>
          </div>
        </div>
      </div>
      {tooltipContent && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 pointer-events-none">
          <div className="bg-white p-4 rounded shadow-lg pointer-events-auto">
            {tooltipContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnergyFlow;
