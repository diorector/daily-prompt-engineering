'use client'

import { useState } from 'react'
import { Article } from '@/lib/types/article'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false)

  const categoryColors = {
    official_docs: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    blog: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    research: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    community: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[article.source_category]}`}>
          {article.source_category.replace('_', ' ')}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {article.source}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {article.title_kr}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {article.summary_kr}
      </p>

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
      >
        {expanded ? '접기' : '더보기'}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {article.key_insights && article.key_insights.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">핵심 인사이트</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {article.key_insights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {article.prompt_examples && (
            <div className="mb-4">
              <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">프롬프트 예시</h4>
              {article.prompt_examples.for_developers?.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">개발자용:</p>
                  {article.prompt_examples.for_developers.map((prompt, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs mb-2">
                      <pre className="whitespace-pre-wrap">{prompt}</pre>
                      <button
                        onClick={() => copyPrompt(prompt)}
                        className="mt-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        복사
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <a
            href={article.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            원문 보기 →
          </a>
        </div>
      )}
    </div>
  )
}