// app/sessions/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getStudySession } from '@/lib/cosmic'
import { Brain, Clock, MessageSquare, TrendingUp, User, FileText } from 'lucide-react'
import type { StudySession } from '@/types'

export default async function SessionDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await getStudySession(slug) as StudySession | null
  
  if (!session) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {session.metadata?.session_title || session.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                {session.metadata?.session_type?.value || 'Study Session'}
              </span>
              {session.metadata?.status && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  session.metadata.status.key === 'completed' 
                    ? 'bg-green-100 text-green-700'
                    : session.metadata.status.key === 'active'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {session.metadata.status.value}
                </span>
              )}
              {session.metadata?.follow_up_suggested && (
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Follow-up Recommended
                </span>
              )}
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary-50 to-white p-4 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {session.metadata?.comprehension_score || 0}%
              </p>
              <p className="text-sm text-gray-600">Comprehension</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-white p-4 rounded-lg text-center">
              <MessageSquare className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {session.metadata?.questions_asked || 0}
              </p>
              <p className="text-sm text-gray-600">Questions</p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-white p-4 rounded-lg text-center">
              <Clock className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {session.metadata?.duration_minutes || 0}
              </p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-white p-4 rounded-lg text-center">
              <FileText className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {session.metadata?.session_notes?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Notes</p>
            </div>
          </div>

          {/* Conversation History */}
          {session.metadata?.conversation_history && session.metadata.conversation_history.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversation History</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {session.metadata.conversation_history.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-3xl ${
                      msg.type === 'ai' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-primary-600 text-white'
                    } rounded-lg p-4`}>
                      <div className="flex items-center mb-2">
                        {msg.type === 'ai' ? (
                          <Brain className="h-4 w-4 mr-2" />
                        ) : (
                          <User className="h-4 w-4 mr-2" />
                        )}
                        <span className="text-xs opacity-75">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Insights */}
          {session.metadata?.key_insights && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Insights</h2>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6">
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: session.metadata.key_insights.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            </div>
          )}

          {/* Related Materials */}
          {session.metadata?.related_materials && session.metadata.related_materials.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Related Materials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {session.metadata.related_materials.map((material) => (
                  <div key={material.id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">
                      {material.metadata?.document_title || material.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {material.metadata?.document_type?.value || 'Document'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session Date */}
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-600">
              Session Date: {session.metadata?.session_date || 'Not specified'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}