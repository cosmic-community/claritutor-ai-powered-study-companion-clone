'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, Target, Award, BookOpen, Brain, Calendar, BarChart3 } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState('week')

  // Sample data - would come from database
  const studyData = [
    { day: 'Mon', hours: 3, sessions: 2, score: 85 },
    { day: 'Tue', hours: 4, sessions: 3, score: 92 },
    { day: 'Wed', hours: 2, sessions: 1, score: 78 },
    { day: 'Thu', hours: 5, sessions: 4, score: 88 },
    { day: 'Fri', hours: 3, sessions: 2, score: 95 },
    { day: 'Sat', hours: 6, sessions: 5, score: 91 },
    { day: 'Sun', hours: 4, sessions: 3, score: 87 }
  ]

  const subjectData = [
    { subject: 'Mathematics', hours: 12, color: '#8b5cf6' },
    { subject: 'Science', hours: 10, color: '#3b82f6' },
    { subject: 'Literature', hours: 8, color: '#10b981' },
    { subject: 'History', hours: 6, color: '#f59e0b' },
    { subject: 'Languages', hours: 5, color: '#ef4444' }
  ]

  const achievements = [
    { name: '7-Day Streak', progress: 100, tier: 'gold' },
    { name: 'Study Master', progress: 75, tier: 'silver' },
    { name: 'Early Bird', progress: 50, tier: 'bronze' },
    { name: 'Night Owl', progress: 25, tier: null }
  ]

  const stats = {
    totalHours: 156,
    averageDaily: 4.2,
    currentStreak: 7,
    bestStreak: 23,
    sessionsCompleted: 48,
    averageScore: 87
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
              <p className="text-gray-600">Track your academic journey and achievements</p>
            </div>
            <div className="flex gap-2">
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    timeRange === range
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="text-xs text-green-600">+12%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
            <p className="text-xs text-gray-600">Total Study Time</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-secondary-600" />
              <span className="text-xs text-green-600">+5%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageDaily}h</p>
            <p className="text-xs text-gray-600">Daily Average</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="text-xs text-yellow-600">🔥</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}d</p>
            <p className="text-xs text-gray-600">Current Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-xs text-gray-600">Best</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.bestStreak}d</p>
            <p className="text-xs text-gray-600">Best Streak</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-xs text-green-600">+8</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.sessionsCompleted}</p>
            <p className="text-xs text-gray-600">Sessions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-green-600">+3%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            <p className="text-xs text-gray-600">Avg Score</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Study Time Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Time & Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="hours"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  name="Study Hours"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  name="Performance %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Subject Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, hours }) => `${subject}: ${hours}h`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="hours"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.name} className="text-center">
                <div className="w-24 h-24 mx-auto mb-3">
                  <CircularProgressbar
                    value={achievement.progress}
                    text={`${achievement.progress}%`}
                    styles={buildStyles({
                      pathColor: achievement.tier === 'gold' ? '#f59e0b' :
                                achievement.tier === 'silver' ? '#9ca3af' :
                                achievement.tier === 'bronze' ? '#a16207' : '#e5e7eb',
                      textColor: '#1f2937',
                      trailColor: '#f3f4f6'
                    })}
                  />
                </div>
                <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                {achievement.tier && (
                  <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                    achievement.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    achievement.tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {achievement.tier.toUpperCase()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}