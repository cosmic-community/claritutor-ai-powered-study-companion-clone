// app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getStudyProject } from '@/lib/cosmic'
import { Target, Calendar, Clock, FileText, Brain, CheckCircle } from 'lucide-react'
import type { StudyProject } from '@/types'

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getStudyProject(slug) as StudyProject | null
  
  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.metadata?.project_name || project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {project.metadata?.project_type?.value || 'Study Project'}
              </span>
              {project.metadata?.priority && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  project.metadata.priority.key === 'high' 
                    ? 'bg-red-100 text-red-700'
                    : project.metadata.priority.key === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {project.metadata.priority.value} Priority
                </span>
              )}
              {project.metadata?.project_status && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
          </div>

          {/* Description */}
          {project.metadata?.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600">{project.metadata.description}</p>
            </div>
          )}

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-900">Progress</h2>
              <span className="text-2xl font-bold text-primary-600">
                {project.metadata?.progress_percentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${project.metadata?.progress_percentage || 0}%` }}
              />
            </div>
            {project.metadata?.target_date && (
              <p className="text-sm text-gray-600 mt-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Target Date: {project.metadata.target_date}
              </p>
            )}
          </div>

          {/* Learning Goals */}
          {project.metadata?.learning_goals && project.metadata.learning_goals.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Learning Goals</h2>
              <ul className="space-y-2">
                {project.metadata.learning_goals.map((goal, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project Resources */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Study Materials */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Study Materials</h3>
              </div>
              <p className="text-3xl font-bold text-primary-600">
                {project.metadata?.study_materials?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Documents uploaded</p>
            </div>

            {/* Notes */}
            <div className="bg-gradient-to-br from-secondary-50 to-white p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-secondary-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Notes</h3>
              </div>
              <p className="text-3xl font-bold text-secondary-600">
                {project.metadata?.project_notes?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Notes created</p>
            </div>

            {/* Sessions */}
            <div className="bg-gradient-to-br from-primary-50 to-white p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Brain className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Sessions</h3>
              </div>
              <p className="text-3xl font-bold text-primary-600">
                {project.metadata?.study_sessions?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Study sessions</p>
            </div>
          </div>

          {/* Study Schedule */}
          {project.metadata?.study_schedule && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Study Schedule</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {JSON.stringify(project.metadata.study_schedule, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}