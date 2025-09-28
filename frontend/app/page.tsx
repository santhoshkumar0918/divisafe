// "use client";

// import { UserProfile } from "@/components/UserProfile";
// import {
//   MessageCircle,
//   Users,
//   Shield,
//   Heart,
//   Brain,
//   Lock,
//   Menu,
//   X,
//   Camera,
//   Upload,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   LogIn,
// } from "lucide-react";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";

// // Animation variants - defined outside component so all components can access them
// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
// };

// export default function HomePage() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const router = useRouter();

//   useEffect(() => {
//     const updateMousePosition = (ev: MouseEvent) => {
//       setMousePosition({ x: ev.clientX, y: ev.clientY });
//     };
//     window.addEventListener("mousemove", updateMousePosition);
//     return () => {
//       window.removeEventListener("mousemove", updateMousePosition);
//     };
//   }, []);

//   const handleLoginSuccess = (profile: any) => {
//     console.log("Login successful:", profile);
//     setIsLoginModalOpen(false);
//     // Route to support rooms after successful login
//     router.push("/support-rooms");
//   };

//   const handleLoginError = (error: string) => {
//     console.error("Login error:", error);
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
//   };

//   return (
//     <div
//       className="min-h-screen bg-black text-gray-200 font-sans relative overflow-hidden"
//       style={
//         {
//           "--mouse-x": `${mousePosition.x}px`,
//           "--mouse-y": `${mousePosition.y}px`,
//         } as React.CSSProperties
//       }
//     >
//       {/* Interactive Cursor Light (Now Cyan) */}
//       <div
//         className="pointer-events-none fixed inset-0 z-30 transition duration-300"
//         style={{
//           background: `radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(0, 245, 212, 0.15), transparent 80%)`,
//         }}
//       ></div>

//       {/* NEW: Animated Grid Background */}
//       <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

//       <div className="relative z-10">
//         <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex justify-between items-center h-20">
//               <Link href="/" className="flex items-center space-x-3 group">
//                 <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
//                   <Heart className="h-6 w-6 text-white" />
//                 </div>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
//                   DiviSafe
//                 </span>
//               </Link>

//               <nav className="hidden md:flex items-center space-x-10">
//                 <NavLink href="/">Home</NavLink>
//                 <NavLink href="/support-rooms">Support Rooms</NavLink>
//                 <NavLink href="/ai-support">AI Support</NavLink>
//                 <NavLink href="/counselors">Counselors</NavLink>
//               </nav>

//               <div className="flex items-center space-x-4">
//                 {/* Login Button */}
//                 <button
//                   onClick={() => setIsLoginModalOpen(true)}
//                   className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
//                 >
//                   <LogIn className="w-4 h-4" />
//                   <span>Login</span>
//                 </button>

//                 <button
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                   className="md:hidden p-2 text-gray-300 hover:text-white transition-colors z-50"
//                   aria-label="Toggle menu"
//                 >
//                   <AnimatePresence initial={false} mode="wait">
//                     <motion.div
//                       key={isMenuOpen ? "x" : "menu"}
//                       initial={{ rotate: -90, opacity: 0 }}
//                       animate={{ rotate: 0, opacity: 1 }}
//                       exit={{ rotate: 90, opacity: 0 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       {isMenuOpen ? (
//                         <X className="h-7 w-7" />
//                       ) : (
//                         <Menu className="h-7 w-7" />
//                       )}
//                     </motion.div>
//                   </AnimatePresence>
//                 </button>
//               </div>
//             </div>
//           </div>

//           <AnimatePresence>
//             {isMenuOpen && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="md:hidden overflow-hidden"
//               >
//                 <nav className="flex flex-col space-y-2 px-4 pt-2 pb-6 border-t border-white/10">
//                   <Link
//                     href="/"
//                     className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium"
//                   >
//                     Home
//                   </Link>
//                   <Link
//                     href="/support-rooms"
//                     className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium"
//                   >
//                     Support Rooms
//                   </Link>
//                   <Link
//                     href="/ai-support"
//                     className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium"
//                   >
//                     AI Support
//                   </Link>
//                   <Link
//                     href="/counselors"
//                     className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium"
//                   >
//                     Counselors
//                   </Link>
//                   <button
//                     onClick={() => setIsLoginModalOpen(true)}
//                     className="flex items-center space-x-2 text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium w-full text-left"
//                   >
//                     <LogIn className="w-4 h-4" />
//                     <span>Login</span>
//                   </button>
//                 </nav>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </header>

