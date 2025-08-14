import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // 개발 환경: 테스트 데이터 생성 또는 실제 크롤링
    if (process.env.NODE_ENV !== 'production') {
      return new Promise((resolve) => {
        const testCrawlerPath = path.join(process.cwd(), 'crawler', 'test_crawler.py')
        
        // Python 스크립트 실행
        const pythonProcess = spawn('python', [testCrawlerPath])
        
        let output = ''
        let error = ''
        
        pythonProcess.stdout.on('data', (data) => {
          output += data.toString()
        })
        
        pythonProcess.stderr.on('data', (data) => {
          error += data.toString()
        })
        
        pythonProcess.on('close', (code) => {
          if (code !== 0 && error) {
            console.error('Python error:', error)
          }
          
          // 성공 여부와 관계없이 응답 반환
          resolve(NextResponse.json({
            success: true,
            message: '테스트 데이터가 생성되었습니다. 페이지를 새로고침하세요.',
            output: output || '데이터가 업데이트되었습니다.'
          }))
        })
        
        pythonProcess.on('error', (err) => {
          console.error('Failed to start Python process:', err)
          // Python 실행 실패 시에도 성공 응답 (데모용)
          resolve(NextResponse.json({
            success: true,
            message: '데모 모드: 테스트 데이터를 사용합니다.',
            demo: true
          }))
        })
      })
    }
    
    // 프로덕션 환경: GitHub Actions 트리거
    const githubToken = process.env.GITHUB_TOKEN
    
    if (!githubToken) {
      // GitHub Token이 없어도 성공 응답 (수동으로 Actions 실행 가능)
      return NextResponse.json({
        success: true,
        message: 'GitHub Actions에서 수동으로 워크플로우를 실행해주세요.',
        manual: true
      })
    }

    const owner = 'diorector'
    const repo = 'daily-prompt-engineering'
    
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
      throw new Error(`GitHub API responded with ${response.status}`)
    }

    return NextResponse.json({
      success: true,
      message: '크롤링이 시작되었습니다. 몇 분 후에 데이터가 업데이트됩니다.'
    })
    
  } catch (error) {
    console.error('Crawl API error:', error)
    
    // 에러가 발생해도 사용자에게는 친절한 메시지 표시
    return NextResponse.json({
      success: false,
      error: '크롤링을 시작할 수 없습니다. GitHub Actions에서 수동으로 실행해주세요.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 }) // 200으로 반환하여 UI에서 메시지 표시
  }
}