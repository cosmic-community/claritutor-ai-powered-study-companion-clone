import { createBucketClient } from '@cosmicjs/sdk';
import { hasStatus } from '@/types';

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
});

// Fetch all students
export async function getStudents() {
  try {
    const response = await cosmic.objects
      .find({ type: 'student-profiles' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(1);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching students:', error);
    return [];
  }
}

// Fetch single student
export async function getStudent(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'student-profiles',
        slug
      })
      .depth(2);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch all study materials
export async function getStudyMaterials() {
  try {
    const response = await cosmic.objects
      .find({ type: 'study-materials' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(2);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching materials:', error);
    return [];
  }
}

// Fetch single study material
export async function getStudyMaterial(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'study-materials',
        slug
      })
      .depth(2);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch all notes
export async function getNotes() {
  try {
    const response = await cosmic.objects
      .find({ type: 'notes' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(2);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching notes:', error);
    return [];
  }
}

// Fetch single note
export async function getNote(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'notes',
        slug
      })
      .depth(2);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch all study sessions
export async function getStudySessions() {
  try {
    const response = await cosmic.objects
      .find({ type: 'study-sessions' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(2);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching sessions:', error);
    return [];
  }
}

// Fetch single study session
export async function getStudySession(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'study-sessions',
        slug
      })
      .depth(2);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Fetch all study projects
export async function getStudyProjects() {
  try {
    const response = await cosmic.objects
      .find({ type: 'study-projects' })
      .props(['id', 'title', 'slug', 'metadata', 'thumbnail'])
      .depth(2);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Fetch single study project
export async function getStudyProject(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'study-projects',
        slug
      })
      .depth(2);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Get projects by student
export async function getProjectsByStudent(studentId: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'study-projects',
        'metadata.student_owner': studentId 
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(2);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    console.error('Error fetching student projects:', error);
    return [];
  }
}