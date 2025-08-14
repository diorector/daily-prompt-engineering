export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤖</span>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Daily Prompt
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              카테고리
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              검색
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              북마크
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}