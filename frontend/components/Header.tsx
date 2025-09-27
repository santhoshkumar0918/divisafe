'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Heart, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Divorce Support</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/support-rooms" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Resources
            </Link>
            <Link 
              href="/counselors" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Community
            </Link>
            <Link 
              href="/profile" 
              className="text-slate-300 hover:text-white transition-colors"
            >
              Legal Advice
            </Link>
          </nav>

          {/* Connect Wallet */}
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}