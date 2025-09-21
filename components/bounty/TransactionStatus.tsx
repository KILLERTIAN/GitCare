'use client'

import { useBountyContract } from '@/hooks/use-bounty-contract'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Loader, AlertTriangle } from 'lucide-react'

export function TransactionStatus() {
  const { transactionState } = useBountyContract()
  const { isPending, isConfirming, isConfirmed, hash } = transactionState

  const getStatus = () => {
    if (isConfirmed) return { text: 'Transaction Confirmed!', icon: CheckCircle, color: 'text-green-400' }
    if (isConfirming) return { text: 'Confirming transaction...', icon: Loader, color: 'text-blue-400', animate: true }
    if (isPending) return { text: 'Waiting for wallet confirmation...', icon: Loader, color: 'text-yellow-400', animate: true }
    return null
  }

  const status = getStatus()

  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-5 right-5 z-50"
        >
          <div className="flex items-center gap-4 p-4 rounded-lg shadow-lg glass-card border border-white/20">
            <status.icon className={`h-6 w-6 ${status.color} ${status.animate ? 'animate-spin' : ''}`} />
            <div className="flex flex-col">
              <span className="font-semibold text-white">{status.text}</span>
              {hash && (
                <a
                  href={`https://testnet.snowtrace.io/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  View on Snowtrace
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
