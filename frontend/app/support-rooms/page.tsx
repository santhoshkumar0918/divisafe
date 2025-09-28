'use client'

import { MessageCircle, Scale, Heart, DollarSign, Home, Bot, ArrowLeft, Users, Shield, Clock, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SupportRoomsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const categories = [
    {
      id: 'general',
      title: 'General Support',
      description: 'Open discussions about relationship challenges and life transitions',
      icon: MessageCircle,
      gradient: 'from-blue-500 to-purple-500',
      participants: 127,
      href: '/rooms/general'
    },
    {
      id: 'legal',
      title: 'Legal Guidance',
      description: 'Professional advice on legal processes and documentation',
      icon: Scale,
      gradient: 'from-purple-500 to-pink-500',
      participants: 89,
      href: '/rooms/legal'
    },
    {
      id: 'emotional',
      title: 'Emotional Wellbeing',
      description: 'Share feelings, coping strategies, and healing journeys',
      icon: Heart,
      gradient: 'from-pink-500 to-red-500',
      participants: 156,
      href: '/rooms/emotional'
    },
    {
      id: 'financial',
      title: 'Financial Recovery',
      description: 'Asset division, budgeting, and financial independence',
      icon: DollarSign,
      gradient: 'from-green-500 to-emerald-500',
      participants: 94,
      href: '/rooms/financial'
    },
    {
      id: 'coparenting',
      title: 'Co-Parenting',
      description: 'Collaborative parenting strategies and child-focused solutions',
      icon: Home,
      gradient: 'from-orange-500 to-yellow-500',
      participants: 73,
      href: '/rooms/coparenting'
    },
    {
      id: 'ai-support',
      title: 'AI Companion',
      description: '24/7 AI emotional support and crisis intervention',
      icon: Bot,
      gradient: 'from-cyan-500 to-blue-500',
      participants: 'Always Available',
      href: '/ai-support'
    }
  ]

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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Support Rooms
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Anonymous
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Support Rooms</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connect with others going through similar experiences in a safe, anonymous, and supportive environment
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-gray-400 text-sm">Active Members</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Support Available</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-gray-400 text-sm">Anonymous</div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{category.participants} {typeof category.participants === 'number' ? 'members' : ''}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Safety Notice */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-400 mr-3" />
            <h3 className="text-xl font-bold text-white">Your Safety & Privacy</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Anonymous</h4>
              <p className="text-sm">Your identity is completely protected. Share without fear.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Moderated</h4>
              <p className="text-sm">All rooms are monitored by trained professionals.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Confidential</h4>
              <p className="text-sm">What's shared here, stays here. Respect others' privacy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}