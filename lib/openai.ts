import OpenAI from 'openai'

// Initialize OpenAI client on demand to avoid server-side initialization issues
let openaiClient: OpenAI | null = null

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: false
    })
  }
  return openaiClient
}

export interface TutorPersona {
  id: string
  name: string
  subject: string
  description: string
  systemPrompt: string
  icon: string
  specialization: string
  teachingStyle: string
}

export const tutorPersonas: TutorPersona[] = [
  {
    id: 'math',
    name: 'Dr. Math',
    subject: 'Mathematics',
    description: 'Expert in problem-solving and mathematical concepts',
    specialization: 'Algebra, Calculus, Statistics, Linear Algebra',
    teachingStyle: 'Step-by-step problem solving with visual explanations',
    systemPrompt: 'You are an expert mathematics tutor. Focus on step-by-step problem solving, clear explanations, and building mathematical intuition. Use examples and visual descriptions when helpful. Break down complex problems into manageable steps.',
    icon: '🔢'
  },
  {
    id: 'science',
    name: 'Prof. Science',
    subject: 'Science',
    description: 'Specialist in experimental methodology and scientific thinking',
    specialization: 'Physics, Chemistry, Biology, Earth Science',
    teachingStyle: 'Experimental approach with real-world applications',
    systemPrompt: 'You are a science education expert. Explain scientific concepts through experimental thinking, real-world applications, and systematic observation. Encourage scientific curiosity and hypothesis testing.',
    icon: '🔬'
  },
  {
    id: 'literature',
    name: 'Ms. Literature',
    subject: 'Literature',
    description: 'Guide for critical analysis and literary appreciation',
    specialization: 'Literary Analysis, Creative Writing, Poetry, World Literature',
    teachingStyle: 'Deep textual analysis with cultural context',
    systemPrompt: 'You are a literature professor. Focus on critical analysis, thematic exploration, character development, and literary devices. Help students appreciate and understand texts deeply. Connect literature to broader cultural and historical contexts.',
    icon: '📚'
  },
  {
    id: 'history',
    name: 'Dr. History',
    subject: 'History',
    description: 'Expert in contextual understanding and historical analysis',
    specialization: 'World History, Cultural Studies, Political History',
    teachingStyle: 'Contextual understanding with cause-effect analysis',
    systemPrompt: 'You are a history professor. Provide contextual understanding, explain cause-and-effect relationships, and help students understand how past events shape the present. Use primary sources and multiple perspectives.',
    icon: '🏛️'
  },
  {
    id: 'languages',
    name: 'Sensei Lang',
    subject: 'Languages',
    description: 'Conversational practice and language learning expert',
    specialization: 'Grammar, Vocabulary, Pronunciation, Cultural Context',
    teachingStyle: 'Immersive conversation with gradual complexity',
    systemPrompt: 'You are a polyglot language instructor. Focus on conversational practice, grammar explanations, vocabulary building, and cultural context. Adapt to the students proficiency level. Use the target language when appropriate.',
    icon: '🗣️'
  },
  {
    id: 'cs',
    name: 'Dev Master',
    subject: 'Computer Science',
    description: 'Code explanation and programming concepts teacher',
    specialization: 'Algorithms, Data Structures, Web Development, AI/ML',
    teachingStyle: 'Hands-on coding with best practices',
    systemPrompt: 'You are a computer science professor and experienced developer. Explain code clearly, debug problems systematically, and teach best practices. Use examples and encourage hands-on learning. Cover both theoretical concepts and practical implementation.',
    icon: '💻'
  },
  {
    id: 'arts',
    name: 'Artist Guide',
    subject: 'Arts',
    description: 'Creative critique and artistic development mentor',
    specialization: 'Visual Arts, Music Theory, Art History, Creative Process',
    teachingStyle: 'Creative exploration with technical foundations',
    systemPrompt: 'You are an art educator and critic. Provide constructive feedback, explain artistic techniques and movements, and foster creative expression. Balance technical skill with creative vision. Encourage experimentation.',
    icon: '🎨'
  },
  {
    id: 'general',
    name: 'Study Buddy',
    subject: 'General Studies',
    description: 'Cross-disciplinary learning assistant',
    specialization: 'Study Techniques, Time Management, Research Skills',
    teachingStyle: 'Adaptive support across all subjects',
    systemPrompt: 'You are a versatile study assistant. Help with various subjects, study techniques, time management, and learning strategies. Adapt your approach based on the subject matter. Focus on building effective learning habits.',
    icon: '📖'
  }
]

export interface ConversationContext {
  messages: { role: string; content: string }[]
  studentLevel?: 'beginner' | 'intermediate' | 'advanced'
  learningPreferences?: string[]
  previousTopics?: string[]
}

