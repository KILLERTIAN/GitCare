import React from 'react';
import { Star } from 'lucide-react';

interface ReputationBadgeProps {
  level: number;
  rank: string;
}

const ReputationBadge: React.FC<ReputationBadgeProps> = ({ level, rank }) => {
  return (
    <div className="flex items-center space-x-2">
      <Star className="text-yellow-400" />
      <div>
        <p className="font-bold">{rank}</p>
        <p className="text-sm text-gray-500">Level {level}</p>
      </div>
    </div>
  );
};

export default ReputationBadge;
