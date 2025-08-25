// SpinnerLoader.tsx
import React from 'react';

interface SpinnerLoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  thickness?: string;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
  size = 'medium',
  color = '#3498db',
  thickness = '4px',
}) => {
  const sizeClass = `spinner-${size}`;

  const spinnerStyle: React.CSSProperties = {
    borderColor: color,
    borderTopColor: 'transparent',
    borderWidth: thickness,
  };

  return (
    <div className={`spinner-container ${sizeClass}`}>
      <div className="spinner" style={spinnerStyle}></div>
    </div>
  );
};

export default SpinnerLoader;
