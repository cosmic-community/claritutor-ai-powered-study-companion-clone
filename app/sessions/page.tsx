import Link from 'next/link'
import { getStudySessions } from '@/lib/cosmic'
import { Brain, Clock, MessageSquare, TrendingUp } from 'lucide-react'
import type { StudySession } from '@/types'

export default async function SessionsPage() {
  const sessions = await getStudySessions() as StudySession[]

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Sessions</h1>
          <p className="text-lg text-gray-600">
            Interactive learning sessions with AI guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/sessions/${session.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex-1">
                  {session.metadata?.session_title || session.title}
                </h3>
                <Brain className="h-5 w-5 text-secondary-600" />
              </div>

              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium">
                  {session.metadata?.session_type?.value || 'Session'}
                </span>
                {session.metadata?.status && (
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ml-2 ${
                    session.metadata.status.key === 'completed' 
                      ? 'bg-green-100 text-green-700'
                      : session.metadata.status.key === 'active'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {session.metadata.status.value}
                  </span>
                )}
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <TrendingUp className="h-4 w-4 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">
                    {session.metadata?.comprehension_score || 0}%
                  </p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <MessageSquare className="h-4 w-4 text-secondary-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">
                    {session.metadata?.questions_asked || 0}
                  </p>
                  <p className="text-xs text-gray-500">Q&A</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <Clock className="h-4 w-4 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">
                    {session.metadata?.duration_minutes || 0}
                  </p>
                  <p className="text-xs text-gray-500">Mins</p>
                </div>
              </div>

              {session.metadata?.follow_up_suggested && (
                <div className="mb-3">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    Follow-up Recommended
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                <span>
                  {session.metadata?.session_date || 'Recent'}
                </span>
                {session.metadata?.related_materials && session.metadata.related_materials.length > 0 && (
                  <span>
                    {session.metadata.related_materials.length} Materials
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No study sessions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}