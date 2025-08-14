# Daily Prompt Engineering

매일 업데이트되는 프롬프트 엔지니어링 최신 지식을 한국어로 제공하는 큐레이션 서비스

## 🚀 Features

- 6개 주요 소스에서 자동 수집 (OpenAI, Anthropic, Google AI, LangChain, Hugging Face, Reddit)
- Gemini API를 통한 자동 번역 및 요약
- 실용적인 프롬프트 예시 제공
- 매일 2회 자동 업데이트 (오전 9시, 오후 9시)

## 📦 Setup

### 1. 환경 변수 설정
```bash
cp .env.example .env
```

GEMINI_API_KEY를 [Google AI Studio](https://aistudio.google.com/apikey)에서 발급받아 설정

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 크롤러 테스트
```bash
cd crawler
pip install -r requirements.txt
python crawler.py
```

## 🚀 Deployment

### Vercel 배포
1. [Vercel](https://vercel.com)에 로그인
2. GitHub 저장소 연결
3. 환경 변수 설정 (GEMINI_API_KEY)
4. Deploy

### GitHub Actions 설정
1. GitHub 저장소 Settings → Secrets and variables → Actions
2. New repository secret 추가: `GEMINI_API_KEY`
3. Actions 탭에서 워크플로우 활성화

## 📝 License

MIT
