import React from 'react';
import { Activity, BarChart, Database, Globe, Layers, Shield, Zap, Cloud, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoIconProps = {
  productId: string;
  className?: string;
  darkBackground?: boolean;
};

export const LogoIcon = ({ productId, className, darkBackground = false }: LogoIconProps) => {
  const iconClass = "w-12 h-12 stroke-2";
  const wrapperClass = cn(
    "flex items-center justify-center p-4 rounded-full",
    darkBackground ? "bg-white/10 backdrop-blur-sm ring-1 ring-white/20" : "bg-white ring-1 ring-gray-200",
    "shadow-lg transition-all duration-300",
    className
  );

  const getIcon = () => {
    switch (productId) {
      case 'dar-zarrouk':
        return <Activity className={cn(iconClass, "text-red-500")} />;
      case 'soilcloud':
        return <Cloud className={cn(iconClass, "text-blue-500")} />;
      case 'gravimag-cloud':
        return <Globe className={cn(iconClass, "text-purple-500")} />;
      case 'nigeria-geoportal':
        return <Map className={cn(iconClass, "text-green-600")} />;
      default:
        return <Activity className={cn(iconClass, "text-red-500")} />;
    }
  };

  return (
    <div className={wrapperClass}>
      {getIcon()}
    </div>
  );
};
