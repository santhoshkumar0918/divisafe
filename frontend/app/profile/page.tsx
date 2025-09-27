'use client'

import { Header } from '@/components/Header'
import { UserProfile } from '@/components/UserProfile'
import { useAccount, useContractRead } from 'wagmi'
import { CONTRACT_ADDRESSES, SUPPORT_TOKEN_ABI } from '@/lib/contracts'
import { Coins, History, Settings, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { address } = useAccount()

  const { data: tokenBalance } = useContractRead({
    address: CONTRACT_ADDRESSES.SUPPORT_TOKEN,
    abi: SUPPORT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  const { data: tokenSymbol } = useContractRead({
    address: CONTRACT_ADDRESSES.SUPPORT_TOKEN,
    abi: SUPPORT_TOKEN_ABI,
    functionName: 'symbol',
  })

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Your Profile</h1>
          <p className="text-lg text-neutral-600">
            Manage your verification badges, view your activity, and track your support tokens.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2">
            <UserProfile />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Token Balance */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                <Coins className="h-5 w-5 mr-2 text-accent-600" />
                Token Balance
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-neutral-900 mb-1">
                  {tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-neutral-600">{tokenSymbol || 'SPT'}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-xs text-neutral-600 text-center">
                  Earn tokens through birthday airdrops and community participation
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-outline text-left flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Request Verification
                </button>
                <button className="w-full btn-outline text-left flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  View Activity
                </button>
                <button className="w-full btn-outline text-left flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Privacy Settings
                </button>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-primary-50 rounded-xl p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Need Help?</h3>
              <p className="text-sm text-neutral-600 mb-4">
                If you need assistance with verification or have questions about the platform, 
                our support team is here to help.
              </p>
              <button className="btn-primary w-full text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Activity</h2>
          <div className="card">
            <div className="text-center py-12">
              <History className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Activity Yet</h3>
              <p className="text-neutral-600 mb-4">
                Your activity will appear here once you start participating in support rooms or claiming rewards.
              </p>
              <button className="btn-primary">
                Join Your First Support Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}