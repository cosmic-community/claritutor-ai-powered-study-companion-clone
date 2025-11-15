import Link from 'next/link'
import { getNotes } from '@/lib/cosmic'
import { FileText, Brain, Clock, Star } from 'lucide-react'
import type { Note } from '@/types'

export default async function NotesPage() {
  const notes = await getNotes() as Note[]

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Notes</h1>
          <p className="text-lg text-gray-600">
            AI-generated and manual notes from your learning sessions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex-1">
                  {note.metadata?.note_title || note.title}
                </h3>
                {note.metadata?.ai_generated && (
                  <Brain className="h-5 w-5 text-primary-600" />
                )}
              </div>

              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 rounded text-xs font-medium">
                  {note.metadata?.note_type?.value || 'Note'}
                </span>
                {note.metadata?.priority && (
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ml-2 ${
                    note.metadata.priority.key === 'critical' 
                      ? 'bg-red-100 text-red-700'
                      : note.metadata.priority.key === 'high'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {note.metadata.priority.value}
                  </span>
                )}
              </div>

              {note.metadata?.subject && (
                <p className="text-sm text-gray-600 mb-3">
                  Subject: <span className="font-medium">{note.metadata.subject}</span>
                </p>
              )}

              {note.metadata?.key_takeaways && note.metadata.key_takeaways.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Key Takeaways:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {note.metadata.key_takeaways.slice(0, 2).map((takeaway, idx) => (
                      <li key={idx} className="flex items-start">
                        <Star className="h-3 w-3 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {note.metadata?.created_date || 'Recently'}
                </div>
                {note.metadata?.review_count !== undefined && (
                  <span>
                    Reviewed {note.metadata.review_count}x
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No notes created yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}