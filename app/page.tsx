import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Stats from '@/components/Stats'
import RecentActivity from '@/components/RecentActivity'
import AITutorShowcase from '@/components/AITutorShowcase'
import StudyTools from '@/components/StudyTools'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AITutorShowcase />
      <Features />
      <StudyTools />
      <Stats />
      <RecentActivity />
    </>
  )
}