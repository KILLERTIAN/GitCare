'use client'

import { useSession } from 'next-auth/react'
import { useAccount, useChainId } from 'wagmi'
import { avalancheFuji } from 'wagmi/chains'
import { useMemo } from 'react'

export interface AuthenticationState {
  // GitHub Authentication
  isGitHubAuthenticated: boolean
  githubUser: {
    id?: string
    login?: string
    name?: string | null
    avatar_url?: string
    email?: string | null
    public_repos?: number
    followers?: number
    following?: number
  } | null
  
  // Wallet Connection
  isWalletConnected: boolean
  walletAddress?: string
  isCorrectNetwork: boolean
  
  // Account Linking
  isWalletLinked: boolean
  linkedWalletAddress?: string
  
  // Overall Status
  isFullyAuthenticated: boolean
  authenticationStep: 'github' | 'wallet' | 'linking' | 'complete'
  
  // Session Management
  sessionStatus: 'loading' | 'authenticated' | 'unauthenticated'
  accessToken?: string
}

export function useAuthenticationState(): AuthenticationState {
  const { data: session, status: sessionStatus } = useSession()
  const { isConnected, address } = useAccount()
  const chainId = useChainId()

  const authState = useMemo((): AuthenticationState => {
    const isGitHubAuthenticated = !!session
    const isWalletConnected = isConnected && !!address
    const isCorrectNetwork = chainId === avalancheFuji.id
    const isWalletLinked = session?.user.walletAddress === address
    const isFullyAuthenticated = isGitHubAuthenticated && isWalletConnected && isWalletLinked && isCorrectNetwork

    let authenticationStep: AuthenticationState['authenticationStep'] = 'github'
    if (isGitHubAuthenticated && !isWalletConnected) {
      authenticationStep = 'wallet'
    } else if (isGitHubAuthenticated && isWalletConnected && !isWalletLinked) {
      authenticationStep = 'linking'
    } else if (isFullyAuthenticated) {
      authenticationStep = 'complete'
    }

    return {
      // GitHub Authentication
      isGitHubAuthenticated,
      githubUser: session?.user || null,
      
      // Wallet Connection
      isWalletConnected,
      walletAddress: address,
      isCorrectNetwork,
      
      // Account Linking
      isWalletLinked,
      linkedWalletAddress: session?.user.walletAddress,
      
      // Overall Status
      isFullyAuthenticated,
      authenticationStep,
      
      // Session Management
      sessionStatus,
      accessToken: session?.accessToken,
    }
  }, [session, sessionStatus, isConnected, address, chainId])

  return authState
}

export default useAuthenticationState