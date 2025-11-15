import { FileText, Brain, Users, BarChart3, Clock, Shield } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: FileText,
      title: 'Document Processing',
      description: 'Upload PDFs, text files, and research papers. Our AI extracts and organizes content automatically.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Notes',
      description: 'Generate comprehensive study notes with key concepts, summaries, and study questions.',
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Share notes and materials with study groups. Learn together more effectively.',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor study hours, comprehension scores, and learning streaks with detailed analytics.',
    },
    {
      icon: Clock,
      title: 'Smart Scheduling',
      description: 'AI-optimized study schedules based on your goals and available time.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your study materials and notes are encrypted and completely private.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to enhance your learning experience and help you achieve your academic goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}