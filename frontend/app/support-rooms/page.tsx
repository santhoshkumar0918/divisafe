'use client'

import { Header } from '../../components/Header'
import { Users, Lock, Globe, Heart, Baby, Scale, MessageCircle } from 'lucide-react'
import { BadgeType, BADGE_NAMES } from '../../lib/contracts'

const SUPPORT_ROOMS = [
  {
    id: 'general-support',
    name: 'General Support',
    description: 'Open discussion for anyone going through divorce proceedings',
    requiredBadge: BadgeType.HUMAN,
    memberCount: 1247,
    icon: <Heart className="h-6 w-6" />,
    isActive: true,
  },
  {
    id: 'parents-only',
    name: 'Parents Support',
    description: 'Support for parents navigating custody and co-parenting',
    requiredBadge: BadgeType.PARENT,
    memberCount: 892,
    icon: <Baby className="h-6 w-6" />,
    isActive: true,
  },
  {
    id: 'legal-advice-us',
    name: 'US Legal Guidance',
    description: 'Legal advice and resources for US jurisdiction',
    requiredBadge: BadgeType.JURISDICTION_US,
    memberCount: 634,
    icon: <Scale className="h-6 w-6" />,
    isActive: true,
  },
  {
    id: 'legal-advice-eu',
    name: 'EU Legal Guidance',
    description: 'Legal advice and resources for European Union',
    requiredBadge: BadgeType.JURISDICTION_EU,
    memberCount: 423,
    icon: <Scale className="h-6 w-6" />,
    isActive: true,
  },
  {
    id: 'legal-advice-in',
    name: 'India Legal Guidance',
    description: 'Legal advice and resources for Indian jurisdiction',
    requiredBadge: BadgeType.JURISDICTION_IN,
    memberCount: 567,
    icon: <Scale className="h-6 w-6" />,
    isActive: true,
  },
  {
    id: 'adult-only',
    name: 'Adult Discussions',
    description: 'Mature discussions for verified adults (18+)',
    requiredBadge: BadgeType.ADULT,
    memberCount: 1089,
    icon: <Users className="h-6 w-6" />,
    isActive: true,
  },
]

export default function SupportRoomsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Support Rooms</h1>
          <p className="text-lg text-neutral-600 max-w-3xl">
            Join anonymous support rooms based on your verification badges.
            Connect with others who understand your situation while maintaining complete privacy.
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUPPORT_ROOMS.map((room) => (
            <SupportRoomCard key={room.id} room={room} />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-primary-50 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Lock className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Privacy & Security
              </h3>
              <p className="text-neutral-600 mb-4">
                All conversations are anonymous and encrypted. Your identity is protected through
                blockchain verification badges that prove your eligibility without revealing personal information.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                  End-to-end encrypted messaging
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                  Anonymous identity verification
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                  Moderated by verified counselors
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                  No personal data stored
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SupportRoomCard({ room }: { room: typeof SUPPORT_ROOMS[0] }) {
  const badgeName = BADGE_NAMES[room.requiredBadge]

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
          {room.icon}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${room.isActive
          ? 'bg-secondary-100 text-secondary-800'
          : 'bg-neutral-100 text-neutral-600'
          }`}>
          {room.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{room.name}</h3>
      <p className="text-neutral-600 text-sm mb-4">{room.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Required Badge</span>
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
            {badgeName}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Members</span>
          <span className="font-medium text-neutral-900">{room.memberCount.toLocaleString()}</span>
        </div>
      </div>

      <button
        className="btn-primary w-full mt-4 flex items-center justify-center space-x-2"
        disabled={!room.isActive}
      >
        <MessageCircle className="h-4 w-4" />
        <span>{room.isActive ? 'Join Room' : 'Coming Soon'}</span>
      </button>
    </div>
  )
}