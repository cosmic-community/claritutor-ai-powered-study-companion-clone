import Link from 'next/link'
import { Clock, FileText, Brain, Target } from 'lucide-react'
import { getNotes, getStudySessions, getStudyProjects } from '@/lib/cosmic'
import type { Note, StudySession, StudyProject } from '@/types'

export default async function RecentActivity() {
  const [notes, sessions, projects] = await Promise.all([
    getNotes(),
    getStudySessions(),
    getStudyProjects(),
  ])

  // Get recent items
  const recentNotes = (notes as Note[]).slice(0, 2)
  const recentSessions = (sessions as StudySession[]).slice(0, 2)
  const recentProjects = (projects as StudyProject[]).slice(0, 2)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <p className="text-lg text-gray-600">
            Stay updated with the latest study materials and sessions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Notes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              Latest Notes
            </h3>
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.slug}`}
                  className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {note.metadata?.note_title || note.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {note.metadata?.subject || 'General'}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {note.metadata?.created_date || 'Recently'}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-secondary-600" />
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/sessions/${session.slug}`}
                  className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {session.metadata?.session_title || session.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Score: {session.metadata?.comprehension_score || 0}%
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {session.metadata?.duration_minutes || 0} mins
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary-600" />
              Active Projects
            </h3>
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {project.metadata?.project_name || project.title}
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                      style={{ width: `${project.metadata?.progress_percentage || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {project.metadata?.progress_percentage || 0}% Complete
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}