import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    // 개발 환경에서만 허용 (프로덕션에서는 GitHub Actions 사용)
    if (process.env.NODE_ENV === 'production') {
      // GitHub Actions API를 통해 워크플로우 트리거
      const githubToken = process.env.GITHUB_TOKEN
      const owner = 'diorector'
      const repo = 'daily-prompt-engineering'
      
      if (!githubToken) {
        return NextResponse.json(
          { error: 'GitHub token not configured' },
          { status: 500 }
        )
      }

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/actions/workflows/crawler.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ref: 'main'
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to trigger GitHub workflow')
      }

      return NextResponse.json({
        success: true,
        message: 'Crawling workflow triggered. Data will be updated in a few minutes.'
      })
    } else {
      // 개발 환경: 로컬에서 크롤러 실행
      const crawlerPath = path.join(process.cwd(), 'crawler', 'crawler.py')
      
      try {
        const { stdout, stderr } = await execAsync(`python "${crawlerPath}"`)
        
        if (stderr && !stderr.includes('Warning')) {
          throw new Error(stderr)
        }

        return NextResponse.json({
          success: true,
          message: 'Crawling completed successfully',
          output: stdout
        })
      } catch (error) {
        console.error('Crawler execution error:', error)
        
        // 테스트 데이터 생성 (크롤러 실행 실패 시)
        const testCrawlerPath = path.join(process.cwd(), 'crawler', 'test_crawler.py')
        try {
          await execAsync(`python "${testCrawlerPath}"`)
          return NextResponse.json({
            success: true,
            message: 'Test data generated (crawler failed)',
            test: true
          })
        } catch (testError) {
          throw new Error('Failed to run crawler and test data generation')
        }
      }
    }
  } catch (error) {
    console.error('Crawl API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to trigger crawling',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}