//         <motion.section
//           className="pt-40 pb-28 text-center"
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <motion.h1
//               className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tighter"
//               variants={itemVariants}
//             >
//               Anonymous Support,
//               <br />
//               <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
//                 A Clear Path Forward.
//               </span>
//             </motion.h1>
//             <motion.p
//               className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
//               variants={itemVariants}
//             >
//               DiviSafe is a private sanctuary to navigate divorce. Connect with
//               peers and AI-powered support, all while protecting your identity.
//             </motion.p>
//             <motion.div
//               className="flex flex-col sm:flex-row gap-6 justify-center"
//               variants={itemVariants}
//             >
//               <Link
//                 href="/support-rooms"
//                 className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl transition-all duration-300 overflow-hidden shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
//               >
//                 <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white/20 rounded-full group-hover:w-56 group-hover:h-56"></span>
//                 <span className="relative flex items-center">
//                   <MessageCircle className="w-5 h-5 mr-3" />
//                   Join Support Rooms
//                 </span>
//               </Link>
//               <Link
//                 href="/ai-support"
//                 className="group relative inline-flex items-center justify-center px-8 py-4 bg-black border border-white/20 hover:border-cyan-500/50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
//               >
//                 <span className="relative flex items-center">
//                   <Brain className="w-5 h-5 mr-3" />
//                   Talk to AI Companion
//                 </span>
//               </Link>
//             </motion.div>
//           </div>
//         </motion.section>

//         <motion.section
//           className="py-24"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//           variants={containerVariants}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid md:grid-cols-3 gap-8">
//               <QuickAccessCard
//                 icon={
//                   <MessageCircle className="w-12 h-12 text-cyan-400 mb-6" />
//                 }
//                 title="Anonymous Chat Rooms"
//                 description="Connect with others going through similar experiences in a safe, judgment-free environment."
//                 href="/support-rooms"
//               />
//               <QuickAccessCard
//                 icon={<Brain className="w-12 h-12 text-cyan-400 mb-6" />}
//                 title="AI Emotional Support"
//                 description="Get 24/7 emotional support from our advanced AI companion, trained for divorce counseling."
//                 href="/ai-support"
//               />
//               <QuickAccessCard
//                 icon={<Shield className="w-12 h-12 text-cyan-400 mb-6" />}
//                 title="Professional Counselors"
//                 description="Connect with verified professional counselors and legal advisors for expert guidance."
//                 href="/counselors"
//               />
//             </div>
//           </div>
//         </motion.section>

//         <motion.section
//           className="py-24"
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.2 }}
//           variants={containerVariants}
//         >
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <motion.div className="text-center mb-16" variants={itemVariants}>
//               <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
//                 A Privacy-First Support Platform
//               </h2>
//               <p className="text-xl text-gray-400 max-w-3xl mx-auto">
//                 Built on modern technology with AI-powered emotional support to
//                 ensure your privacy and provide trustworthy guidance.
//               </p>
//             </motion.div>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//               <FeatureCard
//                 icon={<Lock />}
//                 title="Anonymous & Secure"
//                 description="Your identity is protected. Share your experiences without revealing personal information."
//               />
//               <FeatureCard
//                 icon={<Users />}
//                 title="Verified Community"
//                 description="Connect with verified members who have gone through similar experiences. Age and jurisdiction verification."
//               />
//               <FeatureCard
//                 icon={<Brain />}
//                 title="AI Emotional Support"
//                 description="Our advanced AI companion provides 24/7 emotional support and personalized coping strategies."
//               />
//               <FeatureCard
//                 icon={<Shield />}
//                 title="Crisis Detection"
//                 description="AI monitors conversations for crisis indicators and can escalate to human professionals when needed."
//               />
//               <FeatureCard
//                 icon={<Heart />}
//                 title="Cultural Sensitivity"
//                 description="Our AI is trained on diverse cultural contexts, including Indian family dynamics and religious considerations."
//               />
//               <FeatureCard
//                 icon={<MessageCircle />}
//                 title="Specialized Rooms"
//                 description="Access rooms based on your specific needs: age groups, professional sectors, cultural backgrounds, and more."
//               />
//             </div>
//           </div>
//         </motion.section>

