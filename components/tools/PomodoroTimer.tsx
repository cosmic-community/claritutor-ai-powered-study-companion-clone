'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, BookOpen, Settings } from 'lucide-react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { Howl } from 'howler'
import toast from 'react-hot-toast'

export default function PomodoroTimer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSession, setCurrentSession] = useState<'work' | 'break' | 'longBreak'>('work')
  const [sessionCount, setSessionCount] = useState(0)
  const [key, setKey] = useState(0)
  
  const [settings, setSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: true,
    soundEnabled: true
  })

  const [showSettings, setShowSettings] = useState(false)

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
        src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJn+DyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyvmwhBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFApJoODyv2whBjiM0fDRezcGKYLL7d2RPQgUXLDm67hVFAA='],
        volume: 0.5
      })
      sound.play()
    }
  }, [settings.soundEnabled])

  const handleComplete = useCallback(() => {
    playSound()
    
    if (currentSession === 'work') {
      const newSessionCount = sessionCount + 1
      setSessionCount(newSessionCount)
      
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
      setIsPlaying(settings.autoStartBreaks)
      setKey(prev => prev + 1)
    }
  }, [currentSession, sessionCount, settings, playSound])

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentSession('work')
    setKey(prev => prev + 1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
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
      </div>

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
            </div>
          )}
        </CountdownCircleTimer>
      </div>

      <div className="flex gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPlaying(!isPlaying)}
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
          </div>
        </motion.div>
      )}
    </div>
  )
}