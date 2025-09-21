import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { avalanche, avalancheFuji } from 'viem/chains'
import { GITCARE_BOUNTY_ADDRESS, GITCARE_BOUNTY_ABI } from '@/lib/contracts/gitcare-bounty'

// Use Avalanche mainnet by default, fallback to Fuji testnet
const client = createPublicClient({
  chain: process.env.NODE_ENV === 'production' ? avalanche : avalancheFuji,
  transport: http()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bountyId = parseInt(params.id)
    
    if (isNaN(bountyId) || bountyId <= 0) {
      return NextResponse.json({ error: 'Invalid bounty ID' }, { status: 400 })
    }

    // Fetch bounty data from the contract
    const bountyData = await client.readContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'getBounty',
      args: [BigInt(bountyId)]
    })

    // Check if bounty exists (id should be > 0)
    if (!bountyData || bountyData[0] === 0n) {
      return NextResponse.json({ error: 'Bounty not found' }, { status: 404 })
    }

    // Format the response
    const bounty = {
      id: bountyData[0].toString(),
      creator: bountyData[1],
      title: bountyData[2],
      description: bountyData[3],
      reward: bountyData[4].toString(),
      isCompleted: bountyData[5],
      completedBy: bountyData[6],
      createdAt: bountyData[7].toString(),
      deadline: bountyData[8].toString(),
      tags: bountyData[9]
    }

    return NextResponse.json(bounty)
  } catch (error) {
    console.error('Error fetching bounty:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bounty data' }, 
      { status: 500 }
    )
  }
}