//         <footer className="bg-black/50 border-t border-white/10 py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid md:grid-cols-4 gap-12">
//               <div className="md:col-span-1">
//                 <div className="flex items-center space-x-3 mb-4">
//                   <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
//                     <Heart className="h-5 w-5 text-white" />
//                   </div>
//                   <span className="text-xl font-bold text-white">DiviSafe</span>
//                 </div>
//                 <p className="text-gray-500 text-sm">
//                   A privacy-first platform for anonymous divorce support with
//                   AI-powered emotional guidance.
//                 </p>
//               </div>
//               <FooterLinks
//                 title="Support"
//                 links={{
//                   "/support-rooms": "Support Rooms",
//                   "/ai-support": "AI Support",
//                   "/counselors": "Find Counselors",
//                 }}
//               />
//               <FooterLinks
//                 title="Privacy"
//                 links={{
//                   "/privacy": "Privacy Policy",
//                   "/security": "Security",
//                   "/verification": "Verification",
//                 }}
//               />
//               <FooterLinks
//                 title="Legal"
//                 links={{
//                   "/terms": "Terms of Service",
//                   "/disclaimer": "Disclaimer",
//                   "/contact": "Contact",
//                 }}
//               />
//             </div>
//             <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
//               <p>
//                 &copy; 2025 DiviSafe. Built with privacy, compassion, and
//                 AI-powered support.
//               </p>
//             </div>
//           </div>
//         </footer>
//       </div>

//       {/* Login Modal */}
//       <AnimatePresence>
//         {isLoginModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => setIsLoginModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.95, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.95, opacity: 0 }}
//               className="bg-gray-900 rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-white">
//                     Secure Login
//                   </h2>
//                   <button
//                     onClick={() => setIsLoginModalOpen(false)}
//                     className="p-2 text-gray-400 hover:text-white transition-colors"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>
//                 <MockQRCodePassportLogin
//                   onSuccess={handleLoginSuccess}
//                   onError={handleLoginError}
//                 />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// function NavLink({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
//     >
//       {children}
//       <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
//     </Link>
//   );
// }

// // NEW CARD: "Neon Glow on Hover" effect.
// function QuickAccessCard({
//   icon,
//   title,
//   description,
//   href,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
//   href: string;
// }) {
//   return (
//     <motion.div variants={itemVariants}>
//       <Link href={href}>
//         <motion.div
//           className="group h-full p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 transition-all duration-300 hover:border-cyan-400/50 hover:bg-black/20 hover:shadow-[0_0_20px_theme(colors.cyan.500/20%)]"
//           whileHover={{ y: -8 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         >
//           <div className="flex flex-col items-center text-center">
//             {icon}
//             <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
//             <p className="text-gray-400 leading-relaxed flex-grow">
//               {description}
//             </p>
//           </div>
//         </motion.div>
//       </Link>
//     </motion.div>
//   );
// }

// function FeatureCard({
//   icon,
//   title,
//   description,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }) {
//   return (
//     <motion.div
//       className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 text-center h-full border border-white/10"
//       variants={itemVariants}
//     >
//       <div className="w-16 h-16 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400">
//         {icon}
//       </div>
//       <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
//       <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
//     </motion.div>
//   );
// }

