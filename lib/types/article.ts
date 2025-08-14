export interface Article {
  id: string;
  source: string;
  source_category: 'official_docs' | 'blog' | 'research' | 'community';
  original_url: string;
  title_original: string;
  title_kr: string;
  content_original: string;
  content_kr: string;
  summary_kr: string;
  key_insights: string[];
  prompt_examples: {
    for_developers: string[];
    for_general: string[];
  };
  tags: string[];
  llm_provider: string[];
  published_at: string;
  crawled_at: string;
  translated_at: string;
  score: number;
}

export interface CrawlSource {
  name: string;
  url: string;
  selector?: string;
  category: Article['source_category'];
}