'use client'

import { Shield, Star, MessageCircle, Calendar, Globe, Award, ArrowLeft, Menu, X, Heart, Users, Clock } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Data remains the same ---
const COUNSELORS = [
  { id: 1, name: 'Dr. Sarah M.', specialization: 'Family Therapy', jurisdiction: 'US', rating: 4.9, reviews: 127, experience: '12+ years', languages: ['English', 'Spanish'], availability: 'Available', badges: ['Licensed Therapist', 'Divorce Specialist', 'Child Psychology'], description: 'Specialized in helping families navigate divorce with focus on children\'s wellbeing and co-parenting strategies.' },
  { id: 2, name: 'Dr. James K.', specialization: 'Legal Counseling', jurisdiction: 'EU', rating: 4.8, reviews: 89, experience: '15+ years', languages: ['English', 'German', 'French'], availability: 'Busy', badges: ['Family Law', 'Mediation Certified', 'EU Legal Expert'], description: 'Expert in European family law with extensive experience in divorce mediation and legal guidance.' },
  { id: 3, name: 'Dr. Priya S.', specialization: 'Emotional Support', jurisdiction: 'IN', rating: 4.9, reviews: 156, experience: '10+ years', languages: ['English', 'Hindi', 'Tamil'], availability: 'Available', badges: ['Trauma Specialist', 'EMDR Certified', 'Cultural Sensitivity'], description: 'Focuses on emotional healing and trauma recovery during divorce proceedings with cultural sensitivity.' },
  { id: 4, name: 'Dr. Michael R.', specialization: 'Financial Planning', jurisdiction: 'US', rating: 4.7, reviews: 94, experience: '8+ years', languages: ['English'], availability: 'Available', badges: ['Financial Advisor', 'Asset Division', 'Retirement Planning'], description: 'Helps couples navigate financial aspects of divorce including asset division and future planning.' },
]

// Define a type for a single counselor for better TypeScript support
type Counselor = typeof COUNSELORS[0];

export default function CounselorsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // --- NEW: State for filters and modals ---
  const [filters, setFilters] = useState({
    specialization: 'All',
    jurisdiction: 'All',
    language: 'All',
    availability: 'All',
  })
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // --- NEW: Filter logic ---
  const filteredCounselors = COUNSELORS.filter(c => {
    return (
      (filters.specialization === 'All' || c.specialization === filters.specialization) &&
      (filters.jurisdiction === 'All' || c.jurisdiction === filters.jurisdiction) &&
      (filters.language === 'All' || c.languages.includes(filters.language)) &&
      (filters.availability === 'All' || c.availability === filters.availability)
    )
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  // --- NEW: Modal control functions ---
  const openProfileModal = (counselor: Counselor) => {
    setSelectedCounselor(counselor)
    setIsProfileModalOpen(true)
  }
  
  const openBookingModal = (counselor: Counselor) => {
    setSelectedCounselor(counselor)
    setIsBookingModalOpen(true)
  }

  const closeModal = () => {
    setIsProfileModalOpen(false)
    setIsBookingModalOpen(false)
    // Delay clearing counselor to allow modal to animate out
    setTimeout(() => setSelectedCounselor(null), 300)
  }

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => setMousePosition({ x: ev.clientX, y: ev.clientY });
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-black text-gray-200 font-sans relative overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 z-50 transition duration-300" style={{ background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 245, 212, 0.15), transparent 80%)` }}></div>
        <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        
        <div className="relative z-10">
          <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-40">
            <div className="mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white group"><ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" /> <span className="font-medium">Home</span></Link>
                  <div className="h-6 w-px bg-white/20"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center"><Shield className="h-5 w-5 text-white" /></div>
                    <span className="text-xl font-bold text-white">Counselors</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-32 pb-16">
            <motion.div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tighter">Verified <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Professionals</span></h1>
              <p className="text-xl text-gray-400 mx-auto leading-relaxed">Connect with verified professional counselors who specialize in divorce support, legal guidance, and emotional healing.</p>
            </motion.div>

            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12">
              <h3 className="text-lg font-semibold text-white mb-6">Find Your Perfect Match</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FilterDropdown label="Specialization" name="specialization" value={filters.specialization} onChange={handleFilterChange} options={['All', 'Family Therapy', 'Legal Counseling', 'Financial Planning', 'Emotional Support']} />
                <FilterDropdown label="Jurisdiction" name="jurisdiction" value={filters.jurisdiction} onChange={handleFilterChange} options={['All', 'US', 'EU', 'IN']} />
                <FilterDropdown label="Language" name="language" value={filters.language} onChange={handleFilterChange} options={['All', 'English', 'Spanish', 'German', 'French', 'Hindi']} />
                <FilterDropdown label="Availability" name="availability" value={filters.availability} onChange={handleFilterChange} options={['All', 'Available', 'Busy']} />
              </div>
            </div>

            <AnimatePresence>
              <motion.div layout className="grid lg:grid-cols-2 gap-8 mb-8">
                {filteredCounselors.map((counselor) => (
                  <CounselorCard key={counselor.id} counselor={counselor} onProfileClick={openProfileModal} onBookClick={openBookingModal} />
                ))}
              </motion.div>
            </AnimatePresence>
            {filteredCounselors.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-xl">No counselors match your criteria.</p>
                    <p>Try adjusting your filters to find the right professional for you.</p>
                </div>
            )}
          </main>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isProfileModalOpen && selectedCounselor && (
          <ProfileModal counselor={selectedCounselor} onClose={closeModal} onBookClick={() => { closeModal(); openBookingModal(selectedCounselor); }}/>
        )}
        {isBookingModalOpen && selectedCounselor && (
          <BookingModal counselor={selectedCounselor} onClose={closeModal} />
        )}
      </AnimatePresence>
    </>
  )
}


