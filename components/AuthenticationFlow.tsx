'use client'

import { useSession } from 'next-auth/react'
// Removed WalletConnection import as blockchain functionality has been removed
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface AuthenticationFlowProps {
  showStatus?: boolean
  compact?: boolean
}

export function AuthenticationFlow({ showStatus = true, compact = false }: AuthenticationFlowProps) {
  const { data: session, status: sessionStatus } = useSession()

  const isGitHubAuthenticated = !!session

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={() => window.location.href = '/dashboard'}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showStatus && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Authentication Status</h3>
          
          {/* GitHub Authentication Status */}
          <div className="flex items-center gap-2 p-3 rounded-lg border">
            {sessionStatus === 'loading' ? (
              <Clock className="h-5 w-5 text-yellow-500" />
            ) : isGitHubAuthenticated ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <div>
              <p className="font-medium">GitHub Authentication</p>
              <p className="text-sm text-gray-600">
                {sessionStatus === 'loading' 
                  ? 'Checking authentication...'
                  : isGitHubAuthenticated 
                    ? `Connected as @${session?.user?.login}`
                    : 'Not connected to GitHub'
                }
              </p>
            </div>
          </div>

          {/* Overall Status */}
          <div className={`p-3 rounded-lg border-2 ${
            isGitHubAuthenticated 
              ? 'border-green-500 bg-green-50' 
              : 'border-yellow-500 bg-yellow-50'
          }`}>
            <p className="font-medium">
              {isGitHubAuthenticated 
                ? '✅ Ready to use GitCare'
                : '⚠️ Sign in with GitHub to get started'
              }
            </p>
          </div>
        </div>
      )}

      {/* Authentication Component */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">You're all set! Ready to start building?</p>
        <Button
          onClick={() => window.location.href = '/dashboard'}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
        >
          Go to Dashboard
        </Button>
      </div>

      {/* Next Steps */}
      {!isGitHubAuthenticated && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Sign in with your GitHub account to get started</li>
          </ul>
        </div>
      )}
    </div>
  )
}