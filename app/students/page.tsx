import Link from 'next/link'
import { getStudents } from '@/lib/cosmic'
import { GraduationCap, Clock, BookOpen, Award } from 'lucide-react'
import type { StudentProfile } from '@/types'

export default async function StudentsPage() {
  const students = await getStudents() as StudentProfile[]

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Student Profiles</h1>
          <p className="text-lg text-gray-600">
            Explore our community of dedicated learners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`/students/${student.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center space-x-4 mb-4">
                {student.metadata?.profile_picture?.imgix_url ? (
                  <img
                    src={`${student.metadata.profile_picture.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
                    alt={student.metadata?.full_name || student.title}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {student.metadata?.full_name || student.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {student.metadata?.education_level?.value || 'Student'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {student.metadata?.study_goals || 'Focused on academic excellence'}
              </p>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <Clock className="h-4 w-4 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">{student.metadata?.total_study_hours || 0}h</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <BookOpen className="h-4 w-4 text-secondary-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">{student.metadata?.documents_uploaded || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <Award className="h-4 w-4 text-primary-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">{student.metadata?.learning_streak_days || 0}d</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No student profiles available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}