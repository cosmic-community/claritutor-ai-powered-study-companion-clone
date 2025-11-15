import Link from 'next/link'
import { getStudyProjects } from '@/lib/cosmic'
import { Target, Calendar, Users, TrendingUp } from 'lucide-react'
import type { StudyProject } from '@/types'

export default async function ProjectsPage() {
  const projects = await getStudyProjects() as StudyProject[]

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Projects</h1>
          <p className="text-lg text-gray-600">
            Organized learning paths for your academic goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {project.metadata?.project_name || project.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                    {project.metadata?.project_type?.value || 'Project'}
                  </span>
                  {project.metadata?.priority && (
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      project.metadata.priority.key === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : project.metadata.priority.key === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {project.metadata.priority.value} Priority
                    </span>
                  )}
                </div>
              </div>

              {project.metadata?.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.metadata.description}
                </p>
              )}

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Progress</span>
                  <span className="text-xs font-medium text-gray-900">
                    {project.metadata?.progress_percentage || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.metadata?.progress_percentage || 0}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                {project.metadata?.study_materials && (
                  <div className="text-xs">
                    <p className="font-semibold text-gray-900">
                      {project.metadata.study_materials.length}
                    </p>
                    <p className="text-gray-500">Materials</p>
                  </div>
                )}
                {project.metadata?.project_notes && (
                  <div className="text-xs">
                    <p className="font-semibold text-gray-900">
                      {project.metadata.project_notes.length}
                    </p>
                    <p className="text-gray-500">Notes</p>
                  </div>
                )}
                {project.metadata?.study_sessions && (
                  <div className="text-xs">
                    <p className="font-semibold text-gray-900">
                      {project.metadata.study_sessions.length}
                    </p>
                    <p className="text-gray-500">Sessions</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                {project.metadata?.target_date && (
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Target: {project.metadata.target_date}
                  </div>
                )}
                {project.metadata?.project_status && (
                  <span className={`px-2 py-1 rounded-full ${
                    project.metadata.project_status.key === 'active'
                      ? 'bg-green-100 text-green-700'
                      : project.metadata.project_status.key === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {project.metadata.project_status.value}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No study projects created yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}