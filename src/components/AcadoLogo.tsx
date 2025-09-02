import React from 'react';

interface AcadoLogoProps {
  className?: string;
  white?: boolean;
}

export const AcadoLogo: React.FC<AcadoLogoProps> = ({ className = '', white = false }) => {
  const color = white ? '#FFFFFF' : '#A3E635';
  
  return (
    <svg 
      viewBox="0 0 800 160" 
      className={`${className}`}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Letter A with unique design */}
      <path d="M40 120L60 40L80 40L100 120L80 120L75 100L45 100L40 120ZM50 80L70 80L60 45L50 80Z" transform="scale(1.2)" />
      
      {/* Letter C */}
      <path d="M160 45Q180 40 200 40Q240 40 240 80Q240 120 200 120Q180 120 160 115L160 95Q180 100 200 100Q220 100 220 80Q220 60 200 60Q180 60 160 65L160 45Z" />
      
      {/* Letter A */}
      <path d="M280 120L300 40L320 40L340 120L320 120L315 100L285 100L280 120ZM290 80L310 80L300 45L290 80Z" />
      
      {/* Letter D */}
      <path d="M380 40L420 40Q460 40 460 80Q460 120 420 120L380 120L380 40ZM400 60L400 100L420 100Q440 100 440 80Q440 60 420 60L400 60Z" />
      
      {/* Letter O */}
      <path d="M500 40Q540 40 540 80Q540 120 500 120Q460 120 460 80Q460 40 500 40ZM500 60Q480 60 480 80Q480 100 500 100Q520 100 520 80Q520 60 500 60Z" transform="translate(40, 0)" />
      
      {/* Stylized accent element */}
      <rect x="20" y="20" width="40" height="8" rx="4" />
      <rect x="100" y="130" width="60" height="8" rx="4" />
    </svg>
  );
};