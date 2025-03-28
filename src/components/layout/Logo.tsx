
import React from "react";
import { Zap } from "lucide-react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Zap className="h-6 w-6 text-primary" />
      <span className="font-bold text-xl">EnergyOS</span>
    </div>
  );
};

export default Logo;
