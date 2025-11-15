import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface TutorPersona {
  id: string
  name: string
  subject: string
  description: string
  systemPrompt: string
  icon: string
}

export const tutorPersonas: TutorPersona[] = [
  {
    id: 'math',
    name: 'Dr. Math',
    subject: 'Mathematics',
    description: 'Expert in problem-solving and mathematical concepts',
    systemPrompt: 'You are an expert mathematics tutor. Focus on step-by-step problem solving, clear explanations, and building mathematical intuition. Use examples and visual descriptions when helpful.',
    icon: '🔢'
  },
  {
    id: 'science',
    name: 'Prof. Science',
    subject: 'Science',
    description: 'Specialist in experimental methodology and scientific thinking',
    systemPrompt: 'You are a science education expert. Explain scientific concepts through experimental thinking, real-world applications, and systematic observation. Encourage scientific curiosity.',
    icon: '🔬'
  },
  {
    id: 'literature',
    name: 'Ms. Literature',
    subject: 'Literature',
    description: 'Guide for critical analysis and literary appreciation',
    systemPrompt: 'You are a literature professor. Focus on critical analysis, thematic exploration, character development, and literary devices. Help students appreciate and understand texts deeply.',
    icon: '📚'
  },
  {
    id: 'history',
    name: 'Dr. History',
    subject: 'History',
    description: 'Expert in contextual understanding and historical analysis',
    systemPrompt: 'You are a history professor. Provide contextual understanding, explain cause-and-effect relationships, and help students understand how past events shape the present.',
    icon: '🏛️'
  },
  {
    id: 'languages',
    name: 'Sensei Lang',
    subject: 'Languages',
    description: 'Conversational practice and language learning expert',
    systemPrompt: 'You are a polyglot language instructor. Focus on conversational practice, grammar explanations, vocabulary building, and cultural context. Adapt to the students proficiency level.',
    icon: '🗣️'
  },
  {
    id: 'cs',
    name: 'Dev Master',
    subject: 'Computer Science',
    description: 'Code explanation and programming concepts teacher',
    systemPrompt: 'You are a computer science professor and experienced developer. Explain code clearly, debug problems systematically, and teach best practices. Use examples and encourage hands-on learning.',
    icon: '💻'
  },
  {
    id: 'arts',
    name: 'Artist Guide',
    subject: 'Arts',
    description: 'Creative critique and artistic development mentor',
    systemPrompt: 'You are an art educator and critic. Provide constructive feedback, explain artistic techniques and movements, and foster creative expression. Balance technical skill with creative vision.',
    icon: '🎨'
  },
  {
    id: 'general',
    name: 'Study Buddy',
    subject: 'General Studies',
    description: 'Cross-disciplinary learning assistant',
    systemPrompt: 'You are a versatile study assistant. Help with various subjects, study techniques, time management, and learning strategies. Adapt your approach based on the subject matter.',
    icon: '📖'
  }
]

export async function generateAIResponse(
  messages: { role: string; content: string }[],
  persona: TutorPersona,
  stream = false
) {
  try {
    const systemMessage = {
      role: 'system' as const,
      content: persona.systemPrompt
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
      stream
    })

    if (stream) {
      return completion
    }

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate AI response')
  }
}

export async function generateTitle(content: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate a short, descriptive title (max 50 characters) for this conversation. Return only the title, no quotes or punctuation.'
        },
        {
          role: 'user',
          content: content.substring(0, 500)
        }
      ],
      temperature: 0.5,
      max_tokens: 20
    })

    return completion.choices[0]?.message?.content || 'Study Session'
  } catch (error) {
    console.error('Title generation error:', error)
    return 'Study Session'
  }
}

export async function categorizeContent(content: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Categorize this educational content. Return up to 3 subject tags as a comma-separated list. Use these categories: Mathematics, Science, Literature, History, Languages, Computer Science, Arts, Biology, Chemistry, Physics, Geography, Economics, Psychology, Philosophy, Business'
        },
        {
          role: 'user',
          content: content.substring(0, 1000)
        }
      ],
      temperature: 0.3,
      max_tokens: 30
    })

    const tags = completion.choices[0]?.message?.content || ''
    return tags.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 3)
  } catch (error) {
    console.error('Categorization error:', error)
    return ['General']
  }
}

export async function detectConfusion(messages: { role: string; content: string }[]): Promise<boolean> {
  if (messages.length < 2) return false

  const recentMessages = messages.slice(-3)
  const keywords = ['confused', "don't understand", 'what do you mean', 'can you explain', 'lost', 'unclear', '?', 'help']
  
  return recentMessages.some(msg => 
    msg.role === 'user' && 
    keywords.some(keyword => msg.content.toLowerCase().includes(keyword))
  )
}

export async function generateStudyRecommendations(
  topics: string[],
  performance: number
): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate 3 specific study recommendations based on topics and performance. Keep each recommendation under 100 characters.'
        },
        {
          role: 'user',
          content: `Topics: ${topics.join(', ')}\nPerformance: ${performance}%`
        }
      ],
      temperature: 0.6,
      max_tokens: 150
    })

    const recommendations = completion.choices[0]?.message?.content || ''
    return recommendations.split('\n').filter(Boolean).slice(0, 3)
  } catch (error) {
    console.error('Recommendation generation error:', error)
    return [
      'Review fundamental concepts',
      'Practice with more examples',
      'Create summary notes'
    ]
  }
}