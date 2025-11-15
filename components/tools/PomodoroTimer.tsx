'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, BookOpen, Settings, Volume2, VolumeX, Target, Brain } from 'lucide-react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { Howl } from 'howler'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'

interface SessionGoal {
  text: string
  completed: boolean
}

export default function PomodoroTimer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSession, setCurrentSession] = useState<'work' | 'break' | 'longBreak'>('work')
  const [sessionCount, setSessionCount] = useState(0)
  const [key, setKey] = useState(0)
  const [sessionGoals, setSessionGoals] = useState<SessionGoal[]>([])
  const [currentGoal, setCurrentGoal] = useState('')
  const [sessionNotes, setSessionNotes] = useState('')
  const [focusQuality, setFocusQuality] = useState(5)
  const [distractionCount, setDistractionCount] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  
  const [settings, setSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: true,
    soundEnabled: true,
    ambientSound: 'none',
    breakReminders: true,
    focusMode: false
  })

  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showGoals, setShowGoals] = useState(false)

  // Ambient sounds
  const ambientSounds = {
    none: null,
    rain: 'https://www.soundjay.com/nature/rain-03.wav',
    forest: 'https://www.soundjay.com/nature/forest-birds-2.wav',
    waves: 'https://www.soundjay.com/nature/ocean-wave-2.wav',
    whitenoise: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeM0fDRezcGKYLL7d2RPQgUXLDm67hVFAA='
  }

  const [ambientSound, setAmbientSound] = useState<Howl | null>(null)

  const getDuration = () => {
    switch (currentSession) {
      case 'work':
        return settings.workDuration * 60
      case 'break':
        return settings.breakDuration * 60
      case 'longBreak':
        return settings.longBreakDuration * 60
      default:
        return settings.workDuration * 60
    }
  }

  const playSound = useCallback(() => {
    if (settings.soundEnabled) {
      const sound = new Howl({
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFAA='],
        volume: 0.5
      })
      sound.play()
    }
  }, [settings.soundEnabled])

  const handleComplete = useCallback(async () => {
    playSound()
    
    if (currentSession === 'work') {
      const newSessionCount = sessionCount + 1
      setSessionCount(newSessionCount)
      
      // Log session to database
      if (sessionStartTime) {
        const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)
        setTotalFocusTime(prev => prev + duration)
        
        try {
          const { data: session } = await supabase.auth.getSession()
          if (session?.session?.user) {
            await supabase.from('study_sessions').insert({
              user_id: session.session.user.id,
              duration: duration,
              session_type: 'pomodoro',
              focus_quality: focusQuality,
              notes: sessionNotes,
              subject: sessionGoals.length > 0 ? sessionGoals[0].text : null
            })
          }
        } catch (error) {
          console.error('Error logging session:', error)
        }
      }
      
      if (newSessionCount % settings.sessionsUntilLongBreak === 0) {
        setCurrentSession('longBreak')
        toast.success('Time for a long break! Great work! 🎉')
      } else {
        setCurrentSession('break')
        toast.success('Work session complete! Take a break 😊')
      }
      
      if (settings.autoStartBreaks) {
        setKey(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    } else {
      setCurrentSession('work')
      toast.success('Break finished! Ready to focus? 💪')
      
      // Show break activity suggestions
      if (settings.breakReminders) {
        const activities = [
          'Stretch your body',
          'Get some water',
          'Look away from the screen',
          'Take deep breaths',
          'Walk around'
        ]
        toast(activities[Math.floor(Math.random() * activities.length)], { icon: '💡' })
      }
      
      setIsPlaying(settings.autoStartBreaks)
      setKey(prev => prev + 1)
    }
  }, [currentSession, sessionCount, settings, playSound, focusQuality, sessionNotes, sessionGoals, sessionStartTime])

  const handleStart = () => {
    setIsPlaying(true)
    setSessionStartTime(new Date())
    
    if (settings.focusMode) {
      // Could trigger browser focus mode if supported
      toast('Focus mode activated! Minimize distractions.', { icon: '🎯' })
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
    
    if (currentSession === 'work') {
      setDistractionCount(prev => prev + 1)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentSession('work')
    setKey(prev => prev + 1)
    setSessionStartTime(null)
  }

  const addGoal = () => {
    if (currentGoal.trim()) {
      setSessionGoals([...sessionGoals, { text: currentGoal, completed: false }])
      setCurrentGoal('')
      toast.success('Goal added!')
    }
  }

  const toggleGoal = (index: number) => {
    const updated = [...sessionGoals]
    updated[index].completed = !updated[index].completed
    setSessionGoals(updated)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Ambient sound management
  useEffect(() => {
    if (settings.ambientSound !== 'none' && ambientSounds[settings.ambientSound as keyof typeof ambientSounds]) {
      const sound = new Howl({
        src: [ambientSounds[settings.ambientSound as keyof typeof ambientSounds]!],
        loop: true,
        volume: 0.3
      })
      sound.play()
      setAmbientSound(sound)
      
      return () => {
        sound.stop()
      }
    } else if (ambientSound) {
      ambientSound.stop()
      setAmbientSound(null)
    }
  }, [settings.ambientSound])

  const sessionStats = {
    completed: sessionCount,
    focusTime: `${Math.floor(totalFocusTime / 60)}m`,
    avgFocus: focusQuality,
    distractions: distractionCount,
    goalsCompleted: sessionGoals.filter(g => g.completed).length
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
        {/* Session Type Selector */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => setCurrentSession('work')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentSession === 'work'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <BookOpen className="inline h-4 w-4 mr-2" />
            Work
          </button>
          <button
            onClick={() => setCurrentSession('break')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentSession === 'break'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Coffee className="inline h-4 w-4 mr-2" />
            Break
          </button>
          <button
            onClick={() => setCurrentSession('longBreak')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentSession === 'longBreak'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Coffee className="inline h-4 w-4 mr-2" />
            Long Break
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Session {sessionCount + 1} • {currentSession === 'work' ? 'Focus Time' : 'Rest Time'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setShowGoals(!showGoals)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            <Target className="inline h-3 w-3 mr-1" />
            Goals ({sessionGoals.length})
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            <Brain className="inline h-3 w-3 mr-1" />
            Stats
          </button>
          <button
            onClick={() => settings.soundEnabled = !settings.soundEnabled}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
          >
            {settings.soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Goals Panel */}
      <AnimatePresence>
        {showGoals && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="font-semibold mb-2">Session Goals</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentGoal}
                onChange={(e) => setCurrentGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                placeholder="Add a goal..."
                className="flex-1 px-3 py-1 border rounded text-sm"
              />
              <button onClick={addGoal} className="px-3 py-1 bg-primary-600 text-white rounded text-sm">
                Add
              </button>
            </div>
            <div className="space-y-1">
              {sessionGoals.map((goal, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => toggleGoal(idx)}
                  />
                  <span className={`text-sm ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                    {goal.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Panel */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="font-semibold mb-2">Session Statistics</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600">Sessions</p>
                <p className="font-medium">{sessionStats.completed}</p>
              </div>
              <div>
                <p className="text-gray-600">Focus Time</p>
                <p className="font-medium">{sessionStats.focusTime}</p>
              </div>
              <div>
                <p className="text-gray-600">Focus Quality</p>
                <p className="font-medium">{sessionStats.avgFocus}/10</p>
              </div>
              <div>
                <p className="text-gray-600">Distractions</p>
                <p className="font-medium">{sessionStats.distractions}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer */}
      <div className="relative">
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={getDuration()}
          colors={
            currentSession === 'work'
              ? ['#EF4444', '#F87171', '#FCA5A5']
              : currentSession === 'break'
              ? ['#10B981', '#34D399', '#86EFAC']
              : ['#3B82F6', '#60A5FA', '#93C5FD']
          }
          colorsTime={[getDuration(), getDuration() / 2, 0]}
          onComplete={handleComplete}
          size={280}
          strokeWidth={12}
        >
          {({ remainingTime }) => (
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">
                {formatTime(remainingTime)}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {currentSession === 'work' ? 'Stay focused!' : 'Relax & recharge'}
              </div>
              {currentSession === 'work' && (
                <div className="mt-2">
                  <label className="text-xs text-gray-500">Focus Quality</label>
                  <div className="flex justify-center gap-1">
                    {[...Array(10)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFocusQuality(i + 1)}
                        className={`w-2 h-2 rounded-full ${
                          i < focusQuality ? 'bg-primary-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CountdownCircleTimer>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => isPlaying ? handlePause() : handleStart()}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-all ${
            currentSession === 'work'
              ? 'bg-red-500 hover:bg-red-600'
              : currentSession === 'break'
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="inline h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="inline h-5 w-5 mr-2" />
              Start
            </>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
        >
          <RotateCcw className="inline h-5 w-5 mr-2" />
          Reset
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
        >
          <Settings className="inline h-5 w-5 mr-2" />
          Settings
        </motion.button>
      </div>

      {/* Enhanced Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-8 p-6 bg-gray-50 rounded-lg w-full max-w-md"
        >
          <h3 className="font-semibold mb-4">Timer Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Work Duration (minutes)</label>
              <input
                type="number"
                value={settings.workDuration}
                onChange={(e) => setSettings({ ...settings, workDuration: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Break Duration (minutes)</label>
              <input
                type="number"
                value={settings.breakDuration}
                onChange={(e) => setSettings({ ...settings, breakDuration: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Long Break Duration (minutes)</label>
              <input
                type="number"
                value={settings.longBreakDuration}
                onChange={(e) => setSettings({ ...settings, longBreakDuration: Number(e.target.value) })}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Ambient Sound</label>
              <select
                value={settings.ambientSound}
                onChange={(e) => setSettings({ ...settings, ambientSound: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
              >
                <option value="none">None</option>
                <option value="rain">Rain</option>
                <option value="forest">Forest</option>
                <option value="waves">Ocean Waves</option>
                <option value="whitenoise">White Noise</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoStart"
                checked={settings.autoStartBreaks}
                onChange={(e) => setSettings({ ...settings, autoStartBreaks: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="autoStart" className="text-sm text-gray-700">
                Auto-start breaks
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="sound"
                checked={settings.soundEnabled}
                onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="sound" className="text-sm text-gray-700">
                Sound notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="focusMode"
                checked={settings.focusMode}
                onChange={(e) => setSettings({ ...settings, focusMode: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="focusMode" className="text-sm text-gray-700">
                Focus mode (minimize distractions)
              </label>
            </div>
          </div>
        </motion.div>
      )}

      {/* Session Notes */}
      {currentSession === 'work' && (
        <div className="mt-4 w-full max-w-md">
          <textarea
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Session notes..."
            className="w-full px-3 py-2 border rounded-lg text-sm"
            rows={2}
          />
        </div>
      )}
    </div>
  )
}