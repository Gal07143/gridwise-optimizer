
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  ArrowUp,
  ArrowDown,
  Lightbulb,
  Sun,
  BatteryCharging,
  Bolt,
  Router,
  Server,
  Database,
  Cpu,
  HardDrive,
  Activity,
  AlertCircle,
  Check,
  Clock,
  Wifi,
  Bluetooth,
  Headphones,
  Speaker,
  Mic,
  Camera,
  Video,
  Image,
  File,
  Folder,
  Code,
  Terminal,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  Wallet,
  BarChart,
  PieChart,
  LineChart,
  AreaChart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  HelpCircle,
  Info,
  XCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
  Plus,
  Minus,
  X,
  Search,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Share2,
  Copy,
  Link2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Flag,
  Bookmark,
  Heart,
  Star,
  Award,
  Trophy,
  Gift,
  Tag,
  Filter,
  Settings,
  Users,
  User,
  Home,
  LayoutDashboard,
  Zap,
  PackageOpen,
  Building2,
  Shield,
  List,
  Grid,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCw,
  Move,
  ZoomIn,
  ZoomOut,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudOff,
  WifiOff,
  BluetoothOff,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneMissed,
  PhoneOff,
  Monitor,
  Tv2,
  Laptop2,
  Keyboard,
  Printer,
  Gamepad2,
  Disc,
  Music2,
  Film,
  Book,
  Bell,
  Camera,
  MessageCircle,
  Map,
  Compass,
  Layers,
  Sliders,
  Code2,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  DownloadCloud,
  UploadCloud,
  LogIn,
  LogOut,
  UserPlus,
  UserCheck,
  UserX,
  Users2,
  Voicemail,
  Anchor,
  Puzzle,
  Link,
  Asterisk,
  AtSign,
  Euro,
  DollarSign,
  IndianRupee,
  Bitcoin,
  FileText,
  Codepen,
  Layout,
  Split,
  CopyPlus,
  LayoutList,
  LayoutGrid,
  LayoutTemplate,
  ListOrdered,
  Minimize,
  Maximize,
  ExternalLink,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  CornerLeftUp,
  CornerRightUp,
  CornerLeftDown,
  CornerRightDown,
  Forklift,
  Truck,
  Bus,
  Car,
  Train,
  Store,
  Banknote,
  PiggyBank,
  Coins,
  Gem,
  Scale,
  Briefcase,
  Hammer,
  Wrench,
  Ruler,
  Umbrella,
  Snowflake,
  Droplet,
  Droplets,
  ThermometerSun,
  ThermometerSnowflake,
  Flame,
  Leaf,
  TreeDeciduous,
  TreePine,
  Mountain,
  Waves,
  StarOff,
  MoonStar,
  Rainbow,
  Sunrise,
  Sunset,
  Tornado,
  Earth,
  Satellite,
  SatelliteDish,
  Radio,
} from 'lucide-react';
import { EnergyFlowTooltip } from '@/components/energy/EnergyFlowTooltip';

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
    // Simulate energy flow changes over time
    const interval = setInterval(() => {
      // Adjust solar production
      setSolarProduction((prev) => {
        const change = Math.random() * 10 - 5; // Random change between -5 and 5
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue)); // Keep value between 0 and 100
      });

      // Adjust battery level
      setBatteryLevel((prev) => {
        let change = 0;
        if (isCharging) {
          change = Math.random() * 5; // Charging rate
        } else if (isDischarging) {
          change = -(Math.random() * 5); // Discharging rate
        }
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue)); // Keep value between 0 and 100
      });

      // Adjust grid consumption
      setGridConsumption((prev) => {
        const change = Math.random() * 10 - 5; // Random change between -5 and 5
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue)); // Keep value between 0 and 100
      });

      // Adjust house consumption
      setHouseConsumption((prev) => {
        const change = Math.random() * 10 - 5; // Random change between -5 and 5
        const newValue = prev + change;
        return Math.max(0, Math.min(100, newValue)); // Keep value between 0 and 100
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
        {/* Solar Panel */}
        <Card
          className="energy-source"
          onMouseEnter={() => handleMouseEnter('solar')}
          onMouseLeave={handleMouseLeave}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <Sun className="w-12 h-12 text-yellow-500 mb-2" />
            <Label>Solar Production</Label>
            <Progress value={solarProduction} />
            <span className="text-sm mt-1">{solarProduction}%</span>
          </CardContent>
        </Card>

        {/* Battery Storage */}
        <Card
          className="energy-source"
          onMouseEnter={() => handleMouseEnter('battery')}
          onMouseLeave={handleMouseLeave}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <BatteryCharging className="w-12 h-12 text-green-500 mb-2" />
            <Label>Battery Level</Label>
            <Progress value={batteryLevel} />
            <span className="text-sm mt-1">{batteryLevel}%</span>
          </CardContent>
        </Card>

        {/* Grid Consumption */}
        <Card
          className="energy-source"
          onMouseEnter={() => handleMouseEnter('grid')}
          onMouseLeave={handleMouseLeave}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <Bolt className="w-12 h-12 text-blue-500 mb-2" />
            <Label>Grid Consumption</Label>
            <Progress value={gridConsumption} />
            <span className="text-sm mt-1">{gridConsumption}%</span>
          </CardContent>
        </Card>

        {/* House Consumption */}
        <Card
          className="energy-source"
          onMouseEnter={() => handleMouseEnter('house')}
          onMouseLeave={handleMouseLeave}
        >
          <CardContent className="flex flex-col items-center justify-center">
            <Home className="w-12 h-12 text-gray-500 mb-2" />
            <Label>House Consumption</Label>
            <Progress value={houseConsumption} />
            <span className="text-sm mt-1">{houseConsumption}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Battery Controls */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Battery Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Charge Rate */}
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

          {/* Discharge Rate */}
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

        {/* Charging and Discharging Switches */}
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
