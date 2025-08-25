import React from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  children?: React.ReactNode;
}

const sizeMap = {
  sm: { size: 48, strokeWidth: 4 },
  md: { size: 64, strokeWidth: 6 },
  lg: { size:80, strokeWidth: 8 },
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 'md',
  strokeWidth: customStrokeWidth,
  children,
}) => {
  const { size: svgSize, strokeWidth: defaultStrokeWidth } = sizeMap[size];
  const strokeWidth = customStrokeWidth || defaultStrokeWidth;
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={svgSize}
        height={svgSize}
      >
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-500 transition-all duration-300 ease-in-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};