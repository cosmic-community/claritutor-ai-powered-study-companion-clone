'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Clock, Target, Award, BookOpen, Brain, 
  Calendar, BarChart3, Zap, Trophy, Star, Activity
} from 'lucide-react'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { generateStudyRecommendations } from '@/lib/openai'
import toast from 'react-hot-toast'

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState('week')
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [insightType, setInsightType] = useState<'overview' | 'subjects' | 'patterns'>('overview')

  // Enhanced sample data - would come from database
  const studyData = [
    { day: 'Mon', hours: 3, sessions: 2, score: 85, focus: 78 },
    { day: 'Tue', hours: 4, sessions: 3, score: 92, focus: 85 },
    { day: 'Wed', hours: 2, sessions: 1, score: 78, focus: 65 },
    { day: 'Thu', hours: 5, sessions: 4, score: 88, focus: 82 },
    { day: 'Fri', hours: 3, sessions: 2, score: 95, focus: 90 },
    { day: 'Sat', hours: 6, sessions: 5, score: 91, focus: 87 },
    { day: 'Sun', hours: 4, sessions: 3, score: 87, focus: 80 }
  ]

  const subjectData = [
    { subject: 'Mathematics', hours: 12, color: '#8b5cf6', mastery: 78, trend: 'up' },
    { subject: 'Science', hours: 10, color: '#3b82f6', mastery: 85, trend: 'up' },
    { subject: 'Literature', hours: 8, color: '#10b981', mastery: 92, trend: 'stable' },
    { subject: 'History', hours: 6, color: '#f59e0b', mastery: 70, trend: 'down' },
    { subject: 'Languages', hours: 5, color: '#ef4444', mastery: 65, trend: 'up' }
  ]

  const skillRadarData = [
    { skill: 'Problem Solving', A: 85, fullMark: 100 },
    { skill: 'Critical Thinking', A: 78, fullMark: 100 },
    { skill: 'Memory Retention', A: 72, fullMark: 100 },
    { skill: 'Speed Reading', A: 68, fullMark: 100 },
    { skill: 'Note Taking', A: 88, fullMark: 100 },
    { skill: 'Test Performance', A: 82, fullMark: 100 }
  ]

  const achievements = [
    { name: '7-Day Streak', progress: 100, tier: 'gold', description: 'Studied 7 days in a row!' },
    { name: 'Study Master', progress: 75, tier: 'silver', description: '75% to 100 study hours' },
    { name: 'Early Bird', progress: 50, tier: 'bronze', description: '50% morning sessions completed' },
    { name: 'Night Owl', progress: 25, tier: null, description: 'Study after 9 PM' },
    { name: 'Speed Learner', progress: 60, tier: 'silver', description: 'Complete sessions quickly' },
    { name: 'Deep Focus', progress: 90, tier: 'gold', description: 'Maintain high focus scores' }
  ]

  const stats = {
    totalHours: 156,
    averageDaily: 4.2,
    currentStreak: 7,
    bestStreak: 23,
    sessionsCompleted: 48,
    averageScore: 87,
    focusScore: 81,
    velocityTrend: '+12%',
    weeklyGoal: 85,
    monthlyProgress: 68
  }

  const learningPatterns = {
    bestTime: '2:00 PM - 4:00 PM',
    bestDay: 'Saturday',
    optimalSessionLength: '45 minutes',
    breakFrequency: 'Every 25 minutes',
    strongSubjects: ['Literature', 'Science'],
    needsWork: ['Languages', 'History']
  }

  useEffect(() => {
    fetchRecommendations()
  }, [timeRange])

  const fetchRecommendations = async () => {
    try {
      const topics = subjectData.map(s => s.subject)
      const performance = stats.averageScore
      const studyHistory = subjectData.map(s => ({
        subject: s.subject,
        score: s.mastery
      }))
      
      const recs = await generateStudyRecommendations(topics, performance, studyHistory)
      setRecommendations(recs)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    }
  }

  const getInsightMessage = () => {
    if (stats.currentStreak >= 7) return "🔥 You're on fire! Keep the streak going!"
    if (stats.averageScore >= 85) return "📚 Excellent performance! You're mastering the material!"
    if (stats.focusScore < 70) return "💡 Try shorter sessions to improve focus"
    return "📈 Keep up the good work!"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learning Progress</h1>
              <p className="text-gray-600">Track your academic journey and achievements</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-medium text-primary-600">{getInsightMessage()}</span>
              </div>
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

          {/* Quick Insights Tabs */}
          <div className="flex gap-2 mt-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'subjects', label: 'Subjects', icon: BookOpen },
              { id: 'patterns', label: 'Patterns', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setInsightType(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  insightType === tab.id
                    ? 'bg-secondary-100 text-secondary-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
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
            <div className="mt-2 h-1 bg-gray-200 rounded">
              <div className="h-full bg-primary-600 rounded" style={{ width: '75%' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-secondary-600" />
              <span className="text-xs text-green-600">{stats.velocityTrend}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageDaily}h</p>
            <p className="text-xs text-gray-600">Daily Average</p>
            <div className="mt-2 h-1 bg-gray-200 rounded">
              <div className="h-full bg-secondary-600 rounded" style={{ width: '82%' }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="text-xs text-yellow-600">🔥</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}d</p>
            <p className="text-xs text-gray-600">Current Streak</p>
            <div className="mt-2 flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded ${
                    i < stats.currentStreak ? 'bg-yellow-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-xs text-gray-600">{stats.focusScore}%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.sessionsCompleted}</p>
            <p className="text-xs text-gray-600">Sessions</p>
            <div className="mt-2 h-1 bg-gray-200 rounded">
              <div className="h-full bg-purple-600 rounded" style={{ width: `${stats.focusScore}%` }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Trophy className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-green-600">+3%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            <p className="text-xs text-gray-600">Avg Score</p>
            <div className="mt-2 h-1 bg-gray-200 rounded">
              <div className="h-full bg-blue-600 rounded" style={{ width: `${stats.averageScore}%` }} />
            </div>
          </motion.div>
        </div>

        {/* Charts based on insight type */}
        {insightType === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Study Time & Performance Chart */}
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
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="focus"
                    stroke="#10b981"
                    name="Focus %"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Skill Radar Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Current Level"
                    dataKey="A"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {insightType === 'subjects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

            {/* Subject Mastery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Mastery</h3>
              <div className="space-y-4">
                {subjectData.map((subject) => (
                  <div
                    key={subject.subject}
                    className="cursor-pointer"
                    onClick={() => setSelectedSubject(subject.subject)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{subject.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{subject.mastery}%</span>
                        {subject.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                        {subject.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${subject.mastery}%`,
                          backgroundColor: subject.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {insightType === 'patterns' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Learning Patterns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimal Study Times</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Best Time</p>
                  <p className="font-medium text-gray-900">{learningPatterns.bestTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Most Productive Day</p>
                  <p className="font-medium text-gray-900">{learningPatterns.bestDay}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ideal Session Length</p>
                  <p className="font-medium text-gray-900">{learningPatterns.optimalSessionLength}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Break Frequency</p>
                  <p className="font-medium text-gray-900">{learningPatterns.breakFrequency}</p>
                </div>
              </div>
            </motion.div>

            {/* Strong Subjects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Strong Areas</h3>
              <div className="space-y-2">
                {learningPatterns.strongSubjects.map((subject) => (
                  <div key={subject} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <Star className="h-4 w-4 text-green-600" />
                    <span className="text-green-800 font-medium">{subject}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Areas for Improvement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Areas</h3>
              <div className="space-y-2">
                {learningPatterns.needsWork.map((subject) => (
                  <div key={subject} className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                    <Target className="h-4 w-4 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">{subject}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Study Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements & Milestones</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.name} className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 relative">
                  <CircularProgressbar
                    value={achievement.progress}
                    text={`${achievement.progress}%`}
                    styles={buildStyles({
                      pathColor: achievement.tier === 'gold' ? '#f59e0b' :
                                achievement.tier === 'silver' ? '#9ca3af' :
                                achievement.tier === 'bronze' ? '#a16207' : '#e5e7eb',
                      textColor: '#1f2937',
                      trailColor: '#f3f4f6',
                      textSize: '20px'
                    })}
                  />
                  {achievement.tier && (
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      achievement.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                      achievement.tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      <Trophy className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm">{achievement.name}</h4>
                {achievement.tier && (
                  <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                    achievement.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    achievement.tier === 'silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {achievement.tier.toUpperCase()}
                  </span>
                )}
                <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}