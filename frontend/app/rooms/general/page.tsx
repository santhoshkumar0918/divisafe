'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, ArrowLeft, Users, Shield, Menu, X, User, Crown } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  anonymous: boolean
  isModerator?: boolean
  isYou?: boolean
}

export default function GeneralSupportRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [onlineCount] = useState(127)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Add some sample messages
    const sampleMessages: Message[] = [
      {
        id: '1',
        content: "Welcome to the General Support room. This is a safe space to discuss any divorce-related topics. Remember, we're all here to support each other.",
        sender: 'Moderator Sarah',
        timestamp: new Date(Date.now() - 300000),
        anonymous: false,
        isModerator: true
      },
      {
        id: '2',
        content: "I'm going through a difficult time and could use some support from others who understand. The paperwork alone is overwhelming.",
        sender: 'Anonymous',
        timestamp: new Date(Date.now() - 180000),
        anonymous: true
      },
      {
        id: '3',
        content: "You're not alone in feeling overwhelmed. Many of us here have been through similar experiences. Take it one step at a time. What specific part is causing you the most stress?",
        sender: 'Anonymous',
        timestamp: new Date(Date.now() - 120000),
        anonymous: true
      },
      {
        id: '4',
        content: "The financial aspects are really scary. I don't know how I'll manage on my own.",
        sender: 'Anonymous',
        timestamp: new Date(Date.now() - 60000),
        anonymous: true
      }
    ]
    setMessages(sampleMessages)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'You',
      timestamp: new Date(),
      anonymous: true,
      isYou: true
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Back */}
            <div className="flex items-center space-x-4">
              <Link href="/support-rooms" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    General Support
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>{onlineCount} online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/ai-support" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                AI Support
              </Link>
              <Link href="/counselors" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Counselors
              </Link>
            </nav>

            {/* Mobile Menu */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <nav className="flex flex-col space-y-4">
                <Link href="/ai-support" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  AI Support
                </Link>
                <Link href="/counselors" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  Counselors
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        {/* Room Info */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-t-3xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">General Support</h1>
                <p className="text-gray-400 text-sm">Open discussions about relationship challenges</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{onlineCount} online</span>
              </div>
              <Shield className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white/5 backdrop-blur-sm border-x border-white/10 overflow-y-auto p-6 space-y-6 min-h-[500px]">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isYou ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-md ${message.isYou ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  message.isModerator 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                    : message.isYou
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700'
                }`}>
                  {message.isModerator ? (
                    <Crown className="h-5 w-5 text-white" />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                
                {/* Message */}
                <div className={`px-6 py-4 rounded-3xl ${
                  message.isYou 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-lg' 
                    : message.isModerator
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-white rounded-bl-lg'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-bl-lg'
                }`}>
                  <div className={`text-xs mb-2 flex items-center space-x-2 ${
                    message.isYou ? 'text-purple-100' : 'text-gray-400'
                  }`}>
                    <span>{message.sender}</span>
                    {message.isModerator && <Crown className="w-3 h-3 text-yellow-400" />}
                    {message.anonymous && !message.isModerator && <Shield className="w-3 h-3 text-green-400" />}
                  </div>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className={`text-xs mt-2 ${
                    message.isYou ? 'text-purple-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-b-3xl p-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts anonymously..."
              className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 placeholder-gray-400 transition-all duration-300"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">
              Your messages are anonymous and secure. Be respectful and supportive.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Shield className="w-3 h-3 text-green-400" />
              <span>Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}