// function FooterLinks({
//   title,
//   links,
// }: {
//   title: string;
//   links: Record<string, string>;
// }) {
//   return (
//     <div>
//       <h3 className="font-semibold mb-4 text-white tracking-wide">{title}</h3>
//       <ul className="space-y-3 text-gray-400">
//         {Object.entries(links).map(([href, text]) => (
//           <li key={href}>
//             <Link
//               href={href}
//               className="hover:text-cyan-400 transition-colors duration-200 hover:pl-1"
//             >
//               {text}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// interface MockQRCodePassportLoginProps {
//   onSuccess: (profile: any) => void;
//   onError: (error: string) => void;
// }

// function MockQRCodePassportLogin({
//   onSuccess,
//   onError,
// }: MockQRCodePassportLoginProps) {
//   const [selectedMethod, setSelectedMethod] = useState<"qr" | "manual" | null>(
//     null
//   );
//   const [verificationStatus, setVerificationStatus] = useState<
//     "idle" | "processing" | "success" | "error"
//   >("idle");
//   const [progress, setProgress] = useState(0);
//   const [currentStep, setCurrentStep] = useState("");
//   const [anonymousId, setAnonymousId] = useState("");
//   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//   const [isDragOver, setIsDragOver] = useState(false);

//   // Simulate verification steps
//   const verificationSteps = [
//     "Initializing verification process...",
//     "Scanning document security features...",
//     "Extracting personal information...",
//     "Validating document authenticity...",
//     "Cross-referencing with global databases...",
//     "Generating anonymous identity...",
//     "Minting verification badge...",
//     "Finalizing secure login...",
//   ];

//   const generateAnonymousId = () => {
//     const prefix = "anon_";
//     const random = Math.random().toString(36).substring(2, 15);
//     const timestamp = Date.now().toString(36);
//     return prefix + random + "_" + timestamp;
//   };

//   const simulateVerification = async () => {
//     setVerificationStatus("processing");
//     setProgress(0);
//     setCurrentStep(verificationSteps[0]);

//     for (let i = 0; i < verificationSteps.length; i++) {
//       await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 seconds per step
//       setProgress(((i + 1) / verificationSteps.length) * 100);
//       setCurrentStep(verificationSteps[i + 1] || "Complete!");
//     }

//     // Generate anonymous ID and success
//     const newAnonymousId = generateAnonymousId();
//     setAnonymousId(newAnonymousId);

//     setTimeout(() => {
//       setVerificationStatus("success");
//       const profile = {
//         anonymousId: newAnonymousId,
//         verifiedAt: new Date().toISOString(),
//         verificationMethod:
//           selectedMethod === "qr" ? "QR Code" : "Manual Upload",
//         trustScore: Math.floor(Math.random() * 20) + 80, // 80-99%
//         badges: ["Verified Human", "Anonymous Member"],
//       };
//       onSuccess(profile);
//     }, 1000);
//   };

//   const handleMethodSelect = (method: "qr" | "manual") => {
//     setSelectedMethod(method);
//     setVerificationStatus("idle");
//     setProgress(0);
//   };

//   const handleStartVerification = () => {
//     if (selectedMethod) {
//       simulateVerification();
//     }
//   };

//   const resetProcess = () => {
//     setSelectedMethod(null);
//     setVerificationStatus("idle");
//     setProgress(0);
//     setCurrentStep("");
//     setAnonymousId("");
//   };

//   if (verificationStatus === "success") {
//     return (
//       <div className="max-w-md mx-auto p-8 bg-green-900/20 border border-green-500/30 rounded-xl text-center">
//         <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
//           <CheckCircle className="w-8 h-8 text-green-400" />
//         </div>
//         <h3 className="text-2xl font-bold text-green-400 mb-2">
//           Verification Successful!
//         </h3>
//         <p className="text-green-300 mb-4">
//           Welcome! You've been assigned anonymous identity:
//         </p>
//         <div className="bg-green-500/10 p-3 rounded-lg mb-4">
//           <code className="text-green-400 font-mono text-sm">
//             {anonymousId}
//           </code>
//         </div>
//         <p className="text-green-300 text-sm">
//           Your privacy is protected. No personal information was stored.
//         </p>
//         <button
//           onClick={resetProcess}
//           className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//         >
//           Start New Session
//         </button>
//       </div>
//     );
//   }

