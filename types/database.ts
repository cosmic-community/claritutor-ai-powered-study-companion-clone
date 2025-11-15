export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          email: string
          education_level: string | null
          primary_subjects: string[] | null
          learning_style: string | null
          study_goals: string | null
          ai_tutor_settings: Record<string, any> | null
          total_study_hours: number
          documents_uploaded: number
          notes_created: number
          learning_streak_days: number
          account_type: string
          notification_preferences: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          subject: string
          tutor_persona: string
          is_favorite: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          tokens: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          duration: number
          session_type: string
          focus_quality: number
          subject: string | null
          notes: string | null
          completed_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['study_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['study_sessions']['Insert']>
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          badge_type: string
          badge_tier: 'bronze' | 'silver' | 'gold' | 'platinum'
          earned_at: string
          progress_data: Record<string, any> | null
        }
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'earned_at'>
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>
      }
    }
  }
}