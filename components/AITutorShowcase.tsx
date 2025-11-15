'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { tutorPersonas } from '@/lib/openai'
import { Brain, MessageSquare, Sparkles } from 'lucide-react'

export default function AITutorShowcase() {
  const [selectedTutor, setSelectedTutor] = useState(tutorPersonas[0])

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-primary-600" />
            AI-Powered Tutors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn from specialized AI tutors designed for each subject, providing personalized explanations and adaptive learning experiences.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {tutorPersonas.map((tutor) => (
            <motion.button
              key={tutor.id}
              onClick={() => setSelectedTutor(tutor)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedTutor.id === tutor.id
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-primary-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-2">{tutor.icon}</div>
              <h3 className="font-semibold text-sm">{tutor.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{tutor.subject}</p>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={selectedTutor.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center mb-6">
            <div className="text-5xl mr-4">{selectedTutor.icon}</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedTutor.name}</h3>
              <p className="text-gray-600">{selectedTutor.description}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <Sparkles className="h-5 w-5 text-primary-600 mr-2" />
              <span className="font-semibold text-gray-900">Capabilities</span>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <MessageSquare className="h-4 w-4 text-secondary-600 mr-2 mt-0.5" />
                <span className="text-sm">Adaptive explanations based on your learning level</span>
              </li>
              <li className="flex items-start">
                <MessageSquare className="h-4 w-4 text-secondary-600 mr-2 mt-0.5" />
                <span className="text-sm">Multiple explanation formats (step-by-step, analogies, visual)</span>
              </li>
              <li className="flex items-start">
                <MessageSquare className="h-4 w-4 text-secondary-600 mr-2 mt-0.5" />
                <span className="text-sm">Context-aware responses with conversation memory</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}