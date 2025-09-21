import { Bounty } from '@/types/bounty';
import { BountyCard } from './BountyCard';

interface BountyListProps {
  bounties: Bounty[];
}

export function BountyList({ bounties }: BountyListProps) {
  if (bounties.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No bounties found. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bounties.map((bounty) => (
        <BountyCard key={bounty.id} bounty={bounty} />
      ))}
    </div>
  );
}
