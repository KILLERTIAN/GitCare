'use client'

import { AuthenticationFlow } from '@/components/AuthenticationFlow'
import { useAuthenticationState } from '@/lib/hooks/useAuthenticationState'

export default function AuthTestPage() {
  const authState = useAuthenticationState()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Authentication Test Page
          </h1>
          <p className="text-gray-300">
            Test the GitHub + Wallet authentication integration
          </p>
        </div>

        {/* Authentication Flow Component */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Authentication Flow</h2>
          <AuthenticationFlow showStatus={true} compact={false} />
        </div>

        {/* Authentication State Debug */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Authentication State</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-blue-300">GitHub Authentication</h3>
                <div className="text-sm space-y-1">
                  <p className="text-gray-300">
                    Status: <span className={authState.isGitHubAuthenticated ? 'text-green-400' : 'text-red-400'}>
                      {authState.isGitHubAuthenticated ? 'Connected' : 'Not Connected'}
                    </span>
                  </p>
                  {authState.githubUser && (
                    <>
                      <p className="text-gray-300">Username: <span className="text-white">{authState.githubUser.login}</span></p>
                      <p className="text-gray-300">Name: <span className="text-white">{authState.githubUser.name}</span></p>
                      <p className="text-gray-300">Repos: <span className="text-white">{authState.githubUser.public_repos}</span></p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-orange-300">Wallet Connection</h3>
                <div className="text-sm space-y-1">
                  <p className="text-gray-300">
                    Status: <span className={authState.isWalletConnected ? 'text-green-400' : 'text-red-400'}>
                      {authState.isWalletConnected ? 'Connected' : 'Not Connected'}
                    </span>
                  </p>
                  {authState.walletAddress && (
                    <p className="text-gray-300">
                      Address: <span className="text-white font-mono text-xs">
                        {authState.walletAddress}
                      </span>
                    </p>
                  )}
                  <p className="text-gray-300">
                    Network: <span className={authState.isCorrectNetwork ? 'text-green-400' : 'text-yellow-400'}>
                      {authState.isCorrectNetwork ? 'Avalanche Fuji' : 'Wrong Network'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <h3 className="text-lg font-medium text-purple-300 mb-2">Account Linking</h3>
              <div className="text-sm space-y-1">
                <p className="text-gray-300">
                  Wallet Linked: <span className={authState.isWalletLinked ? 'text-green-400' : 'text-yellow-400'}>
                    {authState.isWalletLinked ? 'Yes' : 'No'}
                  </span>
                </p>
                {authState.linkedWalletAddress && (
                  <p className="text-gray-300">
                    Linked Address: <span className="text-white font-mono text-xs">
                      {authState.linkedWalletAddress}
                    </span>
                  </p>
                )}
                <p className="text-gray-300">
                  Authentication Step: <span className="text-white capitalize">
                    {authState.authenticationStep}
                  </span>
                </p>
                <p className="text-gray-300">
                  Fully Authenticated: <span className={authState.isFullyAuthenticated ? 'text-green-400' : 'text-red-400'}>
                    {authState.isFullyAuthenticated ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Verification */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Requirements Verification</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${authState.isGitHubAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-300">GitHub OAuth authentication working</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${authState.isWalletConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-300">Wallet connection (MetaMask/WalletConnect) working</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${authState.isCorrectNetwork ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-gray-300">Automatic network switching to Avalanche Fuji</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${authState.isWalletLinked ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-gray-300">Wallet address linked to GitHub account</span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${authState.sessionStatus === 'authenticated' && authState.githubUser ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-300">NextAuth session includes GitHub profile data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}