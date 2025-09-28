'use client'

import { useAccount, useContractRead } from 'wagmi'
import { CONTRACT_ADDRESSES, ANONYMOUS_SUPPORT_PLATFORM_ABI, BADGE_NAMES, BadgeType } from '../lib/contracts'
import { Calendar, Gift, Shield, User, CheckCircle, Clock } from 'lucide-react'

interface UserProfileData {
  tokenId: bigint
  badges: number[]
  expiryTimestamp: bigint
  birthMonth: bigint
  isValid: boolean
}

export function UserProfile() {
  const { address } = useAccount()

  const { data: profileData, isLoading } = useContractRead({
    address: CONTRACT_ADDRESSES.ANONYMOUS_SUPPORT_PLATFORM,
    abi: ANONYMOUS_SUPPORT_PLATFORM_ABI,
    functionName: 'getUserProfile',
    args: address ? [address] : undefined,
    enabled: !!address,
  }) as { data: UserProfileData | undefined, isLoading: boolean }

  if (!address) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <User className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Connect Your Wallet</h3>
        <p className="text-gray-300 mb-6">Connect your wallet to view your profile and access support features.</p>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          Connect Wallet
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-white/20 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData || !profileData.isValid) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">No Verification Badge</h3>
        <p className="text-gray-300 mb-6">
          You need a verification badge to access support features. Contact an administrator to get verified.
        </p>
        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          Request Verification
        </button>
      </div>
    )
  }

  const expiryDate = new Date(Number(profileData.expiryTimestamp) * 1000)
  const isExpired = expiryDate < new Date()

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Your Profile</h2>
          <p className="text-gray-400">Token ID: #{profileData.tokenId.toString()}</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-medium ${
          isExpired 
            ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
            : 'bg-green-500/20 text-green-300 border border-green-500/30'
        }`}>
          {isExpired ? (
            <>
              <Clock className="h-4 w-4" />
              <span>Expired</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Active</span>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-purple-400" />
          Verification Badges
        </h3>
        <div className="flex flex-wrap gap-3">
          {profileData.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30"
            >
              {BADGE_NAMES[badge as BadgeType] || `Badge ${badge}`}
            </span>
          ))}
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center text-gray-300">
            <Calendar className="h-5 w-5 mr-3 text-blue-400" />
            <span className="font-medium">Birth Month</span>
          </div>
          <span className="text-white font-semibold">
            {new Date(2024, Number(profileData.birthMonth) - 1).toLocaleString('default', { month: 'long' })}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center text-gray-300">
            <Clock className="h-5 w-5 mr-3 text-green-400" />
            <span className="font-medium">Expires</span>
          </div>
          <span className="text-white font-semibold">
            {expiryDate.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Birthday Airdrop */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <BirthdayAirdrop tokenId={profileData.tokenId} />
      </div>
    </div>
  )
}

function BirthdayAirdrop({ tokenId }: { tokenId: bigint }) {
  const currentYear = new Date().getFullYear()

  const { data: hasClaimed } = useContractRead({
    address: CONTRACT_ADDRESSES.ANONYMOUS_SUPPORT_PLATFORM,
    abi: ANONYMOUS_SUPPORT_PLATFORM_ABI,
    functionName: 'birthdayClaimedByYear',
    args: [tokenId, BigInt(currentYear)],
  })

  const { data: totalClaimed } = useContractRead({
    address: CONTRACT_ADDRESSES.ANONYMOUS_SUPPORT_PLATFORM,
    abi: ANONYMOUS_SUPPORT_PLATFORM_ABI,
    functionName: 'totalAirdropsReceived',
    args: [tokenId],
  })

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Gift className="h-5 w-5 mr-2 text-yellow-400" />
        Birthday Rewards
      </h3>
      
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
        <span className="text-gray-300 font-medium">Total Claimed</span>
        <span className="text-white font-semibold">
          {totalClaimed?.toString() || '0'} airdrops
        </span>
      </div>

      {!hasClaimed && (
        <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          Claim Birthday Airdrop
        </button>
      )}
      
      {hasClaimed && (
        <div className="text-center p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
          <p className="text-green-300 font-medium">
            ✨ You've already claimed your {currentYear} birthday airdrop!
          </p>
        </div>
      )}
    </div>
  )
}