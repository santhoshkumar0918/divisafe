'use client'

import { Header } from '@/components/Header'
import { MessageCircle, Scale, Heart, DollarSign, Home, Bot } from 'lucide-react'
import Link from 'next/link'

export default function SupportRoomsPage() {
  const categories = [
    {
      id: 'general',
      title: 'General Support',
      description: 'For all divorce-related discussions',
      icon: MessageCircle,
      color: 'bg-blue-600',
      href: '/rooms/general'
    },
    {
      id: 'legal',
      title: 'Legal Advice',
      description: 'Ask questions about legal processes',
      icon: Scale,
      color: 'bg-purple-600',
      href: '/rooms/legal'
    },
    {
      id: 'emotional',
      title: 'Emotional Wellbeing',
      description: 'Share your feelings and coping strategies',
      icon: Heart,
      color: 'bg-pink-600',
      href: '/rooms/emotional'
    },
    {
      id: 'financial',
      title: 'Financial Matters',
      description: 'Discuss financial planning and asset division',
      icon: DollarSign,
      color: 'bg-green-600',
      href: '/rooms/financial'
    },
    {
      id: 'coparenting',
      title: 'Co-Parenting',
      description: 'Tips and advice for co-parenting',
      icon: Home,
      color: 'bg-orange-600',
      href: '/rooms/coparenting'
    },
    {
      id: 'ai-support',
      title: 'AI Emotional Support',
      description: '24/7 AI companion for immediate support',
      icon: Bot,
      color: 'bg-cyan-600',
      href: '/ai-support'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Anonymous Chat Rooms</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Connect with others going through similar experiences in a safe and anonymous environment
          </p>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors group cursor-pointer border border-slate-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${category.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">{category.title}</h3>
                      <p className="text-slate-300 text-sm">{category.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Remember, all conversations are anonymous and confidential. Please respect the privacy of others.
          </p>
        </div>
      </div>
    </div>
  )
}