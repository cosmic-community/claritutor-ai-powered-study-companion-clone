import Link from 'next/link'
import { getStudyMaterials } from '@/lib/cosmic'
import { FileText, Download, Calendar, User } from 'lucide-react'
import type { StudyMaterial } from '@/types'

export default async function MaterialsPage() {
  const materials = await getStudyMaterials() as StudyMaterial[]

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Materials</h1>
          <p className="text-lg text-gray-600">
            Browse uploaded documents and research papers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <Link
              key={material.id}
              href={`/materials/${material.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {material.metadata?.document_title || material.title}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                    {material.metadata?.document_type?.value || 'Document'}
                  </span>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>

              {material.metadata?.subject && (
                <p className="text-sm text-gray-600 mb-3">
                  Subject: <span className="font-medium">{material.metadata.subject}</span>
                </p>
              )}

              {material.metadata?.key_concepts && material.metadata.key_concepts.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {material.metadata.key_concepts.slice(0, 3).map((concept, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {concept}
                    </span>
                  ))}
                  {material.metadata.key_concepts.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{material.metadata.key_concepts.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {material.metadata?.author || 'Unknown'}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {material.metadata?.publication_date || 'N/A'}
                </div>
              </div>

              {material.metadata?.processing_status && (
                <div className="mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    material.metadata.processing_status.key === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {material.metadata.processing_status.value}
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {materials.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No study materials uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}