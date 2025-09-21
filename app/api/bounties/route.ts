import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { avalanche, avalancheFuji } from 'viem/chains'
import { GITCARE_BOUNTY_ADDRESS, GITCARE_BOUNTY_ABI } from '@/lib/contracts/gitcare-bounty'

const client = createPublicClient({
  chain: process.env.NODE_ENV === 'production' ? avalanche : avalancheFuji,
  transport: http()
})

export async function GET(request: NextRequest) {
  try {
    // Get total bounty count
    const bountyCount = await client.readContract({
      address: GITCARE_BOUNTY_ADDRESS,
      abi: GITCARE_BOUNTY_ABI,
      functionName: 'bountyCount'
    }) as bigint

    if (bountyCount === 0n) {
      return NextResponse.json([])
    }

    // Fetch all bounties
    const bountyPromises = []
    for (let i = 1; i <= Number(bountyCount); i++) {
      bountyPromises.push(
        client.readContract({
          address: GITCARE_BOUNTY_ADDRESS,
          abi: GITCARE_BOUNTY_ABI,
          functionName: 'getBounty',
          args: [BigInt(i)]
        }).catch(() => null) // Handle individual failures gracefully
      )
    }

    const bountyResults = await Promise.all(bountyPromises)
    
    // Format and filter valid bounties
    const bounties = bountyResults
      .filter(Boolean)
      .map((bountyData: any) => ({
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
      }))

    return NextResponse.json(bounties)
  } catch (error) {
    console.error('Error fetching bounties:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bounties' }, 
      { status: 500 }
    )
  }
}