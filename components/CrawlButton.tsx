'use client'

import { useState } from 'react'

export default function CrawlButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleCrawl = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || '크롤링이 시작되었습니다.')
        // 3초 후 페이지 새로고침
        if (data.success && !data.message.includes('workflow')) {
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        }
      } else {
        setMessage(data.error || '크롤링 실행에 실패했습니다.')
      }
    } catch (error) {
      setMessage('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleCrawl}
        disabled={loading}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all
          ${loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            크롤링 중...
          </span>
        ) : (
          '🔄 수동 크롤링 실행'
        )}
      </button>
      
      {message && (
        <div className={`
          text-sm px-3 py-1 rounded-md
          ${message.includes('실패') || message.includes('오류') 
            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' 
            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
          }
        `}>
          {message}
        </div>
      )}
    </div>
  )
}