'use client'

import { Header } from '../components/Header'
import { UserProfile } from '../components/UserProfile'
import { Heart, Shield, Users, MessageCircle, Lock, Globe } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              A Safe Space for
              <span className="text-primary-600"> Anonymous Support</span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              Navigate divorce proceedings with privacy, dignity, and community support. 
              Connect anonymously with others who understand your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support-rooms" className="btn-primary text-lg px-8 py-3">
                Join Support Rooms
              </Link>
              <Link href="/counselors" className="btn-outline text-lg px-8 py-3">
                Find Counselors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Privacy-First Support Platform
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Built on blockchain technology to ensure your privacy and provide verified, 
              trustworthy support during difficult times.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              icon={<MessageCircle className="h-8 w-8" />}
              title="Professional Counselors"
              description="Access verified professional counselors and legal advisors who specialize in divorce and family law."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Jurisdiction-Specific"
              description="Get advice relevant to your legal jurisdiction. Connect with others navigating similar legal systems."
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8" />}
              title="Emotional Support"
              description="Find comfort in shared experiences. Participate in support groups for parents, adults, and specific situations."
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8" />}
              title="Global Community"
              description="Access support 24/7 from a global community while maintaining complete privacy and anonymity."
            />
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Your Verification Profile
            </h2>
            <p className="text-lg text-neutral-600">
              Get verified to access support features and build trust within the community.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <UserProfile />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Support?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of people who have found comfort, advice, and community during their divorce journey.
          </p>
          <Link href="/support-rooms" className="bg-white text-primary-600 hover:bg-neutral-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 text-primary-400" />
                <span className="text-xl font-bold">DiviSafe</span>
              </div>
              <p className="text-neutral-400">
                A privacy-first platform for anonymous divorce support and community connection.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/support-rooms" className="hover:text-white transition-colors">Support Rooms</Link></li>
                <li><Link href="/counselors" className="hover:text-white transition-colors">Find Counselors</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Privacy</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/verification" className="hover:text-white transition-colors">Verification</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 DiviSafe. Built with privacy and compassion.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="card text-center">
      <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 mb-3">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  )
}