// --- COMPONENTS ---

function FilterDropdown({ label, name, value, onChange, options }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full bg-gray-900/50 border border-white/20 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50">
        {options.map(opt => <option key={opt} value={opt} className="bg-gray-800">{opt}</option>)}
      </select>
    </div>
  )
}

function CounselorCard({ counselor, onProfileClick, onBookClick }: { counselor: Counselor, onProfileClick: (c: Counselor) => void, onBookClick: (c: Counselor) => void }) {
  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-300 hover:border-cyan-400/50 hover:bg-black/20 hover:shadow-[0_0_25px_theme(colors.cyan.500/20%)]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{counselor.name}</h3>
          <p className="text-cyan-400 font-medium">{counselor.specialization}</p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${counselor.availability === 'Available' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
          <div className={`w-2 h-2 rounded-full ${counselor.availability === 'Available' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span>{counselor.availability}</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{counselor.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {counselor.badges.map((badge) => (
          <span key={badge} className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{badge}</span>
        ))}
      </div>

      <div className="flex gap-4">
        <button onClick={() => onBookClick(counselor)} className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-2xl transition-transform transform hover:scale-105">Book Session</button>
        <button onClick={() => onProfileClick(counselor)} className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all">View Profile</button>
      </div>
    </motion.div>
  )
}

function ProfileModal({ counselor, onClose, onBookClick }: { counselor: Counselor, onClose: () => void, onBookClick: () => void }) {
    return (
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-cyan-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl shadow-cyan-500/10"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">{counselor.name}</h2>
              <p className="text-cyan-400 text-lg">{counselor.specialization}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
          </div>

          {/* Body */}
          <p className="text-gray-300 mb-8">{counselor.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
            <InfoChip icon={<Star className="text-yellow-400"/>} label="Rating" value={`${counselor.rating} (${counselor.reviews})`} />
            <InfoChip icon={<Clock className="text-cyan-400"/>} label="Experience" value={counselor.experience} />
            <InfoChip icon={<Globe className="text-cyan-400"/>} label="Jurisdiction" value={counselor.jurisdiction} />
            <InfoChip icon={<MessageCircle className="text-cyan-400"/>} label="Languages" value={counselor.languages.join(', ')} />
          </div>

          <div className="mb-8">
            <h4 className="font-semibold text-white mb-3 flex items-center"><Award className="w-5 h-5 mr-2 text-cyan-400"/> Certifications & Badges</h4>
            <div className="flex flex-wrap gap-2">
              {counselor.badges.map(b => <span key={b} className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">{b}</span>)}
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button onClick={onBookClick} className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-2xl transition-transform transform hover:scale-105">Book Session Now</button>
            <button onClick={onClose} className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl">Close</button>
          </div>
        </motion.div>
      </div>
    )
}

function BookingModal({ counselor, onClose }: { counselor: Counselor, onClose: () => void }) {
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-cyan-500/30 rounded-3xl w-full max-w-lg p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
          <Calendar className="w-8 h-8 text-white"/>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Schedule a Session</h2>
        <p className="text-gray-300 mb-6">You are about to book a session with <span className="font-semibold text-cyan-400">{counselor.name}</span>.</p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl">Cancel</button>
          <button className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-2xl">Proceed to Calendar</button>
        </div>
      </motion.div>
    </div>
  )
}

function InfoChip({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-gray-800/50 p-3 rounded-lg">
      <div className="flex items-center justify-center text-sm font-bold text-white mb-1">{icon}<span className="ml-1">{value}</span></div>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  )
}