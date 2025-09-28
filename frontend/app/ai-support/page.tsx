'use client'

import { useState, useEffect, useRef } from 'react'
import { asiOne } from '@/lib/asi-one'
import { ArrowLeft, Send, Bot, User, Heart, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import TextareaAutosize from 'react-textarea-autosize' // The new dependency

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export default function AISupportPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      content: "Hi there, I'm your AI companion. I'm here to provide emotional support and listen to whatever you'd like to share. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), content: inputMessage, sender: 'user', timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await asiOne.getEmotionalSupport(inputMessage)
      const aiMessage: Message = { id: (Date.now() + 1).toString(), content: aiResponse, sender: 'ai', timestamp: new Date() }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = { id: (Date.now() + 1).toString(), content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.", sender: 'ai', timestamp: new Date() }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    // OVERHAULED LAYOUT: Full-screen, flex-based layout
    <div className="h-screen w-screen bg-black text-gray-200 font-sans flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      {/* STREAMLINED HEADER: Combines page navigation and chat identity */}
      <header className="relative z-20 bg-black/50 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="font-medium hidden sm:inline">Home</span>
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">AI Emotional Support</h1>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-gray-400 text-xs">Always Available</p>
                  </div>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-10">
              <NavLink href="/support-rooms">Support Rooms</NavLink>
              <NavLink href="/counselors">Counselors</NavLink>
            </nav>

            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-300 hover:text-white" aria-label="Toggle menu">
                {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10">
        {/* Messages List: Takes up remaining space and scrolls */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area: Sticks to the bottom */}
        <div className="bg-black/50 backdrop-blur-xl border-t border-white/10 p-4 sm:p-6 lg:p-8 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-end space-x-4">
            <TextareaAutosize
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              className="flex-1 bg-gray-900/50 border border-white/20 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 placeholder-gray-500 transition-all duration-300 resize-none"
              disabled={isLoading}
              maxRows={5}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-full transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100 flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

// Reusable NavLink for consistency
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group">
      {children}
      <span className="absolute left-0 bottom-[-4px] w-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )
}

// NEW COMPONENT: ChatMessage for cleaner, animated messages
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.sender === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-start space-x-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-black border-2 border-cyan-500/50 shadow-[0_0_10px_theme(colors.cyan.500/50%)]">
          <Bot className="h-5 w-5 text-cyan-400" />
        </div>
      )}
      <div className={`px-5 py-3 rounded-2xl max-w-lg ${ isUser ? 'bg-cyan-900/80 text-white rounded-br-none' : 'bg-gray-900/50 text-gray-200 rounded-bl-none' }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <div className={`text-xs mt-2 text-right ${ isUser ? 'text-cyan-200/70' : 'text-gray-500' }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
       {isUser && (
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-800">
          <User className="h-5 w-5 text-gray-400" />
        </div>
      )}
    </motion.div>
  )
}

// NEW COMPONENT: A clean loading indicator
function LoadingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-start space-x-4 justify-start"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-black border-2 border-cyan-500/50 shadow-[0_0_10px_theme(colors.cyan.500/50%)]">
        <Bot className="h-5 w-5 text-cyan-400" />
      </div>
      <div className="px-5 py-3 rounded-2xl bg-gray-900/50 rounded-bl-none">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </motion.div>
  )
}