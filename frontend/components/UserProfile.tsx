'use client'

import { useAccount, useContractRead } from 'wagmi'
import { CONTRACT_ADDRESSES, ANONYMOUS_SUPPORT_PLATFORM_ABI, BADGE_NAMES, BadgeType } from '../lib/contracts'
import { Calendar, Gift, Shield, User } from 'lucide-react'

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
      <div className="card text-center">
        <User className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Connect Your Wallet</h3>
        <p className="text-neutral-600">Connect your wallet to view your profile and access support features.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-neutral-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!profileData || !profileData.isValid) {
    return (
      <div className="card text-center">
        <Shield className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Verification Badge</h3>
        <p className="text-neutral-600 mb-4">
          You need a verification badge to access support features. Contact an administrator to get verified.
        </p>
        <button className="btn-primary">
          Request Verification
        </button>
      </div>
    )
  }

  const expiryDate = new Date(Number(profileData.expiryTimestamp) * 1000)
  const isExpired = expiryDate < new Date()

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-1">Your Profile</h2>
          <p className="text-sm text-neutral-600">Token ID: #{profileData.tokenId.toString()}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isExpired 
            ? 'bg-red-100 text-red-800' 
            : 'bg-secondary-100 text-secondary-800'
        }`}>
          {isExpired ? 'Expired' : 'Active'}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center">
          <Shield className="h-4 w-4 mr-1" />
          Verification Badges
        </h3>
        <div className="flex flex-wrap gap-2">
          {profileData.badges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {BADGE_NAMES[badge as BadgeType] || `Badge ${badge}`}
            </span>
          ))}
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-neutral-600">
            <Calendar className="h-4 w-4 mr-2" />
            Birth Month
          </div>
          <span className="text-sm font-medium text-neutral-900">
            {new Date(2024, Number(profileData.birthMonth) - 1).toLocaleString('default', { month: 'long' })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-neutral-600">
            <Calendar className="h-4 w-4 mr-2" />
            Expires
          </div>
          <span className="text-sm font-medium text-neutral-900">
            {expiryDate.toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Birthday Airdrop */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
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
      <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center">
        <Gift className="h-4 w-4 mr-1" />
        Birthday Rewards
      </h3>
      
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-neutral-600">Total Claimed</span>
        <span className="text-sm font-medium text-neutral-900">
          {totalClaimed?.toString() || '0'} airdrops
        </span>
      </div>

      {!hasClaimed && (
        <button className="btn-secondary w-full text-sm">
          Claim Birthday Airdrop
        </button>
      )}
      
      {hasClaimed && (
        <p className="text-sm text-neutral-600 text-center">
          You've already claimed your {currentYear} birthday airdrop!
        </p>
      )}
    </div>
  )
}