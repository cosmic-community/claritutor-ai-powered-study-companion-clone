'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Target, BarChart3, Coffee, Music, Shield } from 'lucide-react'
import PomodoroTimer from '@/components/tools/PomodoroTimer'

export default function StudyTools() {
  const [activeTab, setActiveTab] = useState('pomodoro')

  const tools = [
    {
      id: 'pomodoro',
      name: 'Pomodoro Timer',
      icon: Clock,
      description: 'Smart study sessions with built-in breaks',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'goals',
      name: 'Goal Tracker',
      icon: Target,
      description: 'Set and track your learning objectives',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Comprehensive progress insights',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'focus',
      name: 'Focus Mode',
      icon: Shield,
      description: 'Distraction-free study environment',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Integrated Study Suite
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful productivity tools designed to enhance your learning efficiency and track your progress.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`p-6 rounded-xl transition-all ${
                activeTab === tool.id
                  ? 'bg-gradient-to-r text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              style={{
                backgroundImage: activeTab === tool.id ? 
                  `linear-gradient(to right, var(--tw-gradient-stops))` : undefined
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <tool.icon className={`h-8 w-8 mx-auto mb-2 ${
                activeTab === tool.id ? 'text-white' : 'text-gray-600'
              }`} />
              <h3 className={`font-semibold ${
                activeTab === tool.id ? 'text-white' : 'text-gray-900'
              }`}>
                {tool.name}
              </h3>
              <p className={`text-xs mt-1 ${
                activeTab === tool.id ? 'text-white/80' : 'text-gray-600'
              }`}>
                {tool.description}
              </p>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-8 min-h-[400px]"
        >
          {activeTab === 'pomodoro' && <PomodoroTimer />}
          {activeTab === 'goals' && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Goal Tracking Coming Soon</h3>
              <p className="text-gray-600">Set SMART goals and track your academic progress</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Detailed insights into your learning patterns</p>
            </div>
          )}
          {activeTab === 'focus' && (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Focus Mode</h3>
              <p className="text-gray-600">Block distractions and optimize your study environment</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}