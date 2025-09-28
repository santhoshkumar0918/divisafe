'use client'

import { useState, useEffect } from 'react'

import { Coins, History, Settings, Shield, ArrowLeft, User, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

// --- FIX: Created a placeholder UserProfile component to resolve the import error ---
const UserProfile = () => {
  return (
    <div className="bg-gray-800/50 border border-white/10 rounded-2xl p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto flex items-center justify-center mb-4 border-4 border-gray-900">
            <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Anonymous User</h2>
        <p className="text-gray-400 mb-6">Verification badges will appear here.</p>
        <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">Not Verified</span>
        </div>
    </div>
  )
}


// A placeholder for the ConnectButton if it's not available in this context
const ConnectButton = () => <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold">Connect Wallet</button>;


export default function ProfilePage() {
  // --- FIX: Mocking wagmi hooks and contract data to resolve import errors ---
  const [address, setAddress] = useState('0x123...AbCdE');
  const [tokenBalance, setTokenBalance] = useState(1234.56 * 1e18); // Storing as a number for simulation
  const [tokenSymbol, setTokenSymbol] = useState('SPT');

  // Simulate account connection
  useEffect(() => {
    // In a real app, this would be handled by a wallet connection library
    // For this placeholder, we'll just use the mock data.
  }, []);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => setMousePosition({ x: ev.clientX, y: ev.clientY });
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans relative overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-30 transition duration-300" style={{ background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 245, 212, 0.15), transparent 80%)` }}></div>
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      
      <div className="relative z-10">
        <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <a href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
                  <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="font-medium">Home</span>
                </a>
                <div className="h-6 w-px bg-white/20"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Profile</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-6">
                    <a href="/support-rooms" className="text-gray-300 hover:text-white transition-colors">Support Rooms</a>
                    <a href="/ai-support" className="text-gray-300 hover:text-white transition-colors">AI Support</a>
                    <a href="/counselors" className="text-gray-300 hover:text-white transition-colors">Counselors</a>
                </div>
                <ConnectButton />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-32 pb-16">
          <motion.div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tighter">Your <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Dashboard</span></h1>
            <p className="text-xl text-gray-400 mx-auto leading-relaxed">Manage your verification, view activity, and track your support tokens.</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <UserProfile />
            </div>
            
            <div className="space-y-8">
              <StatCard title="Token Balance" icon={<Coins className="text-yellow-400" />}>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      {/* FIX: Adjusted to work with a standard number from mock state */}
                      {tokenBalance ? (tokenBalance / 1e18).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-cyan-400 font-semibold">{tokenSymbol || 'SPT'}</div>
                  </div>
              </StatCard>
              
              <StatCard title="Quick Actions" icon={<Settings className="text-cyan-400" />}>
                <div className="space-y-3">
                    <ActionButton icon={<Shield className="text-green-400" />} text="Request Verification" />
                    <ActionButton icon={<History className="text-blue-400" />} text="View Activity History" />
                    <ActionButton icon={<Heart className="text-pink-400" />} text="Manage Privacy" />
                </div>
              </StatCard>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Recent Activity</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Your activity will appear here once you start participating in support rooms or claiming rewards.
                </p>
                <a href="/support-rooms" className="inline-block bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105">
                  Join a Support Room
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Reusable component for dashboard cards
function StatCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

// Reusable component for action buttons
function ActionButton({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 text-left flex items-center">
            <span className="mr-3">{icon}</span>
            {text}
        </button>
    )
}

