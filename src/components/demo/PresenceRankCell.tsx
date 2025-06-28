
import React from 'react';
import { renderPresenceRank } from '@/utils/demoUtils';

interface PresenceRankCellProps {
  presence: boolean;
  rank?: number;
  brand: string;
}

export const PresenceRankCell: React.FC<PresenceRankCellProps> = ({ presence, rank, brand }) => {
  if (!presence) {
    return (
      <span className="text-gray-400 text-sm">
        Not present
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-green-600 text-xs font-medium">Present</span>
      {rank && renderPresenceRank(rank)}
    </div>
  );
};
