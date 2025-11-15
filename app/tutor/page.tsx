'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { tutorPersonas, generateAIResponse, generateTitle, categorizeContent, detectConfusion } from '@/lib/openai'
import { Send, Bot, User, Sparkles, RotateCcw, BookOpen, Lightbulb, Code, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function TutorPage() {
  const [selectedTutor, setSelectedTutor] = useState(tutorPersonas[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationTitle, setConversationTitle] = useState('New Conversation')
  const [showConfusionHelp, setShowConfusionHelp] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const checkConfusion = async () => {
      if (messages.length > 2) {
        const confused = await detectConfusion(messages.map(m => ({
          role: m.role,
          content: m.content
        })))
        setShowConfusionHelp(confused)
      }
    }
    checkConfusion()
  }, [messages])

  const quickActions = [
    { label: 'Explain differently', icon: Lightbulb, action: 'Can you explain that in a different way?' },
    { label: 'Give examples', icon: BookOpen, action: 'Can you provide some examples?' },
    { label: 'Show code', icon: Code, action: 'Can you show me the code for this?' },
    { label: 'Simplify', icon: HelpCircle, action: 'Can you simplify this explanation?' }
  ]

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Generate title for first message
      if (messages.length === 0) {
        const title = await generateTitle(input)
        setConversationTitle(title)
        
        // Categorize content
        const tags = await categorizeContent(input)
        // Store tags for later use
      }

      const response = await generateAIResponse(
        [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        })),
        selectedTutor
      )

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response as string,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setShowConfusionHelp(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    handleSend()
  }

  const resetConversation = () => {
    setMessages([])
    setConversationTitle('New Conversation')
    setShowConfusionHelp(false)
    toast.success('Conversation reset')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{conversationTitle}</h1>
              <p className="text-gray-600">AI Tutoring Session</p>
            </div>
            <button
              onClick={resetConversation}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              New Session
            </button>
          </div>

          {/* Tutor Selection */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tutorPersonas.map((tutor) => (
              <button
                key={tutor.id}
                onClick={() => setSelectedTutor(tutor)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedTutor.id === tutor.id
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                    : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{tutor.icon}</span>
                <span className="font-medium">{tutor.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <div className="text-6xl mb-4">{selectedTutor.icon}</div>
                <h2 className="text-xl font-semibold mb-2">Hi! I'm {selectedTutor.name}</h2>
                <p className="text-center max-w-md">{selectedTutor.description}</p>
                <p className="text-sm mt-4">Ask me anything about {selectedTutor.subject}!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-2xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user' 
                              ? 'bg-primary-100 text-primary-600' 
                              : 'bg-secondary-100 text-secondary-600'
                          }`}>
                            {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div className={`rounded-lg p-4 ${
                            message.role === 'user'
                              ? 'bg-primary-50 text-gray-900'
                              : 'bg-gray-50 text-gray-900'
                          }`}>
                            {message.role === 'assistant' ? (
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                className="prose prose-sm max-w-none"
                              >
                                {message.content}
                              </ReactMarkdown>
                            ) : (
                              <p>{message.content}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Confusion Help */}
          <AnimatePresence>
            {showConfusionHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t bg-yellow-50 p-4"
              >
                <p className="text-sm text-yellow-800 mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  It seems you might need clarification. Try these:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.action)}
                      className="px-3 py-1 bg-white text-yellow-800 rounded-lg text-sm hover:bg-yellow-100 transition-colors flex items-center gap-1"
                    >
                      <action.icon className="h-3 w-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask ${selectedTutor.name} anything...`}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.action)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}