//   if (verificationStatus === "error") {
//     return (
//       <div className="max-w-md mx-auto p-8 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
//         <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
//           <AlertCircle className="w-8 h-8 text-red-400" />
//         </div>
//         <h3 className="text-2xl font-bold text-red-400 mb-2">
//           Verification Failed
//         </h3>
//         <p className="text-red-300 mb-4">
//           We couldn't verify your identity. Please try again.
//         </p>
//         <button
//           onClick={resetProcess}
//           className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Method Selection */}
//       {!selectedMethod && (
//         <div className="bg-gray-800/50 rounded-xl p-8 border border-white/10">
//           <h3 className="text-2xl font-bold text-white mb-6 text-center">
//             Choose Verification Method
//           </h3>
//           <div className="grid md:grid-cols-2 gap-6">
//             {/* QR Code Option */}
//             <button
//               onClick={() => handleMethodSelect("qr")}
//               className="bg-gray-700/50 hover:bg-gray-600/50 transition-colors p-6 rounded-lg border border-white/10 group"
//             >
//               <div className="text-center">
//                 <div className="w-12 h-12 mx-auto bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                   <Camera className="w-6 h-6 text-white" />
//                 </div>
//                 <h4 className="font-semibold text-white mb-2">QR Code Scan</h4>
//                 <p className="text-gray-300 text-sm">
//                   Scan QR code with your mobile device for quick verification
//                 </p>
//               </div>
//             </button>

//             {/* Manual Upload Option */}
//             <button
//               onClick={() => handleMethodSelect("manual")}
//               className="bg-gray-700/50 hover:bg-gray-600/50 transition-colors p-6 rounded-lg border border-white/10 group"
//             >
//               <div className="text-center">
//                 <div className="w-12 h-12 mx-auto bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//                   <Upload className="w-6 h-6 text-white" />
//                 </div>
//                 <h4 className="font-semibold text-white mb-2">Manual Upload</h4>
//                 <p className="text-gray-300 text-sm">
//                   Upload your passport or ID document for verification
//                 </p>
//               </div>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Processing State */}
//       {selectedMethod && verificationStatus === "processing" && (
//         <div className="bg-gray-800/50 rounded-xl p-8 border border-white/10">
//           <div className="text-center mb-6">
//             <div className="w-16 h-16 mx-auto bg-blue-600 rounded-full flex items-center justify-center mb-4">
//               <Loader2 className="w-8 h-8 text-white animate-spin" />
//             </div>
//             <h3 className="text-2xl font-bold text-white mb-2">
//               {selectedMethod === "qr"
//                 ? "Scanning QR Code..."
//                 : "Processing Document..."}
//             </h3>
//             <p className="text-gray-300">
//               Please wait while we verify your identity
//             </p>
//           </div>

//           {/* Progress Bar */}
//           <div className="mb-6">
//             <div className="flex justify-between text-sm text-gray-400 mb-2">
//               <span>Progress</span>
//               <span>{Math.round(progress)}%</span>
//             </div>
//             <div className="w-full bg-gray-700 rounded-full h-3">
//               <div
//                 className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-300 ease-out"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>

//           {/* Current Step */}
//           <div className="bg-gray-700/50 rounded-lg p-4">
//             <p className="text-gray-300 text-center">{currentStep}</p>
//           </div>

