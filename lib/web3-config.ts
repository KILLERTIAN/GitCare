import { createConfig, http } from 'wagmi'
import { avalanche, avalancheFuji } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [avalancheFuji, avalanche],
  connectors: [
    injected(),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '7a026d961241ea662d0e403720f0552d' 
    }),
  ],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(process.env.NEXT_PUBLIC_AVALANCHE_FUJI_RPC_URL),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}