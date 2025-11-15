import { getStudents, getStudyMaterials, getNotes, getStudySessions } from '@/lib/cosmic'

export default async function Stats() {
  const [students, materials, notes, sessions] = await Promise.all([
    getStudents(),
    getStudyMaterials(),
    getNotes(),
    getStudySessions(),
  ])

  const stats = [
    { label: 'Active Students', value: students.length, suffix: '+' },
    { label: 'Study Materials', value: materials.length, suffix: '' },
    { label: 'Notes Created', value: notes.length, suffix: '+' },
    { label: 'Study Sessions', value: sessions.length, suffix: '' },
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-white/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}