//           {/* Estimated Time */}
//           <div className="mt-4 text-center">
//             <p className="text-gray-400 text-sm">
//               Estimated time remaining:{" "}
//               {Math.max(0, Math.ceil(((100 - progress) / 100) * 12))} seconds
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Start Verification Button */}
//       {selectedMethod && verificationStatus === "idle" && (
//         <div className="bg-gray-800/50 rounded-xl p-8 border border-white/10 text-center">
//           <div className="mb-6">
//             <div className="w-16 h-16 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
//               {selectedMethod === "qr" ? (
//                 <Camera className="w-8 h-8 text-white" />
//               ) : (
//                 <Upload className="w-8 h-8 text-white" />
//               )}
//             </div>
//             <h3 className="text-xl font-bold text-white mb-2">
//               Ready to{" "}
//               {selectedMethod === "qr" ? "Scan QR Code" : "Upload Document"}
//             </h3>
//             <p className="text-gray-300">
//               {selectedMethod === "qr"
//                 ? "Point your camera at the QR code to begin verification"
//                 : "Select and upload your passport or ID document"}
//             </p>
//           </div>
//           <button
//             onClick={handleStartVerification}
//             className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
//           >
//             Start Verification Process
//           </button>
//           <button
//             onClick={() => setSelectedMethod(null)}
//             className="mt-4 text-gray-400 hover:text-white transition-colors"
//           >
//             ← Back to Method Selection
//           </button>
//         </div>
//       )}

//       {/* Initial State Instructions */}
//       {!selectedMethod && (
//         <div className="mt-6 text-center">
//           <p className="text-gray-400 text-sm">
//             🔒 Your privacy is protected. No personal information is stored.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Users,
  Shield,
  Heart,
  Brain,
  Lock,
  Menu,
  X,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  LogIn,
  FileText,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Placeholder for useRouter to avoid compilation errors in this environment
const useRouter = () => {
  return {
    push: (path: string) => {
      console.log(`Navigating to ${path}`);
      // In a real Next.js app, this would change the URL.
      // For this environment, we can simulate by changing the window location if needed.
      window.location.href = path;
    },
  };
};

