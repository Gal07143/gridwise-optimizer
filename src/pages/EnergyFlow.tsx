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
  Memory,
  HardDrive,
  Fan,
  Thermometer,
  Activity,
  AlertCircle,
  Check,
  Clock,
  Wifi,
  Bluetooth,
  Gps,
  SdCard,
  Usb,
  Headphones,
  Speaker,
  Mic,
  Camera,
  Video,
  Image,
  File,
  Folder,
  Archive,
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
  BarChart3,
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
  BatteryAlert,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneMissed,
  PhoneOff,
  VideoCamera,
  VideoOff,
  Monitor,
  Tv2,
  Laptop2,
  Tablet2,
  Mobile2,
  Watch,
  MousePointer2,
  Keyboard,
  Printer,
  Gamepads2,
  Disc,
  Music2,
  Film,
  Book,
  Headphones2,
  ShoppingBag2,
  Bell,
  Mail2,
  Camera2,
  MessageCircle,
  Map,
  Compass,
  Layers,
  Sliders,
  Code2,
  Terminal2,
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
  Sitemap,
  Link,
  Asterisk,
  AtSign,
  Euro,
  Pound,
  DollarSign,
  Yen,
  IndianRupee,
  Bitcoin,
  FileText,
  ImageIcon,
  FileVideo,
  FileAudio,
  FileZip,
  FileJson,
  FileXml,
  FileCss,
  FileJs,
  FilePlus,
  FolderPlus,
  ArchiveRestore,
  CodePen,
  Layout,
  Split,
  CopyPlus,
  LayoutList,
  LayoutGrid,
  LayoutDashboard2,
  LayoutTemplate,
  ListOrdered,
  ListUnordered,
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
  Motorcycle,
  Bicycle,
  Walking,
  Skateboard,
  RollerSkate,
  Scooter,
  Train,
  Boat,
  Plane,
  Rocket,
  Helicopter,
  TrafficCone,
  Construction,
  Roadmap,
  Globe2,
  Building,
  Factory,
  Warehouse,
  Store,
  Banknote,
  PiggyBank,
  Coins,
  Gem,
  Scale,
  Briefcase,
  Tool,
  Hammer,
  Wrench,
  Screwdriver,
  Scissors,
  Ruler,
  Compass2,
  MapPin2,
  CalendarCheck,
  CalendarClock,
  CalendarHeart,
  CalendarPlus,
  CalendarRange,
  CalendarX,
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
  AlarmClock,
  Timer,
  Stopwatch,
  Hourglass,
  SunMoon,
  CloudSun,
  CloudMoon,
  CloudFog,
  Wind,
  Umbrella,
  Snowflake,
  Droplet,
  Droplets,
  ThermometerSun,
  ThermometerSnowflake,
  Flame,
  Leaf,
  Plant,
  TreeDeciduous,
  TreePine,
  Mountain,
  Beach,
  Waves,
  Volcano,
  Desert,
  StarOff,
  MoonStar,
  Meteor,
  Rainbow,
  Sunrise,
  Sunset,
  Aurora,
  Tornado,
  Hurricane,
  Earth,
  Planet,
  Galaxy,
  Comet,
  Satellite,
  SatelliteDish,
  Radio,
  Tv,
  Wifi2,
  Bluetooth2,
  Signal,
  Battery,
  Charging,
  Disc2,
  Headphones3,
  Mic2,
  Camera3,
  Video2,
  Image2,
  File2,
  Folder2,
  Archive2Icon,
  Code3,
  Terminal3,
  Mail3,
  MessageSquare2,
  Calendar2,
  MapPin3,
  ShoppingBag3,
  ShoppingCart2,
  CreditCard2,
  Wallet2,
  BarChart2,
  PieChart2,
  LineChart2,
  AreaChart2,
  TrendingUp2,
  TrendingDown2,
  AlertTriangle2,
  HelpCircle2,
  Info2,
  XCircle2,
  CheckCircle2,
  ChevronLeft2,
  ChevronRight2,
  ChevronUp2,
  ChevronDown2,
  ChevronsLeft2,
  ChevronsRight2,
  ChevronsUp2,
  ChevronsDown2,
  Plus2,
  Minus2,
  X2,
  Search2,
  Edit2,
  Trash22,
  Save2,
  Download2,
  Upload2,
  Share22,
  Copy2,
  Link22,
  Eye2,
  EyeOff2,
  Lock2,
  Unlock2,
  Flag2,
  Bookmark2,
  Heart2,
  Star2,
  Award2,
  Trophy2,
  Gift2,
  Tag2,
  Filter2,
  Settings2,
  Users3,
  User2,
  Home2,
  LayoutDashboard3,
  Zap2,
  PackageOpen2,
  Building3,
  Shield2,
  BarChart32,
  List2,
  Grid2,
  Maximize22,
  Minimize22,
  RefreshCw2,
  RotateCw2,
  Move2,
  ZoomIn2,
  ZoomOut2,
  Cloud2,
  CloudRain2,
  CloudSnow2,
  CloudLightning2,
  CloudOff2,
  WifiOff2,
  BluetoothOff2,
  BatteryFull2,
  BatteryMedium2,
  BatteryLow2,
  BatteryAlert2,
  Phone2,
  PhoneCall2,
  PhoneForwarded2,
  PhoneMissed2,
  PhoneOff2,
  VideoCamera2,
  VideoOff2,
  Monitor2,
  Tv22,
  Laptop22,
  Tablet22,
  Mobile22,
  Watch2,
  MousePointer22,
  Keyboard2,
  Printer2,
  Gamepads22,
  Disc3,
  Music22,
  Film2,
  Book2,
  Headphones22,
  ShoppingBag22,
  Bell2,
  Mail22,
  Camera22,
  MessageCircle2,
  Map2,
  Compass22,
  Layers2,
  Sliders2,
  Code22,
  Terminal22,
  GitBranch2,
  GitCommit2,
  GitMerge2,
  GitPullRequest2,
  DownloadCloud2,
  UploadCloud2,
  LogIn2,
  LogOut2,
  UserPlus2,
  UserCheck2,
  UserX2,
  Users22,
  Voicemail2,
  Anchor2,
  Puzzle2,
  Sitemap2,
  Link3,
  Asterisk2,
  AtSign2,
  Euro2,
  Pound2,
  DollarSign2,
  Yen2,
  IndianRupee2,
  Bitcoin2,
  FileText2,
  ImageIcon2,
  FileVideo2,
  FileAudio2,
  FileZip2,
  FileJson2,
  FileXml2,
  FileCss2,
  FileJs2,
  FilePlus2,
  FolderPlus2,
  ArchiveRestore2,
  CodePen2,
  Layout2,
  Split2,
  CopyPlus2,
  LayoutList2,
  LayoutGrid2,
  LayoutDashboard22,
  LayoutTemplate2,
  ListOrdered2,
  ListUnordered2,
  Minimize3,
  Maximize3,
  ExternalLink2,
  CornerUpLeft2,
  CornerUpRight2,
  CornerDownLeft2,
  CornerDownRight2,
  CornerLeftUp2,
  CornerRightUp2,
  CornerLeftDown2,
  CornerRightDown2,
  Forklift2,
  Truck2,
  Bus2,
  Car2,
  Motorcycle2,
  Bicycle2,
  Walking2,
  Skateboard2,
  RollerSkate2,
  Scooter2,
  Train2,
  Boat2,
  Plane2,
  Rocket2,
  Helicopter2,
  TrafficCone2,
  Construction2,
  Roadmap2,
  Globe22,
  Building22,
  Factory2,
  Warehouse2,
  Store2,
  Banknote2,
  PiggyBank2,
  Coins2,
  Gem2,
  Scale2,
  Briefcase2,
  Tool2,
  Hammer2,
  Wrench2,
  Screwdriver2,
  Scissors2,
  Ruler2,
  Compass23,
  MapPin22,
  CalendarCheck2,
  CalendarClock2,
  CalendarHeart2,
  CalendarPlus2,
  CalendarRange2,
  CalendarX2,
  Clock12,
  Clock22,
  Clock32,
  Clock42,
  Clock52,
  Clock62,
  Clock72,
  Clock82,
  Clock92,
  Clock102,
  Clock112,
  Clock122,
  AlarmClock2,
  Timer2,
  Stopwatch2,
  Hourglass2,
  SunMoon2,
  CloudSun2,
  CloudMoon2,
  CloudFog2,
  Wind2,
  Umbrella2,
  Snowflake2,
  Droplet2,
  Droplets2,
  ThermometerSun2,
  ThermometerSnowflake2,
  Flame2,
  Leaf2,
  Plant2,
  TreeDeciduous2,
  TreePine2,
  Mountain2,
  Beach2,
  Waves2,
  Volcano2,
  Desert2,
  StarOff2,
  MoonStar2,
  Meteor2,
  Rainbow2,
  Sunrise2,
  Sunset2,
  Aurora2,
  Tornado2,
  Hurricane2,
  Earth2,
  Planet2,
  Galaxy2,
  Comet2,
  Satellite2,
  SatelliteDish2,
  Radio2,
  Tv3,
  Wifi3,
  Bluetooth3,
  Signal2,
  Battery2,
  Charging2,
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
