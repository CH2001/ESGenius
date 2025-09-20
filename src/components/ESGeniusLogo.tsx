import React from 'react';
import { Leaf, TrendingUp } from 'lucide-react';

interface ESGeniusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const ESGeniusLogo: React.FC<ESGeniusLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeConfig = {
    sm: { icon: 'h-6 w-6', text: 'text-lg' },
    md: { icon: 'h-8 w-8', text: 'text-xl' },
    lg: { icon: 'h-12 w-12', text: 'text-2xl' },
    xl: { icon: 'h-16 w-16', text: 'text-3xl' }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="gradient-primary rounded-lg p-2 shadow-soft">
          <Leaf className={`${sizeConfig[size].icon} text-white`} />
        </div>
        <div className="absolute -top-1 -right-1 bg-secondary rounded-full p-1">
          <TrendingUp className="h-3 w-3 text-white" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizeConfig[size].text} font-bold text-primary`}>
            ESGenius
          </span>
          {size === 'lg' || size === 'xl' ? (
            <span className="text-xs text-muted-foreground -mt-1">
              ESG Compliance Made Smart
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};