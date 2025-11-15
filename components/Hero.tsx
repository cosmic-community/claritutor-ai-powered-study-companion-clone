import Link from 'next/link'
import { ArrowRight, BookOpen, Brain, Target, Users } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Transform Your Learning
            </span>
            <br />
            with AI-Powered Study Tools
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your study materials, get AI-generated notes, engage in interactive Q&A sessions, 
            and track your learning progress - all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/students"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Explore Student Profiles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              View Study Projects
              <Target className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold">Smart Materials</h3>
            <p className="text-sm text-gray-600">Upload & organize docs</p>
          </div>
          <div className="text-center">
            <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="font-semibold">AI Tutoring</h3>
            <p className="text-sm text-gray-600">Get instant help</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="font-semibold">Study Projects</h3>
            <p className="text-sm text-gray-600">Organized learning</p>
          </div>
          <div className="text-center">
            <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="font-semibold">Collaboration</h3>
            <p className="text-sm text-gray-600">Learn together</p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
    </section>
  )
}