// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
  thumbnail?: string;
}

// Student Profile
export interface StudentProfile extends CosmicObject {
  type: 'student-profiles';
  metadata: {
    full_name: string;
    email: string;
    profile_picture?: {
      url: string;
      imgix_url: string;
    };
    education_level?: {
      key: string;
      value: string;
    };
    primary_subjects?: string;
    learning_style?: {
      key: string;
      value: string;
    };
    study_goals?: string;
    ai_tutor_settings?: Record<string, any>;
    total_study_hours?: number;
    documents_uploaded?: number;
    notes_created?: number;
    learning_streak_days?: number;
    account_type?: {
      key: string;
      value: string;
    };
    notification_preferences?: Record<string, any>;
    join_date?: string;
    last_active?: string;
  };
}

// Study Material
export interface StudyMaterial extends CosmicObject {
  type: 'study-materials';
  metadata: {
    document_title: string;
    document_type?: {
      key: string;
      value: string;
    };
    subject?: string;
    upload_file?: {
      url: string;
      imgix_url: string;
    };
    extracted_content?: string;
    content_chunks?: Array<{
      chunk_id: number;
      content: string;
    }>;
    key_concepts?: string[];
    source_url?: string;
    author?: string;
    publication_date?: string;
    page_count?: number;
    difficulty_level?: {
      key: string;
      value: string;
    };
    tags?: string;
    student_owner?: StudentProfile | string;
    processing_status?: {
      key: string;
      value: string;
    };
  };
}

// Note
export interface Note extends CosmicObject {
  type: 'notes';
  metadata: {
    note_title: string;
    note_type?: {
      key: string;
      value: string;
    };
    content?: string;
    source_materials?: StudyMaterial[];
    key_takeaways?: string[];
    study_questions?: string[];
    subject?: string;
    tags?: string;
    priority?: {
      key: string;
      value: string;
    };
    ai_generated?: boolean;
    student_owner?: StudentProfile | string;
    created_date?: string;
    last_reviewed?: string;
    review_count?: number;
  };
}

// Study Session
export interface StudySession extends CosmicObject {
  type: 'study-sessions';
  metadata: {
    session_title: string;
    session_type?: {
      key: string;
      value: string;
    };
    related_materials?: StudyMaterial[];
    conversation_history?: Array<{
      timestamp: string;
      type: string;
      message: string;
    }>;
    session_notes?: Note[];
    key_insights?: string;
    questions_asked?: number;
    comprehension_score?: number;
    duration_minutes?: number;
    student?: StudentProfile | string;
    session_date?: string;
    status?: {
      key: string;
      value: string;
    };
    follow_up_suggested?: boolean;
  };
}

// Study Project
export interface StudyProject extends CosmicObject {
  type: 'study-projects';
  metadata: {
    project_name: string;
    project_type?: {
      key: string;
      value: string;
    };
    description?: string;
    study_materials?: StudyMaterial[];
    project_notes?: Note[];
    study_sessions?: StudySession[];
    learning_goals?: string[];
    progress_percentage?: number;
    target_date?: string;
    study_schedule?: Record<string, any>;
    student_owner?: StudentProfile | string;
    collaborators?: StudentProfile[];
    project_status?: {
      key: string;
      value: string;
    };
    priority?: {
      key: string;
      value: string;
    };
  };
}

// API Response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Error helper
export function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}