# Claritutor - AI-Powered Study Companion

![Claritutor Learning Platform](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=300&fit=crop&auto=format,compress)

A comprehensive AI-powered educational platform that transforms how students learn from their study materials. Built with Next.js 16 and powered by Cosmic CMS.

## ✨ Features

- **📚 Document Management** - Upload and organize study materials (PDFs, research papers, textbooks)
- **🤖 AI-Powered Notes** - Automatically generate structured notes from uploaded content
- **💬 Interactive Learning** - Engage in Q&A sessions with AI based on your materials
- **📊 Progress Tracking** - Monitor study hours, comprehension scores, and learning streaks
- **🎯 Project Organization** - Group materials into focused study projects
- **👥 Student Profiles** - Personalized learning experiences tailored to each student

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=6918305be7349beda291e3b7&clone_repository=691833eee7349beda291e43c)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Claritutor is a fully functional AI-powered study companion that combines intelligent tutoring with smart note-taking and source-based learning. This is a complete educational tool that helps students learn from their study materials, create organized notes, and get AI-powered explanations. CORE LEARNING FEATURES: Source-Based Learning System, Smart Note Generation, Interactive Q&A from Sources, Study Guide Creation, Multi-Source Synthesis. TECHNICAL IMPLEMENTATION: Document Processing System, AI Context Management, Real-Time Collaboration Features, Advanced Search & Retrieval. STUDENT WORKFLOW INTEGRATION: Unified Learning Interface, Project-Based Organization, Progress Tracking & Insights, Export & Integration."

### Code Generation Prompt

> "Based on the content model I created for Claritutor, now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🚀 Technologies

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **CMS:** Cosmic
- **Icons:** Lucide React
- **Charts:** Recharts
- **Type Safety:** TypeScript
- **Package Manager:** Bun

## 📦 Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- Cosmic account with configured bucket
- Environment variables set up

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd claritutor
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
claritutor/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── students/          # Student profiles
│   ├── materials/         # Study materials
│   ├── notes/             # Notes section
│   ├── projects/          # Study projects
│   └── sessions/          # Study sessions
├── components/            # React components
├── lib/                   # Utilities and API
├── types.ts              # TypeScript definitions
└── public/               # Static assets
```

## 🔧 Cosmic SDK Usage

This app demonstrates advanced Cosmic SDK patterns:

```typescript
// Fetching with depth for nested objects
const projects = await cosmic.objects
  .find({ type: 'study-projects' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(2);

// Error handling for empty results
try {
  const response = await cosmic.objects.find({ type: 'notes' });
  return response.objects;
} catch (error) {
  if (error.status === 404) return [];
  throw error;
}
```

## 🎯 Cosmic CMS Integration

The app uses these Cosmic object types:

1. **Student Profiles** - User accounts with learning preferences
2. **Study Materials** - Uploaded documents and resources
3. **Notes** - AI-generated and manual study notes
4. **Study Sessions** - Learning session records with Q&A history
5. **Study Projects** - Organized collections of materials and notes

## 🚀 Deployment Options

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

Remember to set your environment variables in your deployment platform.

## 📝 License

MIT License - feel free to use this project for your own learning platform!

<!-- README_END -->