import { BountyManager } from '@/components/bounty'

export default function BountiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BountyManager showStats={true} />
    </div>
  )
}