# GitHub 저장소 설정 가이드

## 1. GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인
2. 우측 상단 '+' 버튼 → 'New repository' 클릭
3. 다음 정보 입력:
   - Repository name: `daily-prompt-engineering`
   - Description: `매일 업데이트되는 프롬프트 엔지니어링 큐레이션 서비스`
   - Public 선택
   - **DO NOT** initialize with README (이미 있음)
4. 'Create repository' 클릭

## 2. 로컬 저장소를 GitHub에 연결

저장소 생성 후 나타나는 페이지에서 아래 명령어를 복사하여 실행:

```bash
cd daily-prompt-engineering

# GitHub 원격 저장소 추가 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/daily-prompt-engineering.git

# main 브랜치로 이름 변경
git branch -M main

# GitHub에 푸시
git push -u origin main
```

## 3. GitHub Secrets 설정 (크롤러 자동화용)

1. GitHub 저장소 페이지에서 Settings 탭 클릭
2. 좌측 메뉴에서 Secrets and variables → Actions 클릭
3. 'New repository secret' 버튼 클릭
4. 다음 정보 입력:
   - Name: `GEMINI_API_KEY`
   - Secret: `AIzaSyDm7RKtHRZtuENXAEXNeuwSO9U1lLVaKps`
5. 'Add secret' 클릭

## 4. GitHub Actions 활성화

1. GitHub 저장소의 Actions 탭 클릭
2. 'I understand my workflows, go ahead and enable them' 클릭
3. Daily Crawler 워크플로우가 활성화되었는지 확인

## 5. Vercel 배포

1. [Vercel](https://vercel.com) 로그인
2. 'Add New...' → 'Project' 클릭
3. GitHub 저장소 `daily-prompt-engineering` import
4. Environment Variables 설정:
   - `GEMINI_API_KEY`: 위와 동일한 API 키
5. 'Deploy' 클릭

## 완료!

- GitHub Actions는 매일 한국 시간 오전 9시, 오후 9시에 자동 실행됩니다
- 수동 실행: Actions 탭 → Daily Crawler → Run workflow
- Vercel URL에서 사이트 확인 가능