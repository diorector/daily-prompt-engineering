import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { Article } from '@/lib/types/article'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'latest.json')
    
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      const articles: Article[] = JSON.parse(data)
      
      const sortedArticles = articles.sort((a, b) => 
        new Date(b.crawled_at).getTime() - new Date(a.crawled_at).getTime()
      )
      
      return NextResponse.json(sortedArticles)
    } catch (fileError) {
      const mockArticles: Article[] = [
        {
          id: "demo-1",
          source: "OpenAI Cookbook",
          source_category: "official_docs",
          original_url: "https://cookbook.openai.com/",
          title_original: "Best practices for prompt engineering with OpenAI API",
          title_kr: "OpenAI API를 위한 프롬프트 엔지니어링 모범 사례",
          content_original: "Learn how to give clear and effective instructions to GPT models...",
          content_kr: "GPT 모델에 명확하고 효과적인 지시를 제공하는 방법을 배워보세요...",
          summary_kr: "효과적인 프롬프트 작성을 위한 OpenAI의 공식 가이드라인",
          key_insights: [
            "명확하고 구체적인 지시 사항 제공이 핵심",
            "예시를 포함하면 결과 품질이 향상됨",
            "단계별 접근 방식이 복잡한 작업에 효과적"
          ],
          prompt_examples: {
            for_developers: [
              "# 코드 리뷰 요청\n다음 Python 코드를 검토하고 개선점을 제안해주세요:\n1. 성능 최적화\n2. 코드 가독성\n3. 잠재적 버그",
              "# 단위 테스트 생성\n다음 함수에 대한 pytest 단위 테스트를 작성해주세요. edge case도 포함해주세요."
            ],
            for_general: [
              "다음 주제에 대해 초보자도 이해할 수 있게 설명해주세요: [주제]",
              "다음 텍스트를 3줄로 요약해주세요: [텍스트]"
            ]
          },
          tags: ["GPT-4", "프롬프트", "베스트프랙티스"],
          llm_provider: ["OpenAI"],
          published_at: new Date().toISOString(),
          crawled_at: new Date().toISOString(),
          translated_at: new Date().toISOString(),
          score: 95
        },
        {
          id: "demo-2",
          source: "Anthropic Docs",
          source_category: "official_docs",
          original_url: "https://docs.anthropic.com/",
          title_original: "Chain of Thought Prompting",
          title_kr: "연쇄 사고 프롬프팅 기법",
          content_original: "Chain of thought prompting encourages the model to break down complex problems...",
          content_kr: "연쇄 사고 프롬프팅은 모델이 복잡한 문제를 단계별로 분해하도록 유도합니다...",
          summary_kr: "복잡한 추론을 위한 단계별 사고 과정 유도 기법",
          key_insights: [
            "\"단계별로 생각해봅시다\"라는 문구가 효과적",
            "수학 문제와 논리 퍼즐에 특히 유용",
            "중간 과정을 명시하면 정확도 향상"
          ],
          prompt_examples: {
            for_developers: [
              "이 알고리즘의 시간 복잡도를 분석해주세요. 단계별로 설명해주세요:\n1. 각 연산의 복잡도 파악\n2. 전체 복잡도 계산\n3. Big-O 표기법으로 표현"
            ],
            for_general: [
              "다음 문제를 단계별로 해결해주세요:\n[문제 설명]\n각 단계에서 어떤 사고 과정을 거쳤는지 설명해주세요."
            ]
          },
          tags: ["Claude", "CoT", "추론"],
          llm_provider: ["Anthropic"],
          published_at: new Date().toISOString(),
          crawled_at: new Date().toISOString(),
          translated_at: new Date().toISOString(),
          score: 92
        }
      ]
      
      return NextResponse.json(mockArticles)
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}