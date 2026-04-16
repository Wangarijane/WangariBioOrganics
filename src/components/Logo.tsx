import React from 'react';

interface LogoProps {
  className?: string;
  leafColor?: string;
  sunburstColor?: string;
  bgColor?: string;
}

export function Logo({ 
  className = "w-12 h-12", 
  leafColor = "#2A4B3C", 
  sunburstColor = "#A0522D",
  bgColor = "#F9F6F0"
}: LogoProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sunburst Rays */}
      <g stroke={sunburstColor} strokeWidth="1.5" strokeLinecap="round">
        <line x1="95.4" y1="24.6" x2="88.3" y2="31.7" />
        <line x1="110" y1="60" x2="100" y2="60" />
        <line x1="95.4" y1="95.4" x2="88.3" y2="88.3" />
        <line x1="60" y1="110" x2="60" y2="100" />
        <line x1="24.6" y1="95.4" x2="31.7" y2="88.3" />
        <line x1="10" y1="60" x2="20" y2="60" />
        <line x1="24.6" y1="24.6" x2="31.7" y2="31.7" />
      </g>
      
      {/* Inner Aura Ring */}
      <circle cx="60" cy="60" r="36" stroke={sunburstColor} strokeWidth="0.75" strokeDasharray="2 4" opacity="0.8" />

      {/* Leaf Base/Background to hide sunburst lines behind it */}
      <path 
        d="M60 100 C 20 80, 30 30, 60 15 C 90 30, 100 80, 60 100 Z" 
        fill={bgColor} 
      />

      {/* Leaf Outline */}
      <path 
        d="M60 100 C 20 80, 30 30, 60 15 C 90 30, 100 80, 60 100 Z" 
        stroke={leafColor} 
        strokeWidth="2.5" 
        strokeLinejoin="round"
      />
      
      {/* Center Vein */}
      <path 
        d="M60 100 L 60 15" 
        stroke={leafColor} 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Side Veins */}
      <path d="M60 80 C 50 75, 42 65, 40 55" stroke={leafColor} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M60 80 C 70 75, 78 65, 80 55" stroke={leafColor} strokeWidth="1.5" strokeLinecap="round"/>
      
      <path d="M60 60 C 52 55, 46 48, 44 40" stroke={leafColor} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M60 60 C 68 55, 74 48, 76 40" stroke={leafColor} strokeWidth="1.5" strokeLinecap="round"/>
      
      <path d="M60 40 C 55 36, 51 31, 50 25" stroke={leafColor} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M60 40 C 65 36, 69 31, 70 25" stroke={leafColor} strokeWidth="1.5" strokeLinecap="round"/>

      {/* Radiating Star at the tip */}
      <path 
        d="M60 2 L 61.5 6.5 L 66 8 L 61.5 9.5 L 60 14 L 58.5 9.5 L 54 8 L 58.5 6.5 Z" 
        fill={sunburstColor} 
      />
    </svg>
  );
}