export async function generateAIResponse(
  messages: { role: string; content: string }[],
  persona: TutorPersona,
  stream = false,
  context?: ConversationContext
) {
  try {
    const openai = getOpenAIClient()
    
    // Enhanced system message with context awareness
    const systemMessage = {
      role: 'system' as const,
      content: `${persona.systemPrompt}
      
      Teaching Style: ${persona.teachingStyle}
      Specialization: ${persona.specialization}
      
      ${context?.studentLevel ? `Student Level: ${context.studentLevel}` : ''}
      ${context?.learningPreferences ? `Learning Preferences: ${context.learningPreferences.join(', ')}` : ''}
      
      Guidelines:
      1. Adjust complexity based on student responses
      2. Provide multiple explanation formats when concepts are difficult
      3. Use examples relevant to the student's level
      4. Encourage questions and critical thinking
      5. Offer practice problems when appropriate`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1500,
      stream,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
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
    const openai = getOpenAIClient()
    
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
    const openai = getOpenAIClient()
    
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
  const confusionIndicators = [
    'confused', "don't understand", 'what do you mean', 'can you explain',
    'lost', 'unclear', 'not sure', 'could you clarify', 'what?', 'how?',
    'why?', "doesn't make sense", 'repeat', 'again please'
  ]
  
  const hasConfusionKeywords = recentMessages.some(msg => 
    msg.role === 'user' && 
    confusionIndicators.some(keyword => msg.content.toLowerCase().includes(keyword))
  )
  
  // Also check for repeated questions (indicating lack of understanding)
  const userMessages = recentMessages.filter(m => m.role === 'user').map(m => m.content.toLowerCase())
  const hasRepeatedQuestions = userMessages.length >= 2 && 
    userMessages[userMessages.length - 1].split(' ').some(word => 
      userMessages[userMessages.length - 2].includes(word)
    )
  
  return hasConfusionKeywords || hasRepeatedQuestions
}

export async function generateStudyRecommendations(
  topics: string[],
  performance: number,
  studyHistory?: { subject: string; score: number }[]
): Promise<string[]> {
  try {
    const openai = getOpenAIClient()
    
    const historyContext = studyHistory 
      ? `\nRecent performance: ${studyHistory.map(h => `${h.subject}: ${h.score}%`).join(', ')}`
      : ''
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Generate 3 specific, actionable study recommendations based on topics and performance. Keep each recommendation under 100 characters. Focus on concrete actions the student can take.'
        },
        {
          role: 'user',
          content: `Topics: ${topics.join(', ')}\nPerformance: ${performance}%${historyContext}`
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
      'Review fundamental concepts in weak areas',
      'Practice with progressively harder examples',
      'Create summary notes for quick revision'
    ]
  }
}

export async function analyzeComplexity(content: string): Promise<'beginner' | 'intermediate' | 'advanced'> {
  try {
    const openai = getOpenAIClient()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Analyze the complexity level of this educational content. Return only one word: beginner, intermediate, or advanced.'
        },
        {
          role: 'user',
          content: content.substring(0, 1000)
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    })

    const level = completion.choices[0]?.message?.content?.toLowerCase().trim()
    if (level === 'beginner' || level === 'intermediate' || level === 'advanced') {
      return level
    }
    return 'intermediate'
  } catch (error) {
    console.error('Complexity analysis error:', error)
    return 'intermediate'
  }
}

export async function generatePracticeProblems(
  subject: string,
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number = 3
): Promise<string[]> {
  try {
    const openai = getOpenAIClient()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `Generate ${count} practice problems for ${subject} on the topic of ${topic}. Difficulty level: ${difficulty}. Return each problem on a new line. Include brief answers in parentheses at the end of each problem.`
        },
        {
          role: 'user',
          content: `Create practice problems for ${topic}`
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    })

    const problems = completion.choices[0]?.message?.content || ''
    return problems.split('\n').filter(Boolean).slice(0, count)
  } catch (error) {
    console.error('Practice problem generation error:', error)
    return [`Practice problem: Study ${topic} concepts`]
  }
}

export async function summarizeConversation(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const openai = getOpenAIClient()
    
    const conversationText = messages
      .map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
      .join('\n')
      .substring(0, 3000)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Summarize this tutoring conversation in 2-3 sentences, highlighting key topics discussed and main learning points.'
        },
        {
          role: 'user',
          content: conversationText
        }
      ],
      temperature: 0.5,
      max_tokens: 150
    })

    return completion.choices[0]?.message?.content || 'Study session summary'
  } catch (error) {
    console.error('Summarization error:', error)
    return 'Study session completed'
  }
}