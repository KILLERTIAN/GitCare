'use client'

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

interface User {
  address: string;
  isAuthenticated: boolean;
}

export function useAuthentication() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (isConnected && address) {
      setUser({ address, isAuthenticated: true })
    } else {
      setUser(null)
    }
  }, [isConnected, address])

  const login = () => {
    connect({ connector: injected() })
  }

  return {
    user,
    connect: login,
    disconnect,
    isLoading: false, // Replace with actual loading state if async operations are added
  }
}
