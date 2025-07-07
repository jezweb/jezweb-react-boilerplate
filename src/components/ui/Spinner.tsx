import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

interface SpinnerProps {
  size?: string;
  strokeWidth?: string;
  fill?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = '50px', 
  strokeWidth = '4',
  fill = 'var(--primary-color)',
}) => {
  return (
    <div className="flex items-center justify-center p-4">
      <ProgressSpinner 
        style={{ width: size, height: size }}
        strokeWidth={strokeWidth}
        fill={fill}
        animationDuration=".5s"
      />
    </div>
  );
};