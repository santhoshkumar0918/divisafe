'use client'

import { Header } from '@/components/Header'
import { UserProfile } from '@/components/UserProfile'
import { MessageCircle, Users, Shield, Heart, Brain, Lock } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Anonymous
              <span className="text-blue-400"> Divorce Support</span>
            </h1>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Navigate divorce proceedings with privacy, dignity, and AI-powered emotional support. 
              Connect anonymously with others who understand your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/support-rooms" className="btn-primary text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Join Support Rooms
              </Link>
              <Link href="/ai-support" className="btn-secondary text-lg">
                <Brain className="w-5 h-5 mr-2" />
                AI Emotional Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <QuickAccessCard
              icon={<MessageCircle className="room-category-icon" />}
              title="Anonymous Chat Rooms"
              description="Connect with others going through similar experiences in a safe and anonymous environment"
              href="/support-rooms"
            />
            <QuickAccessCard
              icon={<Brain className="room-category-icon" />}
              title="AI Emotional Support"
              description="Get 24/7 emotional support from our advanced AI companion trained for divorce counseling"
              href="/ai-support"
            />
            <QuickAccessCard
              icon={<Shield className="room-category-icon" />}
              title="Professional Counselors"
              description="Connect with verified professional counselors and legal advisors"
              href="/counselors"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Privacy-First Support Platform
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
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
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Your Verification Profile
            </h2>
            <p className="text-xl text-slate-300">
              Get verified to access support features and build trust within the community.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <UserProfile />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">DiviSafe</span>
              </div>
              <p className="text-slate-400">
                A privacy-first platform for anonymous divorce support with AI-powered emotional guidance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/support-rooms" className="hover:text-blue-400 transition-colors">Support Rooms</Link></li>
                <li><Link href="/ai-support" className="hover:text-blue-400 transition-colors">AI Support</Link></li>
                <li><Link href="/counselors" className="hover:text-blue-400 transition-colors">Find Counselors</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Privacy</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/security" className="hover:text-blue-400 transition-colors">Security</Link></li>
                <li><Link href="/verification" className="hover:text-blue-400 transition-colors">Verification</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
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
    <Link href={href} className="room-category-card">
      {icon}
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-300 text-center">{description}</p>
    </Link>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="card text-center">
      <div className="bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  )
}