import ArticleList from '@/components/ArticleList'
import Header from '@/components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Daily Prompt Engineering
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            매일 업데이트되는 프롬프트 엔지니어링 최신 지식을 한국어로 만나보세요
          </p>
        </div>
        <ArticleList />
      </main>
    </div>
  )
}
