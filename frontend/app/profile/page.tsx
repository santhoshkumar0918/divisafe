'use client'

import { UserProfile } from '@/components/UserProfile'
import { useAccount, useContractRead } from 'wagmi'
import { CONTRACT_ADDRESSES, SUPPORT_TOKEN_ABI } from '@/lib/contracts'
import { Coins, History, Settings, Shield, ArrowLeft, Menu, X, User, Heart } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Back */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Your Profile
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/support-rooms" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Support Rooms
              </Link>
              <Link href="/ai-support" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                AI Support
              </Link>
              <Link href="/counselors" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Counselors
              </Link>
            </nav>

            {/* Connect Wallet & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <ConnectButton />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4">
                <Link href="/support-rooms" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  Support Rooms
                </Link>
                <Link href="/ai-support" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  AI Support
                </Link>
                <Link href="/counselors" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  Counselors
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Profile</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Coins className="h-5 w-5 mr-2 text-yellow-400" />
                Token Balance
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {tokenBalance ? (Number(tokenBalance) / 1e18).toFixed(2) : '0.00'}
                </div>
                <div className="text-sm text-gray-400">{tokenSymbol || 'SPT'}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400 text-center">
                  Earn tokens through birthday airdrops and community participation
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-300 text-left flex items-center">
                  <Shield className="h-4 w-4 mr-3 text-green-400" />
                  Request Verification
                </button>
                <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-300 text-left flex items-center">
                  <History className="h-4 w-4 mr-3 text-blue-400" />
                  View Activity
                </button>
                <button className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-300 text-left flex items-center">
                  <Settings className="h-4 w-4 mr-3 text-purple-400" />
                  Privacy Settings
                </button>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-3xl p-6">
              <h3 className="font-semibold text-white mb-2">Need Help?</h3>
              <p className="text-sm text-gray-300 mb-4">
                If you need assistance with verification or have questions about the platform, 
                our support team is here to help.
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 w-full">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Activity Yet</h3>
              <p className="text-gray-300 mb-6">
                Your activity will appear here once you start participating in support rooms or claiming rewards.
              </p>
              <Link href="/support-rooms" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105">
                Join Your First Support Room
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}