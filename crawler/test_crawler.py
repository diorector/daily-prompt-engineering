#!/usr/bin/env python3
import json
import os
from datetime import datetime

def create_test_data():
    """Create test data without actual crawling"""
    test_articles = [
        {
            "id": "test-001",
            "source": "OpenAI Cookbook",
            "source_category": "official_docs",
            "original_url": "https://cookbook.openai.com/examples/how_to_format_inputs_to_chatgpt_models",
            "title_original": "How to format inputs to ChatGPT models",
            "title_kr": "ChatGPT 모델에 입력을 포맷하는 방법",
            "content_original": "ChatGPT models like gpt-3.5-turbo and gpt-4 can be used for a variety of tasks...",
            "content_kr": "gpt-3.5-turbo와 gpt-4 같은 ChatGPT 모델은 다양한 작업에 사용될 수 있습니다...",
            "summary_kr": "ChatGPT API 사용 시 효과적인 입력 포맷팅 방법을 설명합니다.",
            "key_insights": [
                "시스템 메시지로 모델의 행동을 정의하세요",
                "사용자와 어시스턴트 메시지를 명확히 구분하세요",
                "컨텍스트 관리를 위해 대화 히스토리를 포함하세요"
            ],
            "prompt_examples": {
                "for_developers": [
                    "system: You are a helpful code reviewer specialized in Python.\nuser: Review this function for performance improvements:\n```python\ndef find_duplicates(lst):\n    return [x for x in lst if lst.count(x) > 1]\n```"
                ],
                "for_general": [
                    "다음 텍스트를 요약해주세요. 핵심 포인트 3개를 bullet point로 정리해주세요:\n[텍스트 내용]"
                ]
            },
            "tags": ["ChatGPT", "API", "포맷팅"],
            "llm_provider": ["OpenAI"],
            "published_at": datetime.now().isoformat(),
            "crawled_at": datetime.now().isoformat(),
            "translated_at": datetime.now().isoformat(),
            "score": 95
        },
        {
            "id": "test-002",
            "source": "Anthropic Docs",
            "source_category": "official_docs",
            "original_url": "https://docs.anthropic.com/claude/docs/constructing-a-prompt",
            "title_original": "Constructing effective prompts",
            "title_kr": "효과적인 프롬프트 구성하기",
            "content_original": "Claude responds best to clear, direct instructions...",
            "content_kr": "Claude는 명확하고 직접적인 지시에 가장 잘 반응합니다...",
            "summary_kr": "Claude AI를 위한 효과적인 프롬프트 작성 가이드",
            "key_insights": [
                "XML 태그를 사용하여 구조화된 입력 제공",
                "예시를 포함하여 원하는 출력 형식 명시",
                "복잡한 작업은 단계별로 분해"
            ],
            "prompt_examples": {
                "for_developers": [
                    "<task>\n코드의 보안 취약점을 찾아주세요.\n</task>\n\n<code>\n[코드 내용]\n</code>\n\n<requirements>\n- OWASP Top 10 기준으로 검토\n- 각 취약점에 대한 수정 방안 제시\n</requirements>"
                ],
                "for_general": [
                    "다음 제품 리뷰를 분석해주세요:\n\n<review>\n[리뷰 내용]\n</review>\n\n긍정적/부정적 측면을 각각 정리해주세요."
                ]
            },
            "tags": ["Claude", "프롬프트", "구조화"],
            "llm_provider": ["Anthropic"],
            "published_at": datetime.now().isoformat(),
            "crawled_at": datetime.now().isoformat(),
            "translated_at": datetime.now().isoformat(),
            "score": 92
        },
        {
            "id": "test-003",
            "source": "LangChain Blog",
            "source_category": "blog",
            "original_url": "https://blog.langchain.dev/few-shot-prompting",
            "title_original": "Few-shot prompting with LangChain",
            "title_kr": "LangChain을 활용한 Few-shot 프롬프팅",
            "content_original": "Few-shot prompting is a powerful technique...",
            "content_kr": "Few-shot 프롬프팅은 강력한 기법입니다...",
            "summary_kr": "예시 기반 학습을 통한 LLM 성능 향상 방법",
            "key_insights": [
                "2-5개의 예시가 최적의 성능 제공",
                "예시는 다양하고 대표적이어야 함",
                "동적 예시 선택으로 정확도 향상"
            ],
            "prompt_examples": {
                "for_developers": [
                    "# SQL 쿼리 생성 예시\n\nExample 1:\nQuestion: 지난 달 매출 총액은?\nSQL: SELECT SUM(amount) FROM sales WHERE date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)\n\nExample 2:\nQuestion: 가장 많이 팔린 상품 TOP 5는?\nSQL: SELECT product_name, COUNT(*) as count FROM sales GROUP BY product_name ORDER BY count DESC LIMIT 5\n\nNow generate SQL for: [새로운 질문]"
                ],
                "for_general": [
                    "감정 분석 예시:\n\n텍스트: \"이 제품 정말 최고예요!\"\n감정: 긍정적\n\n텍스트: \"배송이 너무 늦어서 실망했습니다.\"\n감정: 부정적\n\n텍스트: \"[분석할 텍스트]\"\n감정:"
                ]
            },
            "tags": ["LangChain", "Few-shot", "예시학습"],
            "llm_provider": ["OpenAI", "Anthropic"],
            "published_at": datetime.now().isoformat(),
            "crawled_at": datetime.now().isoformat(),
            "translated_at": datetime.now().isoformat(),
            "score": 88
        }
    ]
    
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Save to latest.json
    with open('data/latest.json', 'w', encoding='utf-8') as f:
        json.dump(test_articles, f, ensure_ascii=False, indent=2)
    
    print(f"Created test data with {len(test_articles)} articles")
    print("Saved to data/latest.json")

if __name__ == "__main__":
    create_test_data()