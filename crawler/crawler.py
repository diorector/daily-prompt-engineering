#!/usr/bin/env python3
import os
import json
import uuid
import time
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup
import feedparser
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

SOURCES = [
    {
        "name": "OpenAI Cookbook",
        "url": "https://cookbook.openai.com/",
        "type": "docs",
        "category": "official_docs"
    },
    {
        "name": "Anthropic Docs",
        "url": "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
        "type": "docs",
        "category": "official_docs"
    },
    {
        "name": "Google AI Prompting",
        "url": "https://ai.google.dev/gemini-api/docs/prompting-strategies",
        "type": "docs",
        "category": "official_docs"
    },
    {
        "name": "LangChain Blog",
        "url": "https://blog.langchain.dev/rss/",
        "type": "rss",
        "category": "blog"
    },
    {
        "name": "Hugging Face Blog",
        "url": "https://huggingface.co/blog/feed.xml",
        "type": "rss",
        "category": "blog"
    },
    {
        "name": "r/LocalLLaMA",
        "url": "https://www.reddit.com/r/LocalLLaMA.json",
        "type": "reddit",
        "category": "community"
    }
]

class PromptCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None
            print("Warning: GEMINI_API_KEY not found. Translation will be skipped.")
    
    def generate_id(self, url: str) -> str:
        return hashlib.md5(f"{url}{datetime.now().isoformat()}".encode()).hexdigest()[:12]
    
    def crawl_docs(self, source: Dict) -> List[Dict]:
        articles = []
        try:
            response = self.session.get(source['url'], timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            links = soup.find_all('a', href=True)[:5]
            
            for link in links:
                title = link.get_text(strip=True)
                if title and len(title) > 10:
                    article = {
                        'id': self.generate_id(link['href']),
                        'source': source['name'],
                        'source_category': source['category'],
                        'original_url': link['href'] if link['href'].startswith('http') else source['url'] + link['href'],
                        'title_original': title,
                        'crawled_at': datetime.now().isoformat(),
                        'published_at': datetime.now().isoformat()
                    }
                    articles.append(article)
        except Exception as e:
            print(f"Error crawling {source['name']}: {e}")
        
        return articles
    
    def crawl_rss(self, source: Dict) -> List[Dict]:
        articles = []
        try:
            feed = feedparser.parse(source['url'])
            
            for entry in feed.entries[:5]:
                article = {
                    'id': self.generate_id(entry.link),
                    'source': source['name'],
                    'source_category': source['category'],
                    'original_url': entry.link,
                    'title_original': entry.title,
                    'content_original': entry.get('summary', '')[:500],
                    'crawled_at': datetime.now().isoformat(),
                    'published_at': entry.get('published', datetime.now().isoformat())
                }
                articles.append(article)
        except Exception as e:
            print(f"Error crawling RSS {source['name']}: {e}")
        
        return articles
    
    def crawl_reddit(self, source: Dict) -> List[Dict]:
        articles = []
        try:
            response = self.session.get(source['url'], timeout=10)
            data = response.json()
            
            for post in data['data']['children'][:5]:
                post_data = post['data']
                if 'prompt' in post_data['title'].lower() or 'llm' in post_data['title'].lower():
                    article = {
                        'id': self.generate_id(post_data['url']),
                        'source': source['name'],
                        'source_category': source['category'],
                        'original_url': f"https://reddit.com{post_data['permalink']}",
                        'title_original': post_data['title'],
                        'content_original': post_data.get('selftext', '')[:500],
                        'crawled_at': datetime.now().isoformat(),
                        'published_at': datetime.fromtimestamp(post_data['created_utc']).isoformat(),
                        'score': post_data.get('score', 0)
                    }
                    articles.append(article)
        except Exception as e:
            print(f"Error crawling Reddit {source['name']}: {e}")
        
        return articles
    
    def translate_and_summarize(self, article: Dict) -> Dict:
        if not self.model:
            article['title_kr'] = article['title_original']
            article['content_kr'] = article.get('content_original', '')
            article['summary_kr'] = '번역 API 키가 설정되지 않았습니다.'
            article['key_insights'] = []
            article['prompt_examples'] = {'for_developers': [], 'for_general': []}
            return article
        
        try:
            prompt = f"""
다음 프롬프트 엔지니어링 관련 콘텐츠를 한국어로 번역하고 요약해주세요:

제목: {article['title_original']}
내용: {article.get('content_original', '')[:1000]}

다음 형식의 JSON으로 응답해주세요:
{{
    "title_kr": "한글 제목",
    "content_kr": "한글 번역 (최대 500자)",
    "summary_kr": "핵심 요약 (100자 이내)",
    "key_insights": ["핵심 인사이트 1", "핵심 인사이트 2", "핵심 인사이트 3"],
    "prompt_examples": {{
        "for_developers": ["개발자용 프롬프트 예시"],
        "for_general": ["일반 사용자용 프롬프트 예시"]
    }},
    "tags": ["태그1", "태그2"],
    "llm_provider": ["관련 LLM 제공자"]
}}
"""
            
            response = self.model.generate_content(prompt)
            result = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
            
            article.update(result)
            article['translated_at'] = datetime.now().isoformat()
            
        except Exception as e:
            print(f"Translation error for {article['title_original']}: {e}")
            article['title_kr'] = article['title_original']
            article['content_kr'] = article.get('content_original', '')
            article['summary_kr'] = '번역 실패'
            article['key_insights'] = []
            article['prompt_examples'] = {'for_developers': [], 'for_general': []}
            article['tags'] = []
            article['llm_provider'] = []
        
        return article
    
    def crawl_all(self) -> List[Dict]:
        all_articles = []
        
        for source in SOURCES:
            print(f"Crawling {source['name']}...")
            
            if source['type'] == 'docs':
                articles = self.crawl_docs(source)
            elif source['type'] == 'rss':
                articles = self.crawl_rss(source)
            elif source['type'] == 'reddit':
                articles = self.crawl_reddit(source)
            else:
                continue
            
            for article in articles:
                article = self.translate_and_summarize(article)
                all_articles.append(article)
                time.sleep(1)
        
        return all_articles
    
    def save_articles(self, articles: List[Dict]):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        os.makedirs('data', exist_ok=True)
        
        filename = f'data/articles_{timestamp}.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        
        with open('data/latest.json', 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        
        print(f"Saved {len(articles)} articles to {filename}")

def main():
    crawler = PromptCrawler()
    articles = crawler.crawl_all()
    crawler.save_articles(articles)
    print(f"Crawling completed. Total articles: {len(articles)}")

if __name__ == "__main__":
    main()