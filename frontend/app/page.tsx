'use client'

import { UserProfile } from '@/components/UserProfile'
import { MessageCircle, Users, Shield, Heart, Brain, Lock, Menu, X, Camera, Upload, CheckCircle, AlertCircle, Loader2, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

// Animation variants - defined outside component so all components can access them
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter()

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const handleLoginSuccess = (profile: any) => {
    console.log('Login successful:', profile)
    setIsLoginModalOpen(false)
    // Route to support rooms after successful login
    router.push('/support-rooms')
  }

  const handleLoginError = (error: string) => {
    console.error('Login error:', error)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  }

  return (
    <div
      className="min-h-screen bg-black text-gray-200 font-sans relative overflow-hidden"
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      {/* Interactive Cursor Light (Now Cyan) */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{
          background: `radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(0, 245, 212, 0.15), transparent 80%)`
        }}
      ></div>

      {/* NEW: Animated Grid Background */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      <div className="relative z-10">
        <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                  DiviSafe
                </span>
              </Link>

              <nav className="hidden md:flex items-center space-x-10">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/support-rooms">Support Rooms</NavLink>
                <NavLink href="/ai-support">AI Support</NavLink>
                <NavLink href="/counselors">Counselors</NavLink>
              </nav>

              <div className="flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-gray-300 hover:text-white transition-colors z-50"
                  aria-label="Toggle menu"
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div key={isMenuOpen ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden">
                <nav className="flex flex-col space-y-2 px-4 pt-2 pb-6 border-t border-white/10">
                  <Link href="/" className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium">Home</Link>
                  <Link href="/support-rooms" className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium">Support Rooms</Link>
                  <Link href="/ai-support" className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium">AI Support</Link>
                  <Link href="/counselors" className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium">Counselors</Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <motion.section className="pt-40 pb-28 text-center" initial="hidden" animate="visible" variants={containerVariants}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tighter" variants={itemVariants}>
              Anonymous Support,
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                A Clear Path Forward.
              </span>
            </motion.h1>
            <motion.p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed" variants={itemVariants}>
              DiviSafe is a private sanctuary to navigate divorce. Connect with peers and AI-powered support, all while protecting your identity.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-6 justify-center" variants={itemVariants}>
              <Link href="/support-rooms" className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl transition-all duration-300 overflow-hidden shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105">
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white/20 rounded-full group-hover:w-56 group-hover:h-56"></span>
                <span className="relative flex items-center"><MessageCircle className="w-5 h-5 mr-3" />Join Support Rooms</span>
              </Link>
              <Link href="/ai-support" className="group relative inline-flex items-center justify-center px-8 py-4 bg-black border border-white/20 hover:border-cyan-500/50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
                <span className="relative flex items-center"><Brain className="w-5 h-5 mr-3" />Talk to AI Companion</span>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <QuickAccessCard icon={<MessageCircle className="w-12 h-12 text-cyan-400 mb-6" />} title="Anonymous Chat Rooms" description="Connect with others going through similar experiences in a safe, judgment-free environment." href="/support-rooms" />
              <QuickAccessCard icon={<Brain className="w-12 h-12 text-cyan-400 mb-6" />} title="AI Emotional Support" description="Get 24/7 emotional support from our advanced AI companion, trained for divorce counseling." href="/ai-support" />
              <QuickAccessCard icon={<Shield className="w-12 h-12 text-cyan-400 mb-6" />} title="Professional Counselors" description="Connect with verified professional counselors and legal advisors for expert guidance." href="/counselors" />
            </div>
          </div>
        </motion.section>

        <motion.section className="py-24" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">A Privacy-First Support Platform</h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">Built on modern technology with AI-powered emotional support to ensure your privacy and provide trustworthy guidance.</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={<Lock />} title="Anonymous & Secure" description="Your identity is protected. Share your experiences without revealing personal information." />
              <FeatureCard icon={<Users />} title="Verified Community" description="Connect with verified members who have gone through similar experiences. Age and jurisdiction verification." />
              <FeatureCard icon={<Brain />} title="AI Emotional Support" description="Our advanced AI companion provides 24/7 emotional support and personalized coping strategies." />
              <FeatureCard icon={<Shield />} title="Crisis Detection" description="AI monitors conversations for crisis indicators and can escalate to human professionals when needed." />
              <FeatureCard icon={<Heart />} title="Cultural Sensitivity" description="Our AI is trained on diverse cultural contexts, including Indian family dynamics and religious considerations." />
              <FeatureCard icon={<MessageCircle />} title="Specialized Rooms" description="Access rooms based on your specific needs: age groups, professional sectors, cultural backgrounds, and more." />
            </div>
          </div>
        </motion.section>



        <footer className="bg-black/50 border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12">
              <div className="md:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">DiviSafe</span>
                </div>
                <p className="text-gray-500 text-sm">A privacy-first platform for anonymous divorce support with AI-powered emotional guidance.</p>
              </div>
              <FooterLinks title="Support" links={{ "/support-rooms": "Support Rooms", "/ai-support": "AI Support", "/counselors": "Find Counselors" }} />
              <FooterLinks title="Privacy" links={{ "/privacy": "Privacy Policy", "/security": "Security", "/verification": "Verification" }} />
              <FooterLinks title="Legal" links={{ "/terms": "Terms of Service", "/disclaimer": "Disclaimer", "/contact": "Contact" }} />
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
              <p>&copy; 2025 DiviSafe. Built with privacy, compassion, and AI-powered support.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group">
      {children}
      <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )
}

// NEW CARD: "Neon Glow on Hover" effect.
function QuickAccessCard({ icon, title, description, href }: {
  icon: React.ReactNode, title: string, description: string, href: string
}) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={href}>
        <motion.div
          className="group h-full p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 transition-all duration-300 hover:border-cyan-400/50 hover:bg-black/20 hover:shadow-[0_0_20px_theme(colors.cyan.500/20%)]"
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex flex-col items-center text-center">
            {icon}
            <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed flex-grow">{description}</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode, title: string, description: string
}) {
  return (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 text-center h-full border border-white/10"
      variants={itemVariants}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  )
}

function FooterLinks({ title, links }: { title: string, links: Record<string, string> }) {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-white tracking-wide">{title}</h3>
      <ul className="space-y-3 text-gray-400">
        {Object.entries(links).map(([href, text]) => (
          <li key={href}>
            <Link href={href} className="hover:text-cyan-400 transition-colors duration-200 hover:pl-1">
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}