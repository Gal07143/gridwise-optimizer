
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowDown,
  ArrowRight,
  Battery,
  Home,
  Sun,
  Zap,
  Grid,
  Plug,
  PlugZap,
  Car,
  Lightbulb
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/theme/ThemeProvider';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Define a Camera component
const Camera = () => {
  return <perspectiveCamera position={[0, 0, 5]} />;
};

// 3D Animation components
const SolarPanel = () => {
  const mesh = React.useRef<THREE.Mesh>(null!);
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
    }
  });
  
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

// Energy flow animation component
const EnergyFlow = ({ from, to, active = true, color = '#10b981' }) => {
  const fromPos = {
    solar: { x: -6, y: 2 },
    battery: { x: -6, y: -2 },
    grid: { x: 0, y: 2 },
    home: { x: 0, y: -2 },
    car: { x: 6, y: -2 }
  };
  
  const positions = {
    x1: fromPos[from]?.x || 0,
    y1: fromPos[from]?.y || 0,
    x2: fromPos[to]?.x || 0,
    y2: fromPos[to]?.y || 0
  };
  
  const [dots, setDots] = useState([
    { id: 1, position: 0 },
    { id: 2, position: 0.3 },
    { id: 3, position: 0.6 }
  ]);
  
  React.useEffect(() => {
    if (!active) return;
    
    const interval = setInterval(() => {
      setDots(prevDots =>
        prevDots.map(dot => ({
          ...dot,
          position: dot.position >= 1 ? 0 : dot.position + 0.03
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, [active]);
  
  if (!active) return null;
  
  const distance = Math.sqrt(
    Math.pow(positions.x2 - positions.x1, 2) + Math.pow(positions.y2 - positions.y1, 2)
  );
  
  const angle = Math.atan2(positions.y2 - positions.y1, positions.x2 - positions.x1);
  
  return (
    <g>
      <line
        x1={positions.x1}
        y1={positions.y1}
        x2={positions.x2}
        y2={positions.y2}
        stroke={color}
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      {dots.map(dot => {
        const x = positions.x1 + dot.position * (positions.x2 - positions.x1);
        const y = positions.y1 + dot.position * (positions.y2 - positions.y1);
        return (
          <circle
            key={dot.id}
            cx={x}
            cy={y}
            r="5"
            fill={color}
          />
        );
      })}
    </g>
  );
};

const EnergyFlowPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [solarOutput, setSolarOutput] = useState(80);
  const [batteryCharge, setBatteryCharge] = useState(65);
  const [homeConsumption] = useState(3.2);
  const [evCharging, setEvCharging] = useState(true);
  const [gridExport, setGridExport] = useState(true);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Energy Flow</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 h-[600px] relative overflow-hidden">
          <CardHeader>
            <CardTitle>Live Energy Flow</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="w-full h-full relative">
              <svg viewBox="-10 -5 20 10" className="w-full h-full">
                {/* Solar panel */}
                <g transform="translate(-6, -3)">
                  <rect x="-1.5" y="-1" width="3" height="2" fill={isDark ? "#fbbf24" : "#f59e0b"} rx="0.2" />
                  <text x="0" y="1.5" textAnchor="middle" fontSize="0.6" fill="currentColor">Solar Panel</text>
                  <text x="0" y="2.3" textAnchor="middle" fontSize="0.5" fill="currentColor">{solarOutput / 10} kW</text>
                </g>
                
                {/* Battery */}
                <g transform="translate(-6, 1)">
                  <rect x="-1" y="-1" width="2" height="2" fill={isDark ? "#34d399" : "#10b981"} rx="0.2" />
                  <text x="0" y="1.5" textAnchor="middle" fontSize="0.6" fill="currentColor">Battery</text>
                  <text x="0" y="2.3" textAnchor="middle" fontSize="0.5" fill="currentColor">{batteryCharge}%</text>
                </g>
                
                {/* Grid */}
                <g transform="translate(0, -3)">
                  <rect x="-1.5" y="-1" width="3" height="2" fill={isDark ? "#60a5fa" : "#3b82f6"} rx="0.2" />
                  <text x="0" y="1.5" textAnchor="middle" fontSize="0.6" fill="currentColor">Grid</text>
                  <text x="0" y="2.3" textAnchor="middle" fontSize="0.5" fill="currentColor">
                    {gridExport ? "Exporting" : "Importing"}
                  </text>
                </g>
                
                {/* Home */}
                <g transform="translate(0, 1)">
                  <rect x="-1.5" y="-1" width="3" height="2" fill={isDark ? "#f472b6" : "#ec4899"} rx="0.2" />
                  <text x="0" y="1.5" textAnchor="middle" fontSize="0.6" fill="currentColor">Home</text>
                  <text x="0" y="2.3" textAnchor="middle" fontSize="0.5" fill="currentColor">{homeConsumption} kW</text>
                </g>
                
                {/* EV */}
                <g transform="translate(6, 1)">
                  <rect x="-1.5" y="-1" width="3" height="2" fill={isDark ? "#a78bfa" : "#8b5cf6"} rx="0.2" />
                  <text x="0" y="1.5" textAnchor="middle" fontSize="0.6" fill="currentColor">EV</text>
                  <text x="0" y="2.3" textAnchor="middle" fontSize="0.5" fill="currentColor">
                    {evCharging ? "Charging" : "Idle"}
                  </text>
                </g>
                
                {/* Energy flow lines */}
                <EnergyFlow from="solar" to="battery" active={solarOutput > 50} color="#10b981" />
                <EnergyFlow from="solar" to="home" active={solarOutput > 30} color="#10b981" />
                <EnergyFlow from="solar" to="grid" active={solarOutput > 70 && gridExport} color="#10b981" />
                <EnergyFlow from="battery" to="home" active={batteryCharge > 20 && solarOutput < 50} color="#10b981" />
                <EnergyFlow from="grid" to="home" active={solarOutput < 20 && batteryCharge < 15} color="#3b82f6" />
                <EnergyFlow from="battery" to="car" active={evCharging && batteryCharge > 50} color="#10b981" />
                <EnergyFlow from="grid" to="car" active={evCharging && batteryCharge < 20} color="#3b82f6" />
              </svg>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Solar Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <Progress value={solarOutput} />
              </div>
              <div className="flex flex-col space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="solar-output">Solar Output ({solarOutput}%)</Label>
                  </div>
                  <Slider 
                    id="solar-output" 
                    value={[solarOutput]} 
                    min={0} 
                    max={100} 
                    step={5}
                    onValueChange={(vals) => setSolarOutput(vals[0])} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Battery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <Progress value={batteryCharge} />
              </div>
              <div className="flex flex-col space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="battery-charge">Battery Charge ({batteryCharge}%)</Label>
                  </div>
                  <Slider 
                    id="battery-charge" 
                    value={[batteryCharge]} 
                    min={0} 
                    max={100} 
                    step={5} 
                    onValueChange={(vals) => setBatteryCharge(vals[0])} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="ev-charging" checked={evCharging} onCheckedChange={setEvCharging} />
                <Label htmlFor="ev-charging">EV Charging Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="grid-export" checked={gridExport} onCheckedChange={setGridExport} />
                <Label htmlFor="grid-export">Grid Export Enabled</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>3D Visualization</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <SolarPanel />
              <OrbitControls />
              <Camera />
            </Canvas>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnergyFlowPage;