// Animation variants - defined outside component so all components can access them
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const handleLoginSuccess = (profile: any) => {
    console.log("Login successful:", profile);
    setIsLoginModalOpen(false);
    // Route to support rooms after successful login
    router.push("/support-rooms");
  };

  const handleLoginError = (error: string) => {
    console.error("Login error:", error);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div
      className="min-h-screen bg-black text-gray-200 font-sans relative overflow-hidden"
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300"
        style={{
          background: `radial-gradient(600px at var(--mouse-x) var(--mouse-y), rgba(0, 245, 212, 0.15), transparent 80%)`,
        }}
      ></div>

      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      <div className="relative z-10">
        <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <a href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                  DiviSafe
                </span>
              </a>

              <nav className="hidden md:flex items-center space-x-10">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/support-rooms">Support Rooms</NavLink>
                <NavLink href="/ai-support">AI Support</NavLink>
                <NavLink href="/counselors">Counselors</NavLink>
              </nav>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-gray-300 hover:text-white transition-colors z-50"
                  aria-label="Toggle menu"
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={isMenuOpen ? "x" : "menu"}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isMenuOpen ? (
                        <X className="h-7 w-7" />
                      ) : (
                        <Menu className="h-7 w-7" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <nav className="flex flex-col space-y-2 px-4 pt-2 pb-6 border-t border-white/10">
                  <a
                    href="/"
                    className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium"
                  >
                    Home
                  </a>
                  <a
                    href="/support-rooms"
                    className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium"
                  >
                    Support Rooms
                  </a>
                  <a
                    href="/ai-support"
                    className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium"
                  >
                    AI Support
                  </a>
                  <a
                    href="/counselors"
                    className="text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium"
                  >
                    Counselors
                  </a>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="flex items-center space-x-2 text-gray-300 hover:bg-white/10 rounded-lg px-4 py-3 transition-colors duration-200 font-medium w-full text-left"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <motion.section
          className="pt-40 pb-28 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tighter"
              variants={itemVariants}
            >
              Anonymous Support,
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                A Clear Path Forward.
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              DiviSafe is a private sanctuary to navigate divorce. Connect with
              peers and AI-powered support, all while protecting your identity.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              variants={itemVariants}
            >
              <a
                href="/support-rooms"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-2xl transition-all duration-300 overflow-hidden shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white/20 rounded-full group-hover:w-56 group-hover:h-56"></span>
                <span className="relative flex items-center">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Join Support Rooms
                </span>
              </a>
              <a
                href="/ai-support"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-black border border-white/20 hover:border-cyan-500/50 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 hover:scale-105"
              >
                <span className="relative flex items-center">
                  <Brain className="w-5 h-5 mr-3" />
                  Talk to AI Companion
                </span>
              </a>
            </motion.div>
          </div>
        </motion.section>

        {/* --- RESTORED SECTIONS --- */}
        <motion.section
          className="py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <QuickAccessCard
                icon={
                  <MessageCircle className="w-12 h-12 text-cyan-400 mb-6" />
                }
                title="Anonymous Chat Rooms"
                description="Connect with others going through similar experiences in a safe, judgment-free environment."
                href="/support-rooms"
              />
              <QuickAccessCard
                icon={<Brain className="w-12 h-12 text-cyan-400 mb-6" />}
                title="AI Emotional Support"
                description="Get 24/7 emotional support from our advanced AI companion, trained for divorce counseling."
                href="/ai-support"
              />
              <QuickAccessCard
                icon={<Shield className="w-12 h-12 text-cyan-400 mb-6" />}
                title="Professional Counselors"
                description="Connect with verified professional counselors and legal advisors for expert guidance."
                href="/counselors"
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className="py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                A Privacy-First Support Platform
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Built on modern technology with AI-powered emotional support to
                ensure your privacy and provide trustworthy guidance.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Lock />}
                title="Anonymous & Secure"
                description="Your identity is protected. Share your experiences without revealing personal information."
              />
              <FeatureCard
                icon={<Users />}
                title="Verified Community"
                description="Connect with verified members who have gone through similar experiences. Age and jurisdiction verification."
              />
              <FeatureCard
                icon={<Brain />}
                title="AI Emotional Support"
                description="Our advanced AI companion provides 24/7 emotional support and personalized coping strategies."
              />
              <FeatureCard
                icon={<Shield />}
                title="Crisis Detection"
                description="AI monitors conversations for crisis indicators and can escalate to human professionals when needed."
              />
              <FeatureCard
                icon={<Heart />}
                title="Cultural Sensitivity"
                description="Our AI is trained on diverse cultural contexts, including Indian family dynamics and religious considerations."
              />
              <FeatureCard
                icon={<MessageCircle />}
                title="Specialized Rooms"
                description="Access rooms based on your specific needs: age groups, professional sectors, cultural backgrounds, and more."
              />
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
                <p className="text-gray-500 text-sm">
                  A privacy-first platform for anonymous divorce support with
                  AI-powered emotional guidance.
                </p>
              </div>
              <FooterLinks
                title="Support"
                links={{
                  "/support-rooms": "Support Rooms",
                  "/ai-support": "AI Support",
                  "/counselors": "Find Counselors",
                }}
              />
              <FooterLinks
                title="Privacy"
                links={{
                  "/privacy": "Privacy Policy",
                  "/security": "Security",
                  "/verification": "Verification",
                }}
              />
              <FooterLinks
                title="Legal"
                links={{
                  "/terms": "Terms of Service",
                  "/disclaimer": "Disclaimer",
                  "/contact": "Contact",
                }}
              />
            </div>
            <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">
              <p>
                &copy; 2025 DiviSafe. Built with privacy, compassion, and
                AI-powered support.
              </p>
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {isLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setIsLoginModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900/50 border border-cyan-500/20 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Secure Anonymous Login
                  </h2>
                  <button
                    onClick={() => setIsLoginModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <MockQRCodePassportLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
    >
      {children}
      <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
    </a>
  );
}

function QuickAccessCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <a href={href}>
        <motion.div
          className="group h-full p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 transition-all duration-300 hover:border-cyan-400/50 hover:bg-black/20 hover:shadow-[0_0_20px_theme(colors.cyan.500/20%)]"
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex flex-col items-center text-center">
            {icon}
            <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            <p className="text-gray-400 leading-relaxed flex-grow">
              {description}
            </p>
          </div>
        </motion.div>
      </a>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
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
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: Record<string, string>;
}) {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-white tracking-wide">{title}</h3>
      <ul className="space-y-3 text-gray-400">
        {Object.entries(links).map(([href, text]) => (
          <li key={href}>
            <a
              href={href}
              className="hover:text-cyan-400 transition-colors duration-200 hover:pl-1"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MockQRCodePassportLogin({
  onSuccess,
  onError,
}: {
  onSuccess: (p: any) => void;
  onError: (e: string) => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState<"qr" | "manual" | null>(
    null
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [anonymousId, setAnonymousId] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verificationSteps = [
    "Initializing secure connection...",
    "Scanning document security features...",
    "Extracting information via OCR...",
    "Validating document authenticity...",
    "Cross-referencing encrypted data...",
    "Generating unique anonymous identity...",
    "Minting temporary verification badge...",
    "Finalizing secure session...",
  ];

  const simulateVerification = async () => {
    setVerificationStatus("processing");
    setProgress(0);
    for (let i = 0; i < verificationSteps.length; i++) {
      setCurrentStep(verificationSteps[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProgress(((i + 1) / verificationSteps.length) * 100);
    }
    const newAnonymousId = `anon_${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    setAnonymousId(newAnonymousId);
    setTimeout(() => {
      setVerificationStatus("success");
      onSuccess({ anonymousId: newAnonymousId, badges: ["Verified Human"] });
    }, 1000);
  };

  const handleStartVerification = () => {
    if (
      selectedMethod === "qr" ||
      (selectedMethod === "manual" && uploadedFile)
    ) {
      simulateVerification();
    }
  };

  const resetProcess = () => {
    setSelectedMethod(null);
    setVerificationStatus("idle");
    setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDragEvents = (e: React.DragEvent, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(isOver);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  if (verificationStatus === "processing") {
    return (
      <div className="text-center p-8">
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          Verifying Identity...
        </h3>
        <p className="text-gray-400 mb-6">{currentStep}</p>
        <div className="w-full bg-gray-700/50 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  }

  if (verificationStatus === "success") {
    return (
      <div className="text-center p-8">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          Verification Complete
        </h3>
        <p className="text-gray-400">You will be redirected shortly.</p>
      </div>
    );
  }

  if (!selectedMethod) {
    return (
      <div className="text-center">
        <p className="text-gray-400 mb-6">
          Your identity is verified on-device. No personal data is stored on our
          servers.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <MethodButton
            icon={<Camera />}
            title="QR Code Scan"
            description="Quick verification via mobile."
            onClick={() => setSelectedMethod("qr")}
          />
          <MethodButton
            icon={<Upload />}
            title="Manual Upload"
            description="Upload your passport or ID."
            onClick={() => setSelectedMethod("manual")}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          setUploadedFile(null);
          setSelectedMethod(null);
        }}
        className="text-sm text-gray-400 hover:text-white mb-4 flex items-center"
      >
        &larr; Back to method selection
      </button>

      {selectedMethod === "qr" && (
        <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-white/10">
          <Camera className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Scan with your Device
          </h3>
          <p className="text-gray-400 mb-6">
            A mock QR code would appear here for you to scan.
          </p>
          <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center text-black">
            Mock QR Code
          </div>
        </div>
      )}

      {selectedMethod === "manual" && (
        <div>
          {!uploadedFile ? (
            <div
              onDragEnter={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDragOver={(e) => handleDragEvents(e, true)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 text-center bg-gray-800/50 rounded-xl border-2 border-dashed transition-colors ${
                isDragOver
                  ? "border-cyan-400 bg-gray-700/50"
                  : "border-white/10"
              } cursor-pointer`}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Drag & Drop Your Document
              </h3>
              <p className="text-gray-400">or click to browse</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,application/pdf"
              />
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-800/50 rounded-xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-left">
                <FileText className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium truncate max-w-xs">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleStartVerification}
          disabled={
            verificationStatus !== "idle" ||
            (selectedMethod === "manual" && !uploadedFile)
          }
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Start Verification
        </button>
      </div>
    </div>
  );
}

function MethodButton({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-6 bg-gray-800/50 rounded-xl border border-white/10 text-center hover:border-cyan-400/50 hover:bg-gray-700/50 transition-all group"
    >
      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  );
}
