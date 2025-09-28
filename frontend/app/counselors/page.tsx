'use client'

import { Shield, Star, MessageCircle, Calendar, Globe, Award, ArrowLeft, Menu, X, Heart, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const COUNSELORS = [
  {
    id: 1,
    name: 'Dr. Sarah M.',
    specialization: 'Family Therapy & Divorce Counseling',
    jurisdiction: 'US',
    rating: 4.9,
    reviews: 127,
    experience: '12+ years',
    languages: ['English', 'Spanish'],
    availability: 'Available',
    badges: ['Licensed Therapist', 'Divorce Specialist', 'Child Psychology'],
    description: 'Specialized in helping families navigate divorce with focus on children\'s wellbeing and co-parenting strategies.',
  },
  {
    id: 2,
    name: 'Dr. James K.',
    specialization: 'Legal Counseling & Mediation',
    jurisdiction: 'EU',
    rating: 4.8,
    reviews: 89,
    experience: '15+ years',
    languages: ['English', 'German', 'French'],
    availability: 'Busy',
    badges: ['Family Law', 'Mediation Certified', 'EU Legal Expert'],
    description: 'Expert in European family law with extensive experience in divorce mediation and legal guidance.',
  },
  {
    id: 3,
    name: 'Dr. Priya S.',
    specialization: 'Emotional Support & Trauma Therapy',
    jurisdiction: 'IN',
    rating: 4.9,
    reviews: 156,
    experience: '10+ years',
    languages: ['English', 'Hindi', 'Tamil'],
    availability: 'Available',
    badges: ['Trauma Specialist', 'EMDR Certified', 'Cultural Sensitivity'],
    description: 'Focuses on emotional healing and trauma recovery during divorce proceedings with cultural sensitivity.',
  },
  {
    id: 4,
    name: 'Dr. Michael R.',
    specialization: 'Financial Planning & Asset Division',
    jurisdiction: 'US',
    rating: 4.7,
    reviews: 94,
    experience: '8+ years',
    languages: ['English'],
    availability: 'Available',
    badges: ['Financial Advisor', 'Asset Division', 'Retirement Planning'],
    description: 'Helps couples navigate financial aspects of divorce including asset division and future planning.',
  },
]

export default function CounselorsPage() {
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
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Professional Counselors
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
                <Link href="/support-rooms" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  Support Rooms
                </Link>
                <Link href="/ai-support" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  AI Support
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
            Verified
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Counselors</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Connect with verified professional counselors who specialize in divorce support, 
            legal guidance, and emotional healing. All sessions are confidential and secure.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-gray-400 text-sm">Licensed Professionals</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">4.8★</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-gray-400 text-sm">Sessions Completed</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-12">
          <h3 className="text-lg font-semibold text-white mb-6">Find Your Perfect Match</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Specialization</label>
              <select className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                <option className="bg-gray-800">All Specializations</option>
                <option className="bg-gray-800">Family Therapy</option>
                <option className="bg-gray-800">Legal Counseling</option>
                <option className="bg-gray-800">Financial Planning</option>
                <option className="bg-gray-800">Emotional Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Jurisdiction</label>
              <select className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                <option className="bg-gray-800">All Jurisdictions</option>
                <option className="bg-gray-800">United States</option>
                <option className="bg-gray-800">European Union</option>
                <option className="bg-gray-800">India</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Language</label>
              <select className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                <option className="bg-gray-800">All Languages</option>
                <option className="bg-gray-800">English</option>
                <option className="bg-gray-800">Spanish</option>
                <option className="bg-gray-800">German</option>
                <option className="bg-gray-800">French</option>
                <option className="bg-gray-800">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Availability</label>
              <select className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                <option className="bg-gray-800">All</option>
                <option className="bg-gray-800">Available Now</option>
                <option className="bg-gray-800">Available Today</option>
                <option className="bg-gray-800">Available This Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Counselors Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {COUNSELORS.map((counselor) => (
            <CounselorCard key={counselor.id} counselor={counselor} />
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <Shield className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">1. Verify Your Identity</h3>
              <p className="text-gray-300 leading-relaxed">
                Get verified through our secure blockchain system to access counselor services with complete privacy protection.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                <MessageCircle className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">2. Connect Anonymously</h3>
              <p className="text-gray-300 leading-relaxed">
                Book sessions with counselors while maintaining complete anonymity and privacy. Your identity stays protected.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                <Calendar className="h-10 w-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">3. Schedule Sessions</h3>
              <p className="text-gray-300 leading-relaxed">
                Book one-time consultations or ongoing therapy sessions based on your needs and schedule.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CounselorCard({ counselor }: { counselor: typeof COUNSELORS[0] }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300 transform hover:scale-105">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{counselor.name}</h3>
          <p className="text-green-400 font-medium">{counselor.specialization}</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-medium ${
          counselor.availability === 'Available' 
            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            counselor.availability === 'Available' ? 'bg-green-400' : 'bg-yellow-400'
          } animate-pulse`}></div>
          <span>{counselor.availability}</span>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-6 leading-relaxed">{counselor.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-5 w-5 text-yellow-400 mr-1" />
            <span className="font-bold text-white text-lg">{counselor.rating}</span>
          </div>
          <p className="text-xs text-gray-400">{counselor.reviews} reviews</p>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="font-bold text-white text-lg mb-2">{counselor.experience}</div>
          <p className="text-xs text-gray-400">Experience</p>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-center mb-2">
            <Globe className="h-5 w-5 text-blue-400 mr-1" />
            <span className="font-bold text-white text-lg">{counselor.jurisdiction}</span>
          </div>
          <p className="text-xs text-gray-400">Jurisdiction</p>
        </div>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <p className="text-sm text-gray-300 mb-3 font-medium">Languages:</p>
        <div className="flex flex-wrap gap-2">
          {counselor.languages.map((lang) => (
            <span key={lang} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-2xl text-xs font-medium border border-blue-500/30">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-8">
        <p className="text-sm text-gray-300 mb-3 font-medium flex items-center">
          <Award className="h-4 w-4 mr-2 text-purple-400" />
          Certifications:
        </p>
        <div className="flex flex-wrap gap-2">
          {counselor.badges.map((badge) => (
            <span key={badge} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-2xl text-xs font-medium border border-purple-500/30">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105">
          Book Session
        </button>
        <button className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300">
          View Profile
        </button>
      </div>
    </div>
  )
}