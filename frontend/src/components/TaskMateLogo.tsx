import React from 'react';

interface TaskMateLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const TaskMateLogo: React.FC<TaskMateLogoProps> = ({ 
  size = 40, 
  showText = true,
  className = '' 
}) => {
  const textSize = size * 0.6;
  const uniqueId = React.useId();
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Gradient */}
          <linearGradient id={`mainGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#355070" />
            <stop offset="50%" stopColor="#B56576" />
            <stop offset="100%" stopColor="#E88C7D" />
          </linearGradient>
          
          {/* Accent Gradient */}
          <linearGradient id={`accentGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E56B6F" />
            <stop offset="100%" stopColor="#EAAC8B" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id={`glow-${uniqueId}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer Circle with Gradient */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill={`url(#mainGradient-${uniqueId})`}
          opacity="0.15"
        />
        
        {/* Middle Circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="38" 
          fill={`url(#mainGradient-${uniqueId})`}
          opacity="0.3"
        />
        
        {/* Main Container Circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="30" 
          fill={`url(#mainGradient-${uniqueId})`}
          filter={`url(#glow-${uniqueId})`}
        />
        
        {/* Modern Checkmark - Clean and Simple */}
        <path
          d="M 35 48 L 43 58 L 65 36"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.95"
        />
        
        {/* Accent Dot - Top Right */}
        <circle 
          cx="70" 
          cy="30" 
          r="4" 
          fill={`url(#accentGradient-${uniqueId})`}
          opacity="0.8"
        />
        
        {/* Accent Dot - Bottom Left */}
        <circle 
          cx="30" 
          cy="70" 
          r="3" 
          fill={`url(#accentGradient-${uniqueId})`}
          opacity="0.6"
        />
      </svg>
      
      {showText && (
        <span 
          className="tracking-tight"
          style={{ 
            fontSize: `${textSize}px`,
            background: 'linear-gradient(135deg, #355070 0%, #B56576 50%, #E88C7D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          TaskMate
        </span>
      )}
    </div>
  );
};
