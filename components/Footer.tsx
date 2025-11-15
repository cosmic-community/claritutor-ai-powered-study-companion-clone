import Link from 'next/link'
import { GraduationCap, Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl">Claritutor</span>
            </div>
            <p className="text-gray-600 text-sm">
              AI-powered study companion for modern learners.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/materials" className="text-gray-600 hover:text-primary-600 text-sm">
                  Study Materials
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-gray-600 hover:text-primary-600 text-sm">
                  Smart Notes
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-primary-600 text-sm">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sessions" className="text-gray-600 hover:text-primary-600 text-sm">
                  Study Sessions
                </Link>
              </li>
              <li>
                <Link href="/students" className="text-gray-600 hover:text-primary-600 text-sm">
                  Student Profiles
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600 text-sm">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-600">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <p className="text-center text-gray-600 text-sm">
            © {currentYear} Claritutor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}