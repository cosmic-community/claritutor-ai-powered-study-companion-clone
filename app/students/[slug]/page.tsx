// app/students/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getStudent, getProjectsByStudent } from '@/lib/cosmic'
import { GraduationCap, Clock, BookOpen, Award, Mail, Calendar, Target } from 'lucide-react'
import Link from 'next/link'
import type { StudentProfile, StudyProject } from '@/types'

export default async function StudentDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const student = await getStudent(slug) as StudentProfile | null
  
  if (!student) {
    notFound()
  }

  const projects = await getProjectsByStudent(student.id) as StudyProject[]

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
            {student.metadata?.profile_picture?.imgix_url ? (
              <img
                src={`${student.metadata.profile_picture.imgix_url}?w=240&h=240&fit=crop&auto=format,compress`}
                alt={student.metadata?.full_name || student.title}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {student.metadata?.full_name || student.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {student.metadata?.email}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined {student.metadata?.join_date || 'Recently'}
                </span>
              </div>
              <div className="mt-3">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {student.metadata?.education_level?.value || 'Student'}
                </span>
                <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium ml-2">
                  {student.metadata?.account_type?.value || 'Free'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-primary-50 to-white p-4 rounded-lg text-center">
              <Clock className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {student.metadata?.total_study_hours || 0}
              </p>
              <p className="text-sm text-gray-600">Study Hours</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-white p-4 rounded-lg text-center">
              <BookOpen className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {student.metadata?.documents_uploaded || 0}
              </p>
              <p className="text-sm text-gray-600">Documents</p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-white p-4 rounded-lg text-center">
              <Target className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {student.metadata?.notes_created || 0}
              </p>
              <p className="text-sm text-gray-600">Notes</p>
            </div>
            <div className="bg-gradient-to-br from-secondary-50 to-white p-4 rounded-lg text-center">
              <Award className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {student.metadata?.learning_streak_days || 0}
              </p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>

          {/* Study Info */}
          <div className="space-y-6">
            {student.metadata?.study_goals && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Study Goals</h2>
                <p className="text-gray-600">{student.metadata.study_goals}</p>
              </div>
            )}

            {student.metadata?.primary_subjects && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Primary Subjects</h2>
                <p className="text-gray-600">{student.metadata.primary_subjects}</p>
              </div>
            )}

            {student.metadata?.learning_style && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Learning Style</h2>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {student.metadata.learning_style.value}
                </span>
              </div>
            )}
          </div>

          {/* Active Projects */}
          {projects.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Projects</h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {project.metadata?.project_name || project.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {project.metadata?.project_type?.value || 'Study Project'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {project.metadata?.progress_percentage || 0}%
                        </p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                            style={{ width: `${project.metadata?.progress_percentage || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}