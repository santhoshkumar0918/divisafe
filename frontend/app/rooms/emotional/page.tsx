'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Heart, ArrowLeft, Shield, User } from 'lucide-react'
import { motion } from 'framer-motion'

// Interface updated for the new design system
interface Message {
  id: string
  content: string
  sender: string // 'Moderator', 'You', or a user hash for others
  timestamp: Date
}

// Sample data updated for clarity and consistency
const sampleMessages: Message[] = [
    { id: '1', content: "Welcome to the Emotional Wellbeing room. This is a compassionate and non-judgmental space to share your feelings, support each other, and navigate the emotional journey of separation.", sender: 'Moderator', timestamp: new Date(Date.now() - 300000) },
    { id: '2', content: "I'm struggling with feelings of guilt and sadness. Some days are harder than others.", sender: 'User_c4e5f', timestamp: new Date(Date.now() - 120000) },
    { id: '3', content: "Your feelings are completely valid. Healing isn't linear - it's okay to have good days and bad days. Be gentle with yourself. You're not alone in this.", sender: 'User_d6a7b', timestamp: new Date(Date.now() - 60000) },
]

export default function EmotionalWellbeingRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages(sampleMessages)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'You',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-screen w-screen bg-black text-gray-200 font-sans flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

      {/* --- REDESIGNED HEADER --- */}
      <header className="relative z-20 bg-black/50 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <a href="/support-rooms" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
                <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="font-medium hidden sm:inline">All Rooms</span>
              </a>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Emotional Wellbeing</h1>
                  <p className="text-gray-400 text-xs">A safe space to share and heal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-cyan-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>18 Active Members</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* --- REDESIGNED CHAT AREA --- */}
      <main className="flex-1 flex flex-col min-h-0 relative z-10">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-xl border-t border-white/10 p-4 sm:p-6 lg:p-8 flex-shrink-0">
          <div className="max-w-4xl mx-auto flex items-end space-x-4">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your feelings respectfully..."
              className="flex-1 bg-gray-900/50 border border-white/20 text-white px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 placeholder-gray-500 transition-all duration-300 resize-none"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
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

// --- INTELLIGENT CHAT MESSAGE COMPONENT ---
function ChatMessage({ message }: { message: Message }) {
  const isYou = message.sender === 'You'
  const isModerator = message.sender === 'Moderator'

  const senderName = isYou ? 'You' : isModerator ? 'Moderator' : 'Anonymous Member'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-start gap-4 ${isYou ? 'justify-end' : 'justify-start'}`}
    >
      {/* Avatar */}
      {!isYou && (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isModerator ? 'bg-cyan-900/80 border-2 border-cyan-500' : 'bg-gray-800'}`}>
          {isModerator ? <Shield className="h-5 w-5 text-cyan-400" /> : <User className="h-5 w-5 text-gray-400" />}
        </div>
      )}
      
      {/* Message Content */}
      <div>
        <div className={`flex items-baseline gap-2 ${isYou ? 'justify-end' : 'justify-start'}`}>
            <p className={`text-sm font-semibold ${isModerator ? 'text-cyan-400' : 'text-gray-300'}`}>
                {senderName}
            </p>
            <p className="text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
        <div className={`mt-1 px-5 py-3 rounded-2xl max-w-md lg:max-w-lg ${
            isYou 
              ? 'bg-cyan-900/80 text-white rounded-br-none' 
              : isModerator
              ? 'bg-gray-900/50 text-gray-200 rounded-bl-none border border-cyan-500/30'
              : 'bg-gray-900/50 text-gray-200 rounded-bl-none'
          }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </motion.div>
  )
}

