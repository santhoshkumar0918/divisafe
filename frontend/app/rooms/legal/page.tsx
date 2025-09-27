'use client'

import { useState, useEffect, useRef } from 'react'
import { Header } from '@/components/Header'
import { Send, Scale } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  anonymous: boolean
}

export default function LegalAdviceRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Add some sample messages
    const sampleMessages: Message[] = [
      {
        id: '1',
        content: "Welcome to Legal Advice. Please note: This is for general guidance only, not professional legal advice. Always consult with a qualified attorney.",
        sender: 'Moderator',
        timestamp: new Date(Date.now() - 300000),
        anonymous: false
      },
      {
        id: '2',
        content: "Can someone explain the difference between contested and uncontested divorce?",
        sender: 'Anonymous User',
        timestamp: new Date(Date.now() - 120000),
        anonymous: true
      },
      {
        id: '3',
        content: "Uncontested means both parties agree on all terms. Contested means there are disagreements that need court resolution. Uncontested is typically faster and less expensive.",
        sender: 'Anonymous User',
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
      anonymous: true
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
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Room Header */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-600 p-3 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Legal Advice</h1>
              <p className="text-slate-300">Ask questions about legal processes</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">
                      {message.sender} {message.anonymous && '(Anonymous)'}
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="text-xs text-slate-400 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your legal question..."
                className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              ⚠️ This is general guidance only. Always consult a qualified attorney for legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}