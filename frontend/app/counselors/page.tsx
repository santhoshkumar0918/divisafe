'use client'

import { Header } from '@/components/Header'
import { Shield, Star, MessageCircle, Calendar, Globe, Award } from 'lucide-react'

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
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Verified Counselors</h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Connect with verified professional counselors who specialize in divorce support, 
            legal guidance, and emotional healing. All sessions are confidential and secure.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-neutral-200">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Specialization</label>
              <select className="input">
                <option>All Specializations</option>
                <option>Family Therapy</option>
                <option>Legal Counseling</option>
                <option>Financial Planning</option>
                <option>Emotional Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Jurisdiction</label>
              <select className="input">
                <option>All Jurisdictions</option>
                <option>United States</option>
                <option>European Union</option>
                <option>India</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Language</label>
              <select className="input">
                <option>All Languages</option>
                <option>English</option>
                <option>Spanish</option>
                <option>German</option>
                <option>French</option>
                <option>Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Availability</label>
              <select className="input">
                <option>All</option>
                <option>Available Now</option>
                <option>Available Today</option>
                <option>Available This Week</option>
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
        <div className="bg-secondary-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">1. Verify Your Identity</h3>
              <p className="text-neutral-600 text-sm">
                Get verified through our secure blockchain system to access counselor services.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">2. Connect Anonymously</h3>
              <p className="text-neutral-600 text-sm">
                Book sessions with counselors while maintaining complete anonymity and privacy.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">3. Schedule Sessions</h3>
              <p className="text-neutral-600 text-sm">
                Book one-time consultations or ongoing therapy sessions based on your needs.
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
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-1">{counselor.name}</h3>
          <p className="text-primary-600 font-medium">{counselor.specialization}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          counselor.availability === 'Available' 
            ? 'bg-secondary-100 text-secondary-800' 
            : 'bg-accent-100 text-accent-800'
        }`}>
          {counselor.availability}
        </div>
      </div>

      <p className="text-neutral-600 text-sm mb-4">{counselor.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Star className="h-4 w-4 text-accent-500 mr-1" />
            <span className="font-semibold text-neutral-900">{counselor.rating}</span>
          </div>
          <p className="text-xs text-neutral-600">{counselor.reviews} reviews</p>
        </div>
        <div className="text-center">
          <div className="font-semibold text-neutral-900 mb-1">{counselor.experience}</div>
          <p className="text-xs text-neutral-600">Experience</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Globe className="h-4 w-4 text-primary-500 mr-1" />
            <span className="font-semibold text-neutral-900">{counselor.jurisdiction}</span>
          </div>
          <p className="text-xs text-neutral-600">Jurisdiction</p>
        </div>
      </div>

      {/* Languages */}
      <div className="mb-4">
        <p className="text-sm text-neutral-600 mb-2">Languages:</p>
        <div className="flex flex-wrap gap-1">
          {counselor.languages.map((lang) => (
            <span key={lang} className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <p className="text-sm text-neutral-600 mb-2 flex items-center">
          <Award className="h-4 w-4 mr-1" />
          Certifications:
        </p>
        <div className="flex flex-wrap gap-1">
          {counselor.badges.map((badge) => (
            <span key={badge} className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="btn-primary flex-1">
          Book Session
        </button>
        <button className="btn-outline">
          View Profile
        </button>
      </div>
    </div>
  )
}