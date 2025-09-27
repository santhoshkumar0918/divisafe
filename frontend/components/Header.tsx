'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Heart, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-primary-600" />
            </div>
            <span className="text-xl font-bold text-neutral-900">DiviSafe</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/support-rooms" 
              className="flex items-center space-x-1 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Support Rooms</span>
            </Link>
            <Link 
              href="/counselors" 
              className="flex items-center space-x-1 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Counselors</span>
            </Link>
            <Link 
              href="/profile" 
              className="text-neutral-600 hover:text-primary-600 transition-colors"
            >
              Profile
            </Link>
          </nav>

          {/* Connect Wallet */}
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}