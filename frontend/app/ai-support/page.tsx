'use client'

import { useState, useEffect, useRef } from 'react'
import { asiOne } from '@/lib/asi-one'
import { ArrowLeft, Send, Bot, User, Heart, Menu, X } from 'lucide-react'
import Link from 'next/link'

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
    // Add welcome message
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

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await asiOne.getEmotionalSupport(inputMessage)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Back */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AI Support
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/support-rooms" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Support Rooms
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
                <Link href="/support-rooms" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                  Support Rooms
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
        {/* Chat Header */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-t-3xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Emotional Support</h1>
              <p className="text-gray-400 text-sm">Your confidential companion • Always available</p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white/5 backdrop-blur-sm border-x border-white/10 overflow-y-auto p-6 space-y-6 min-h-[500px]">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'ai' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700'
                }`}>
                  {message.sender === 'ai' ? (
                    <Bot className="h-5 w-5 text-white" />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                
                {/* Message */}
                <div className={`px-6 py-4 rounded-3xl ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-lg' 
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-bl-lg'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-purple-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-md">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-3xl rounded-bl-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
              placeholder="Share what's on your mind..."
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
          <p className="text-xs text-gray-400 mt-3 text-center">
            Your conversations are private and secure. AI responses are for support only.
          </p>
        </div>
      </div>
    </div>
  )
}