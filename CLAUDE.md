# CLAUDE.md — 03driver (기사용 웹앱)

This file guides Claude Code when working in the `03driver` module.

## 개요
- Bucket 수거 서비스의 **기사(driver)용 웹 애플리케이션**입니다.
- **Next.js 15.1** (App Router) + **React 19** + **TypeScript**.
- 스타일링: **Tailwind CSS v3**.
- 인증: **Auth.js** (`auth.ts`, `src/next-auth.d.ts`).
- API 클라이언트는 **Orval**로 `01api`의 OpenAPI 스펙에서 생성합니다 (`orval.config.ts`).
- 운영: **PM2** (`ecosystem.config.js`).

## 디렉터리 구조
```
03driver/
├── app/               # Next.js App Router 라우트
│   ├── allowance/     # 수당
│   ├── pickups/       # 수거 목록/처리
│   ├── login/
│   ├── health/        # 헬스체크
│   ├── api/           # route handlers
│   ├── layout.tsx
│   └── page.tsx
├── components/        # 공용 컴포넌트 (Layout, ConditionalLayout 등)
├── lib/               # 유틸리티
├── src/
│   ├── api/           # Orval 생성 API 클라이언트
│   ├── providers/     # React providers
│   └── next-auth.d.ts
├── orval.config.ts    # API 코드 생성 설정
├── ecosystem.config.js# PM2 설정
├── Dockerfile
└── terraform/         # 인프라
```

## 개발 명령
```bash
cd 03driver
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint
npm run type-check   # 타입 체크
npm run gen          # Orval로 API 클라이언트 재생성
```

## 규약
- 화면 라우트는 `app/`, 재사용 컴포넌트는 `components/`.
- API 호출은 `src/api/`의 Orval 생성 코드를 사용 — 수동 작성 금지, 스펙 변경 시 `npm run gen`.
- 인증 흐름은 `auth.ts` 및 `src/providers/`를 통해 구성됩니다.
