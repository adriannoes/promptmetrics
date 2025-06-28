
import React from 'react';

interface VolumeIndicatorProps {
  volume: number; // 1-5 scale
}

export const VolumeIndicator: React.FC<VolumeIndicatorProps> = ({ volume }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((level) => (
        <div
          key={level}
          className={`w-2 h-4 rounded-sm ${
            level <= volume ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{volume}/5</span>
    </div>
  );
};
