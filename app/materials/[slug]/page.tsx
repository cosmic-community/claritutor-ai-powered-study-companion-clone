// app/materials/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getStudyMaterial } from '@/lib/cosmic'
import { FileText, Download, Calendar, User, BookOpen, Tag } from 'lucide-react'
import type { StudyMaterial } from '@/types'

export default async function MaterialDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const material = await getStudyMaterial(slug) as StudyMaterial | null
  
  if (!material) {
    notFound()
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {material.metadata?.document_title || material.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {material.metadata?.document_type?.value || 'Document'}
              </span>
              {material.metadata?.difficulty_level && (
                <span className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-medium">
                  {material.metadata.difficulty_level.value}
                </span>
              )}
              {material.metadata?.processing_status && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  material.metadata.processing_status.key === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {material.metadata.processing_status.value}
                </span>
              )}
            </div>
          </div>

          {/* Document Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              {material.metadata?.subject && (
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Subject: </span>
                  <span className="font-medium ml-1">{material.metadata.subject}</span>
                </div>
              )}
              {material.metadata?.author && (
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Author: </span>
                  <span className="font-medium ml-1">{material.metadata.author}</span>
                </div>
              )}
              {material.metadata?.publication_date && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Published: </span>
                  <span className="font-medium ml-1">{material.metadata.publication_date}</span>
                </div>
              )}
              {material.metadata?.page_count !== undefined && (
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">Pages: </span>
                  <span className="font-medium ml-1">{material.metadata.page_count}</span>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Content */}
          {material.metadata?.extracted_content && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Content Preview</h2>
              <div className="bg-gray-50 rounded-lg p-6 prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: material.metadata.extracted_content.replace(/\n/g, '<br />') }} />
              </div>
            </div>
          )}

          {/* Key Concepts */}
          {material.metadata?.key_concepts && material.metadata.key_concepts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Concepts</h2>
              <div className="flex flex-wrap gap-2">
                {material.metadata.key_concepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {material.metadata?.tags && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Tags
              </h2>
              <p className="text-gray-600">{material.metadata.tags}</p>
            </div>
          )}

          {/* Download Button */}
          {material.metadata?.upload_file?.url && (
            <div className="mt-8 pt-8 border-t">
              <a
                href={material.metadata.upload_file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Original Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}