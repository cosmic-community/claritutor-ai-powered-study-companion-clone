// app/notes/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getNote } from '@/lib/cosmic'
import { FileText, Brain, Clock, Star, BookOpen, HelpCircle } from 'lucide-react'
import type { Note } from '@/types'

export default async function NoteDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const note = await getNote(slug) as Note | null
  
  if (!note) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {note.metadata?.note_title || note.title}
              </h1>
              {note.metadata?.ai_generated && (
                <div className="flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  <Brain className="h-4 w-4 mr-1" />
                  AI Generated
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                {note.metadata?.note_type?.value || 'Note'}
              </span>
              {note.metadata?.priority && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  note.metadata.priority.key === 'critical' 
                    ? 'bg-red-100 text-red-700'
                    : note.metadata.priority.key === 'high'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {note.metadata.priority.value} Priority
                </span>
              )}
            </div>
          </div>

          {/* Note Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">Subject: </span>
              <span className="font-medium ml-1">{note.metadata?.subject || 'General'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">Created: </span>
              <span className="font-medium ml-1">{note.metadata?.created_date || 'Recently'}</span>
            </div>
            {note.metadata?.review_count !== undefined && (
              <div className="flex items-center">
                <Star className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">Reviews: </span>
                <span className="font-medium ml-1">{note.metadata.review_count}</span>
              </div>
            )}
          </div>

          {/* Content */}
          {note.metadata?.content && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Content</h2>
              <div className="bg-gray-50 rounded-lg p-6 prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: note.metadata.content }} />
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {note.metadata?.key_takeaways && note.metadata.key_takeaways.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Key Takeaways
              </h2>
              <ul className="space-y-2">
                {note.metadata.key_takeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span className="text-gray-600">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Study Questions */}
          {note.metadata?.study_questions && note.metadata.study_questions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <HelpCircle className="h-5 w-5 text-secondary-600 mr-2" />
                Study Questions
              </h2>
              <ul className="space-y-2">
                {note.metadata.study_questions.map((question, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-secondary-600 font-medium mr-2">{idx + 1}.</span>
                    <span className="text-gray-600">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {note.metadata?.tags && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {note.metadata.tags.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Last Reviewed */}
          {note.metadata?.last_reviewed && (
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-600">
                Last reviewed: {note.metadata.last_reviewed}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}