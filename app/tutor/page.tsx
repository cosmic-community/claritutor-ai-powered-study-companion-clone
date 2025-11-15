'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  tutorPersonas, 
  generateAIResponse, 
  generateTitle, 
  categorizeContent, 
  detectConfusion,
  analyzeComplexity,
  generatePracticeProblems,
  summarizeConversation,
  type TutorPersona,
  type ConversationContext
} from '@/lib/openai'
import { 
  Send, Bot, User, Sparkles, RotateCcw, BookOpen, 
  Lightbulb, Code, HelpCircle, Save, Download, 
  ChevronDown, History, Target, Brain, Pause, Play,
  Copy, Check
} from 'lucide-react'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tokens?: number
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  tutorId: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  summary?: string
}

export default function TutorPage() {
  const [selectedTutor, setSelectedTutor] = useState(tutorPersonas[0])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversationTitle, setConversationTitle] = useState('New Conversation')
  const [showConfusionHelp, setShowConfusionHelp] = useState(false)
  const [showTutorDetails, setShowTutorDetails] = useState(false)
  const [studentLevel, setStudentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [conversationTags, setConversationTags] = useState<string[]>([])
  const [savedConversations, setSavedConversations] = useState<Conversation[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage])

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

  useEffect(() => {
    loadConversationHistory()
  }, [])

  const loadConversationHistory = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) return

      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('updated_at', { ascending: false })
        .limit(10)

      if (!error && data) {
        setSavedConversations(data.map(conv => ({
          ...conv,
          messages: JSON.parse(conv.messages || '[]'),
          tags: conv.tags || [],
          createdAt: new Date(conv.created_at),
          updatedAt: new Date(conv.updated_at)
        })))
      }
    } catch (error) {
      console.error('Error loading conversation history:', error)
    }
  }

  const saveConversation = async () => {
    try {
      const { data: session } = await supabase.auth.getSession()
      if (!session?.session?.user) {
        toast.error('Please sign in to save conversations')
        return
      }

      const summary = await summarizeConversation(messages.map(m => ({
        role: m.role,
        content: m.content
      })))

      const { error } = await supabase.from('conversations').insert({
        user_id: session.session.user.id,
        title: conversationTitle,
        messages: JSON.stringify(messages),
        tutor_persona: selectedTutor.id,
        subject: selectedTutor.subject,
        tags: conversationTags,
        summary
      })

      if (!error) {
        toast.success('Conversation saved!')
        await loadConversationHistory()
      }
    } catch (error) {
      console.error('Error saving conversation:', error)
      toast.error('Failed to save conversation')
    }
  }

  const loadConversation = (conversation: Conversation) => {
    setMessages(conversation.messages)
    setConversationTitle(conversation.title)
    setConversationTags(conversation.tags)
    const tutor = tutorPersonas.find(t => t.id === conversation.tutorId)
    if (tutor) setSelectedTutor(tutor)
    setShowHistory(false)
    toast.success('Conversation loaded')
  }

  const quickActions = [
    { label: 'Explain differently', icon: Lightbulb, action: 'Can you explain that in a different way?' },
    { label: 'Give examples', icon: BookOpen, action: 'Can you provide some examples?' },
    { label: 'Show code', icon: Code, action: 'Can you show me the code for this?', forSubject: 'Computer Science' },
    { label: 'Simplify', icon: HelpCircle, action: 'Can you simplify this explanation?' },
    { label: 'Practice problems', icon: Target, action: 'Can you give me some practice problems?' },
    { label: 'Real-world application', icon: Brain, action: 'How is this used in real life?' }
  ].filter(action => !action.forSubject || action.forSubject === selectedTutor.subject)

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
    setIsStreaming(true)
    setStreamingMessage('')

    try {
      // Generate title and categorize for first message
      if (messages.length === 0) {
        const [title, tags, complexity] = await Promise.all([
          generateTitle(input),
          categorizeContent(input),
          analyzeComplexity(input)
        ])
        setConversationTitle(title)
        setConversationTags(tags)
        setStudentLevel(complexity)
      }

      const context: ConversationContext = {
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        })),
        studentLevel,
        learningPreferences: [],
        previousTopics: conversationTags
      }

      const response = await generateAIResponse(
        context.messages,
        selectedTutor,
        true, // Enable streaming
        context
      )

      if (typeof response === 'object' && response !== null && Symbol.asyncIterator in response) {
        let fullContent = ''
        
        for await (const chunk of response as any) {
          const content = chunk.choices[0]?.delta?.content || ''
          fullContent += content
          setStreamingMessage(fullContent)
        }

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: fullContent,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
        setStreamingMessage('')
        setShowConfusionHelp(false)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to get response. Please try again.')
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
      setIsLoading(false)
      toast.success('Response stopped')
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    handleSend()
  }

  const generatePractice = async () => {
    setIsLoading(true)
    try {
      const problems = await generatePracticeProblems(
        selectedTutor.subject,
        conversationTags[0] || 'general concepts',
        'medium',
        3
      )
      
      const practiceMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Here are some practice problems:\n\n${problems.map((p, i) => `${i + 1}. ${p}`).join('\n\n')}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, practiceMessage])
    } catch (error) {
      console.error('Error generating practice problems:', error)
      toast.error('Failed to generate practice problems')
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(null), 2000)
  }

  const exportConversation = () => {
    const content = messages.map(m => 
      `${m.role === 'user' ? 'You' : selectedTutor.name}: ${m.content}\n`
    ).join('\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${conversationTitle.replace(/[^a-z0-9]/gi, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Conversation exported')
  }

  const resetConversation = () => {
    setMessages([])
    setConversationTitle('New Conversation')
    setConversationTags([])
    setShowConfusionHelp(false)
    setStreamingMessage('')
    toast.success('Conversation reset')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{conversationTitle}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600">AI Tutoring Session</p>
                {conversationTags.length > 0 && (
                  <div className="flex gap-1">
                    {conversationTags.map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                History
              </button>
              <button
                onClick={saveConversation}
                disabled={messages.length === 0}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
              <button
                onClick={exportConversation}
                disabled={messages.length === 0}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={resetConversation}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                New Session
              </button>
            </div>
          </div>

          {/* Tutor Selection */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tutorPersonas.map((tutor) => (
              <button
                key={tutor.id}
                onClick={() => {
                  setSelectedTutor(tutor)
                  setShowTutorDetails(true)
                }}
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

          {/* Tutor Details */}
          <AnimatePresence>
            {showTutorDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedTutor.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedTutor.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      <strong>Specialization:</strong> {selectedTutor.specialization}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Teaching Style:</strong> {selectedTutor.teachingStyle}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTutorDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Conversation History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Conversation History</h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2">
                  {savedConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => loadConversation(conv)}
                      className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-medium text-sm">{conv.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {conv.updatedAt.toLocaleDateString()} • {conv.messages.length} messages
                      </p>
                      {conv.tags.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {conv.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                <div className="mt-6">
                  <button
                    onClick={generatePractice}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    <Target className="inline h-4 w-4 mr-2" />
                    Get Practice Problems
                  </button>
                </div>
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
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-gray-500">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                              <button
                                onClick={() => copyMessage(message.content, message.id)}
                                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                              >
                                {copied === message.id ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Streaming message */}
                {isStreaming && streamingMessage && (
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
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          className="prose prose-sm max-w-none"
                        >
                          {streamingMessage}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Loading indicator */}
                {isLoading && !streamingMessage && (
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
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
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
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={`Ask ${selectedTutor.name} anything...`}
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isLoading}
              />
              {isStreaming ? (
                <button
                  onClick={stopStreaming}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3 flex-wrap">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.action)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1 disabled:opacity-50"
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