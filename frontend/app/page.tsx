'use client'

import { UserProfile } from '@/components/UserProfile'
import { MessageCircle, Users, Shield, Heart, Brain, Lock, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Modern Header */}
      <header className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                DiviSafe
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Home
              </Link>
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

            {/* Mobile Menu */}
            <div className="flex items-center">
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
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  Home
                </Link>
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
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Anonymous
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Divorce Support</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Navigate divorce proceedings with privacy, dignity, and AI-powered emotional support. 
              Connect anonymously with others who understand your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/support-rooms" className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Join Support Rooms
              </Link>
              <Link href="/ai-support" className="inline-flex items-center justify-center px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105">
                <Brain className="w-5 h-5 mr-2" />
                AI Emotional Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <QuickAccessCard
              icon={<MessageCircle className="w-12 h-12 text-purple-400 mb-6 group-hover:text-purple-300 transition-colors duration-300" />}
              title="Anonymous Chat Rooms"
              description="Connect with others going through similar experiences in a safe and anonymous environment"
              href="/support-rooms"
            />
            <QuickAccessCard
              icon={<Brain className="w-12 h-12 text-blue-400 mb-6 group-hover:text-blue-300 transition-colors duration-300" />}
              title="AI Emotional Support"
              description="Get 24/7 emotional support from our advanced AI companion trained for divorce counseling"
              href="/ai-support"
            />
            <QuickAccessCard
              icon={<Shield className="w-12 h-12 text-green-400 mb-6 group-hover:text-green-300 transition-colors duration-300" />}
              title="Professional Counselors"
              description="Connect with verified professional counselors and legal advisors"
              href="/counselors"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Privacy-First Support Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on blockchain technology with AI-powered emotional support to ensure your privacy 
              and provide trustworthy guidance during difficult times.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Lock className="h-8 w-8" />}
              title="Anonymous & Secure"
              description="Your identity is protected through blockchain verification. Share your experiences without revealing personal information."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Verified Community"
              description="Connect with verified members who have gone through similar experiences. Age and jurisdiction verification ensures relevant support."
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="AI Emotional Support"
              description="Advanced AI companion provides 24/7 emotional support, crisis detection, and personalized coping strategies."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Crisis Detection"
              description="AI monitors conversations for crisis indicators and can escalate to human professionals when needed."
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8" />}
              title="Cultural Sensitivity"
              description="AI trained on diverse cultural contexts including Indian family dynamics and religious considerations."
            />
            <FeatureCard
              icon={<MessageCircle className="h-8 w-8" />}
              title="Specialized Rooms"
              description="Access rooms based on your specific needs: age groups, professional sectors, cultural backgrounds, and more."
            />
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Verification Profile
            </h2>
            <p className="text-xl text-gray-300">
              Get verified to access support features and build trust within the community.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <UserProfile />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DiviSafe</span>
              </div>
              <p className="text-gray-400">
                A privacy-first platform for anonymous divorce support with AI-powered emotional guidance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/support-rooms" className="hover:text-purple-400 transition-colors">Support Rooms</Link></li>
                <li><Link href="/ai-support" className="hover:text-purple-400 transition-colors">AI Support</Link></li>
                <li><Link href="/counselors" className="hover:text-purple-400 transition-colors">Find Counselors</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Privacy</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/security" className="hover:text-purple-400 transition-colors">Security</Link></li>
                <li><Link href="/verification" className="hover:text-purple-400 transition-colors">Verification</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-purple-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-purple-400 transition-colors">Disclaimer</Link></li>
                <li><Link href="/contact" className="hover:text-purple-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DiviSafe. Built with privacy, compassion, and AI-powered support.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function QuickAccessCard({ icon, title, description, href }: { 
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex flex-col items-center text-center min-h-[280px] justify-center">
      {icon}
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </Link>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-purple-500/20 transition-all duration-300 transform hover:scale-105">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  )
}