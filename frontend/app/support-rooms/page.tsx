// 'use client'

// import { MessageCircle, Scale, Heart, DollarSign, Home, Bot, ArrowLeft, Users, Shield, Clock, Menu, X } from 'lucide-react'
// import Link from 'next/link'
// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'

// export default function SupportRoomsPage() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
  
//   // --- Re-integrating the "Digital Aurora" core effects ---
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     const updateMousePosition = (ev: MouseEvent) => {
//       setMousePosition({ x: ev.clientX, y: ev.clientY });
//     };
//     window.addEventListener('mousemove', updateMousePosition);
//     return () => {
//       window.removeEventListener('mousemove', updateMousePosition);
//     };
//   }, []);
//   // --- End of core effects ---

//   const categories = [
//     { id: 'general', title: 'General Support', description: 'Open discussions about relationship challenges and life transitions.', icon: MessageCircle, participants: 127, href: '/rooms/general' },
//     { id: 'legal', title: 'Legal Guidance', description: 'Professional advice on legal processes and documentation.', icon: Scale, participants: 89, href: '/rooms/legal' },
//     { id: 'emotional', title: 'Emotional Wellbeing', description: 'Share feelings, coping strategies, and healing journeys.', icon: Heart, participants: 156, href: '/rooms/emotional' },
//     { id: 'financial', title: 'Financial Recovery', description: 'Asset division, budgeting, and financial independence.', icon: DollarSign, participants: 94, href: '/rooms/financial' },
//     { id: 'coparenting', title: 'Co-Parenting', description: 'Collaborative parenting strategies and child-focused solutions.', icon: Home, participants: 73, href: '/rooms/coparenting' },
//     { id: 'ai-support', title: 'AI Companion', description: '24/7 AI emotional support and crisis intervention.', icon: Bot, participants: 'Always Available', href: '/ai-support' }
//   ]

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
//   }

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
//   }

//   return (
//     <div 
//       className="min-h-screen bg-black text-gray-200 font-sans relative overflow-hidden"
//       style={{
//         '--mouse-x': `${mousePosition.x}px`,
//         '--mouse-y': `${mousePosition.y}px`,
//       } as React.CSSProperties}
//     >
//       <div 
//         className="pointer-events-none fixed inset-0 z-30 transition duration-300"
//         style={{ background: `radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(0, 245, 212, 0.15), transparent 80%)` }}
//       ></div>
      
//       <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

//       <div className="relative z-10">
//         {/* HEADER: Updated to match the "Digital Aurora" theme */}
//         <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center h-20">
//               <div className="flex items-center space-x-4">
//                 <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
//                   <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
//                   <span className="font-medium">Home</span>
//                 </Link>
//                 <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
//                 <div className="hidden sm:flex items-center space-x-3">
//                   <div className="w-9 h-9 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
//                     <MessageCircle className="h-5 w-5 text-white" />
//                   </div>
//                   <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//                     Support Rooms
//                   </span>
//                 </div>
//               </div>

//               <nav className="hidden md:flex items-center space-x-10">
//                 <NavLink href="/ai-support">AI Support</NavLink>
//                 <NavLink href="/counselors">Counselors</NavLink>
//               </nav>

//               <div className="flex items-center">
//                 <button
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                   className="md:hidden p-2 text-gray-300 hover:text-white transition-colors z-50"
//                   aria-label="Toggle menu"
//                 >
//                   <AnimatePresence initial={false} mode="wait">
//                     <motion.div key={isMenuOpen ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
//                       {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
//                     </motion.div>
//                   </AnimatePresence>
//                 </button>
//               </div>
//             </div>
//           </div>
//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden">
//                 <nav className="flex flex-col space-y-2 px-4 pt-2 pb-6 border-t border-white/10">
//                   <Link href="/ai-support" className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium">AI Support</Link>
//                   <Link href="/counselors" className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium">Counselors</Link>
//                 </nav>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </header>
      
//         <motion.div 
//           className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16"
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//         >
//           <motion.div className="text-center mb-16" variants={itemVariants}>
//             <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tighter">
//               Find Your
//               <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"> Safe Space</span>
//             </h1>
//             <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
//               Connect with others going through similar experiences in a safe, anonymous, and supportive environment.
//             </p>
//           </motion.div>
          
//           {/* CREATIVE UPGRADE: Stats replaced with "Data Pods" */}
//           <motion.div 
//             className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20"
//             variants={containerVariants}
//           >
//             <StatPod icon={<Users />} value="500+" label="Active Members" />
//             <StatPod icon={<Clock />} value="24/7" label="Support Available" />
//             <StatPod icon={<Shield />} value="100%" label="Guaranteed Anonymity" />
//           </motion.div>

//           <motion.div 
//             className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
//             variants={containerVariants}
//           >
//             {categories.map((category) => (
//               <CategoryCard
//                 key={category.id}
//                 icon={category.icon}
//                 title={category.title}
//                 description={category.description}
//                 participants={category.participants}
//                 href={category.href}
//               />
//             ))}
//           </motion.div>

//           <motion.div className="mt-20" variants={itemVariants}>
//             <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
//               <div className="flex items-center justify-center mb-6">
//                 <Shield className="w-8 h-8 text-cyan-400 mr-3" />
//                 <h3 className="text-2xl font-bold text-white">Your Safety & Privacy is Our Priority</h3>
//               </div>
//               <div className="grid md:grid-cols-3 gap-8 text-gray-400">
//                 <SafetyFeature title="Anonymous by Design" description="Your identity is completely protected. Share without fear or judgment." />
//                 <SafetyFeature title="Professionally Moderated" description="All rooms are monitored by trained professionals to ensure a respectful space." />
//                 <SafetyFeature title="Strictly Confidential" description="What's shared here, stays here. We enforce a strict code of mutual respect." />
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// // Reusable NavLink from Homepage for consistency
// function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
//   return (
//     <Link href={href} className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group">
//       {children}
//       <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
//     </Link>
//   )
// }

// // NEW COMPONENT: StatPod for the hero section
// function StatPod({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
//   return (
//     <motion.div 
//       className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 flex items-center space-x-4"
//       variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
//     >
//       <div className="text-cyan-400">{icon}</div>
//       <div>
//         <div className="text-2xl font-bold text-white">{value}</div>
//         <div className="text-gray-400 text-sm">{label}</div>
//       </div>
//     </motion.div>
//   )
// }

// // NEW COMPONENT: CategoryCard with "Digital Aurora" theme and hover effect
// function CategoryCard({ icon: Icon, title, description, participants, href }: { 
//   icon: React.ElementType, title: string, description: string, participants: string | number, href: string 
// }) {
//   return (
//     <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
//       <Link href={href}>
//         <motion.div 
//           className="group relative h-full p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 transition-all duration-300 hover:border-cyan-400/50 hover:bg-black/20 hover:shadow-[0_0_25px_theme(colors.cyan.500/20%)] overflow-hidden"
//           whileHover={{ y: -8 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           {/* CREATIVE UPGRADE: Scanline glow effect on hover */}
//           <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500 to-cyan-500/0 transition-all duration-500 transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100"></div>
          
//           <div className="flex flex-col text-left">
//             <div className="w-14 h-14 bg-gray-800 border border-white/10 rounded-xl flex items-center justify-center mb-6">
//               <Icon className="w-7 h-7 text-cyan-400" />
//             </div>
            
//             <h3 className="text-xl font-bold text-white mb-3">
//               {title}
//             </h3>
            
//             <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
//               {description}
//             </p>
            
//             <div className="flex items-center space-x-2 text-sm text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full w-fit">
//               <Users className="w-4 h-4" />
//               <span>{participants} {typeof participants === 'number' ? 'members' : ''}</span>
//             </div>
//           </div>
//         </motion.div>
//       </Link>
//     </motion.div>
//   )
// }

// // NEW COMPONENT: SafetyFeature for the footer section
// function SafetyFeature({ title, description }: { title: string, description: string }) {
//   return (
//     <div>
//       <h4 className="font-semibold text-white mb-2">{title}</h4>
//       <p className="text-sm">{description}</p>
//     </div>
//   )
// }
'use client'

import { MessageCircle, Scale, Heart, DollarSign, Home, Bot, ArrowLeft, Users, Shield, Clock, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SupportRoomsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  const categories = [
    { id: 'general', title: 'General Support', description: 'Open discussions about relationship challenges and life transitions.', icon: MessageCircle, participants: 127, href: '/rooms/general' },
    { id: 'legal', title: 'Legal Guidance', description: 'Professional advice on legal processes and documentation.', icon: Scale, participants: 89, href: '/rooms/legal' },
    { id: 'emotional', title: 'Emotional Wellbeing', description: 'Share feelings, coping strategies, and healing journeys.', icon: Heart, participants: 156, href: '/rooms/emotional' },
    { id: 'financial', title: 'Financial Recovery', description: 'Asset division, budgeting, and financial independence.', icon: DollarSign, participants: 94, href: '/rooms/financial' },
    { id: 'coparenting', title: 'Co-Parenting', description: 'Collaborative parenting strategies and child-focused solutions.', icon: Home, participants: 73, href: '/rooms/coparenting' },
    { id: 'ai-support', title: 'AI Companion', description: '24/7 AI emotional support and crisis intervention.', icon: Bot, participants: 'Always Available', href: '/ai-support' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <div 
      className="min-h-screen bg-black text-gray-200 font-sans relative overflow-hidden"
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{ background: `radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(0, 245, 212, 0.15), transparent 80%)` }}
      ></div>
      
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      <div className="relative z-10">
        {/* MODIFIED: Header content now has more padding to match the spread-out layout */}
        <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
                  <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                  <span className="font-medium">Home</span>
                </Link>
                <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-9 h-9 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Support Rooms
                  </span>
                </div>
              </div>

              <nav className="hidden md:flex items-center space-x-10">
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
                  <Link href="/ai-support" className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium">AI Support</Link>
                  <Link href="/counselors" className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium">Counselors</Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      
        {/* MODIFIED: Removed 'max-w-7xl' and adjusted padding for a wider, more expansive layout */}
        <motion.div 
          className="mx-auto px-4 sm:px-6 lg:px-16 xl:px-24 pt-32 pb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* ADDED: Wrapper with max-width to keep hero text readable */}
          <motion.div className="max-w-4xl mx-auto text-center mb-16" variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tighter">
              Find Your
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"> Safe Space</span>
            </h1>
            <p className="text-xl text-gray-400 mx-auto leading-relaxed">
              Connect with others going through similar experiences in a safe, anonymous, and supportive environment.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20 max-w-7xl mx-auto"
            variants={containerVariants}
          >
            <StatPod icon={<Users />} value="500+" label="Active Members" />
            <StatPod icon={<Clock />} value="24/7" label="Support Available" />
            <StatPod icon={<Shield />} value="100%" label="Guaranteed Anonymity" />
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                icon={category.icon}
                title={category.title}
                description={category.description}
                participants={category.participants}
                href={category.href}
              />
            ))}
          </motion.div>

          <motion.div className="mt-20" variants={itemVariants}>
            <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center max-w-7xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-cyan-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Your Safety & Privacy is Our Priority</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-gray-400">
                <SafetyFeature title="Anonymous by Design" description="Your identity is completely protected. Share without fear or judgment." />
                <SafetyFeature title="Professionally Moderated" description="All rooms are monitored by trained professionals to ensure a respectful space." />
                <SafetyFeature title="Strictly Confidential" description="What's shared here, stays here. We enforce a strict code of mutual respect." />
              </div>
            </div>
          </motion.div>
        </motion.div>
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

function StatPod({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <motion.div 
      className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 flex items-center space-x-4"
      variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
    >
      <div className="text-cyan-400">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>
      </div>
    </motion.div>
  )
}

function CategoryCard({ icon: Icon, title, description, participants, href }: { 
  icon: React.ElementType, title: string, description: string, participants: string | number, href: string 
}) {
  return (
    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
      <Link href={href}>
        <motion.div 
          className="group relative h-full p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 transition-all duration-300 hover:border-cyan-400/50 hover:bg-black/20 hover:shadow-[0_0_25px_theme(colors.cyan.500/20%)] overflow-hidden"
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500 to-cyan-500/0 transition-all duration-500 transform -translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100"></div>
          
          <div className="flex flex-col text-left">
            <div className="w-14 h-14 bg-gray-800 border border-white/10 rounded-xl flex items-center justify-center mb-6">
              <Icon className="w-7 h-7 text-cyan-400" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3">
              {title}
            </h3>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
              {description}
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full w-fit">
              <Users className="w-4 h-4" />
              <span>{participants} {typeof participants === 'number' ? 'members' : ''}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

function SafetyFeature({ title, description }: { title: string, description: string }) {
  return (
    <div>
      <h4 className="font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm">{description}</p>
    </div>
  )
}