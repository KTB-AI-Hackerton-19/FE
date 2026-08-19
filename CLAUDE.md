@AGENTS.md

# Giftie FE

받은 선물·부조금을 AI가 기록하고, 답례 시점과 선물까지 챙겨주는 인간관계 관리 서비스의 프론트엔드.

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · React Hook Form + Zod · cva · lucide-react

## 📁 폴더 구조

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # RSC — html/body, 폰트, Providers
│   ├── providers.tsx           # QueryClientProvider + AppUiProvider
│   ├── fonts/                  # next/font 정의 (본문·제목·로고)
│   ├── login/                  # 로그인·회원가입 (셸 밖, 인증 불필요)
│   │   ├── page.tsx
│   │   └── _components/
│   └── (app)/                  # 로그인이 필요한 화면 전체
│       ├── layout.tsx          # AuthGuard + AppShell
│       ├── (home)/             # 홈 — 라우트 그룹(URL은 '/')
│       ├── records/
│       ├── people/
│       │   └── [id]/
│       └── calendar/
├── components/common/          # app/ 밖 — top-level 라우트 간 공유 + 범용 UI
│   └── {component-name}/       # 폴더명: kebab-case
│       ├── index.tsx           # 컴포넌트 본체 (default export)
│       ├── {componentName}.style.ts   # cva variants (스타일 분리 시)
│       └── {componentName}.const.ts   # 상수/타입 (필요 시)
├── apis/                       # apiClient + 엔드포인트별 호출 함수
├── hooks/                      # 커스텀 훅 · API 훅
├── utils/                      # 공통 유틸리티 (formatDate, tokenStorage)
├── types/                      # 서버 응답 타입 (T suffix)
├── consts/                     # 엔드포인트·쿼리키·내비게이션 상수
├── assets/                     # 정적 리소스 (SVG, 이미지)
│   └── icons/                  # 직접 그린 SVG 아이콘 — 파일명 PascalCase
└── styles/globals.css          # Tailwind import + 디자인 토큰
```

**아이콘**: 기본은 `lucide-react`. lucide에 없는 모양만 `assets/icons/`에 SVG 컴포넌트로 직접 그린다. 색은 `currentColor`로 받아 쓰는 쪽 텍스트 색을 따르게 한다. 브라우저가 URL로 직접 요청하는 파일(파비콘 등)만 `public/`에 둔다.

**홈이 `(home)` 라우트 그룹인 이유**: `app/_components/`는 금지 규칙이라, 홈 전용 컴포넌트를 둘 곳이 필요하다. 라우트 그룹은 URL에 영향을 주지 않으면서(`/` 유지) 홈에도 `_components/`를 줄 수 있다.

## 🧩 Colocation 배치 (한 단계씩 레벨업)

코드는 가장 가까운 사용처에 둔다. 재사용 범위가 넓어질 때만 부모로 한 단계 끌어올린다. **처음부터 `components/common/`에 두지 않는다.**

| 재사용 범위                                       | 배치 위치                                                                           |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 단일 `page.tsx` 전용                              | 해당 라우트 폴더의 `_components/` (또는 `_hooks/`, `_apis/`, `_consts/`, `_types/`) |
| 같은 부모 아래 2개 이상 하위 라우트에서 공유      | 부모 라우트의 `_common/_components/` 등                                             |
| app/ top-level 라우트 간 공유                     | `components/common/{component-name}/` — App Router 밖으로                           |
| 2개 이상 top-level 또는 전역에서 쓰는 API/훅/유틸 | `src/apis/`, `hooks/`, `utils/`, `consts/`, `types/`                                |

- `app/_common/`, `app/_components/` ❌ — top-level 간 공유는 App Router 밖에서 관리
- 필요한 폴더만 생성 — 빈 폴더는 만들지 않음
- `components/common/` 바로 아래 `.tsx` 금지, PascalCase 폴더 금지
- import는 폴더까지만: `@/components/common/button`

## 📝 네이밍 컨벤션

| 대상                 | 규칙                            | 예시                                      |
| -------------------- | ------------------------------- | ----------------------------------------- |
| 폴더                 | kebab-case                      | `record-card/`, `nav-item/`               |
| 공통 컴포넌트 본체   | `index.tsx`                     | `components/common/button/index.tsx`      |
| 보조 컴포넌트 파일   | PascalCase                      | `ConfirmStep.tsx`, `PersonTimeline.tsx`   |
| 스타일/상수 파일     | camelCase                       | `button.style.ts`, `recordModal.const.ts` |
| 일반 파일 (훅, 유틸) | camelCase                       | `useAppUi.tsx`, `formatDate.ts`           |
| 타입                 | T suffix                        | `RecordT`, `PersonT`                      |
| API 함수             | HTTP 메서드 prefix              | `getRecords`, `postRecord`                |
| API 요청/응답 타입   | 함수명 + `RequestT`/`ResponseT` | `PostRecordRequestT`                      |
| API 훅               | `use` + 함수명                  | `useGetRecords`, `usePostRecord`          |
| Props 타입           | `{ComponentName}Props`          | `ButtonProps`                             |

Path alias: `@/*` → `src/*`

## 🌐 백엔드 연동

백엔드: `인간관계 지킴이 API` (Spring Boot). Swagger에 모든 필드 한글 설명이 있고, 응답 필드가 화면 필드명과 1:1로 맞춰져 있다.

### 공통 응답 포맷

```json
{ "success": true,  "data": { ... }, "error": null }
{ "success": false, "data": null,    "error": { "code": "...", "message": "..." } }
```

`src/apis/apiClient.ts`가 이 포맷을 벗겨 `data`만 돌려주고, 실패면 `ApiError(code, message, status)`를 던진다. **컴포넌트에서 `success`를 직접 보지 않는다.**

### 에러 코드

OpenAPI 명세에는 모든 엔드포인트가 `200`만 선언되어 있어 에러 응답이 문서화되어 있지 않다. 아래는 실제 호출로 확인한 것이다.

| status | code                                                                                   | 상황                                                                    |
| ------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 400    | `INVALID_INPUT`                                                                        | 필수값 누락·검증 실패 (message 에 한글 사유가 담긴다)                   |
| 400    | `INVALID_FILE_TYPE`                                                                    | presigned URL 요청의 확장자·Content-Type 불허                           |
| 401    | `UNAUTHORIZED`                                                                         | 토큰 없음                                                               |
| 401    | `INVALID_TOKEN`                                                                        | 만료·위조 토큰, 잘못된 refreshToken                                     |
| 401    | `LOGIN_FAILED`                                                                         | 아이디·비밀번호 불일치                                                  |
| 404    | `GIFT_RECORD_NOT_FOUND` / `PERSON_NOT_FOUND` / `CATEGORY_NOT_FOUND` / `USER_NOT_FOUND` | 없거나 내 소유가 아닌 리소스                                            |
| 500    | `INTERNAL_SERVER_ERROR`                                                                | 그 외 (예: 날짜를 `YYYY-MM-DD` 가 아닌 형식으로 보내면 여기로 떨어진다) |

`error.message`는 한글 문장이라 그대로 사용자에게 보여줘도 된다. 코드로 분기가 필요할 때만 `ApiError.code`를 본다.

### 인증

- `/health`, `/api/auth/**`를 뺀 모든 API가 `Authorization: Bearer <accessToken>` 필수
- 액세스 토큰 12시간 / 리프레시 7일. 토큰은 localStorage(`src/utils/tokenStorage.ts`)
- 401이 오면 apiClient가 **한 번만** refresh 후 재시도한다(동시 요청은 single-flight). 실패하면 토큰을 지우고 `/login`으로 보낸다
- 화면 보호는 `(app)/layout.tsx`의 `AuthGuard`가 담당 — 토큰이 localStorage에 있어 서버에서는 로그인 여부를 알 수 없다

### API 주소

백엔드는 `https://api.giftie.site`에 배포되어 있고 CORS가 열려 있어(preflight 200, 요청 Origin을 그대로 반영) **브라우저에서 직접 호출한다.**

- `NEXT_PUBLIC_API_BASE_URL` — 백엔드 주소. 직접 호출 경로
- `API_PROXY_TARGET` (서버 전용) — 위 값을 비웠을 때 `next.config.ts`의 rewrite가 `/api/*`를 넘길 대상

프록시(rewrite)는 예전에 백엔드가 인증 경로의 OPTIONS preflight를 401로 막던 시절의 폴백이다. 지금은 쓰지 않지만, CORS가 다시 막히거나 로컬 백엔드·ngrok으로 붙어야 할 때를 위해 남겨 둔다. 전환하려면 `NEXT_PUBLIC_API_BASE_URL`을 비우고 `API_PROXY_TARGET`을 채운다.

**환경변수는 배포처에도 넣어야 한다.** `.env*`는 gitignore 대상이라 저장소에 없고, `rewrites()`는 빌드 시점에 평가되므로 값을 바꾸면 재배포가 필요하다.

**데모 계정**: `demo` / `demo1234` — 백엔드에서 만들어 준 계정으로 기록 12건·사람 7명이 시드되어 있다. H2 인메모리 DB라 백엔드를 재기동하면 사라질 수 있으니, 로그인이 안 되면 회원가입으로 새로 만들면 된다.

### 백엔드가 정한 규칙 (지킬 것)

- **금액을 파싱하지 않는다** — 표시는 `price`("35,000원"), 계산은 `amount`(35000). 요청은 `price` 하나로 보내고 숫자·문자열 아무거나 허용된다
- **카테고리·이모지·색을 하드코딩하지 않는다** — `GET /api/categories`로 그린다. 기록 응답의 `emoji`·`color`도 서버가 내려준다
- **사람을 미리 등록하지 않는다** — 기록 저장 시 `personName`·`relation`만 보내면 자동 생성된다
- **`imageUrl`을 캐싱하지 않는다** — 15분 만료 presigned URL이라 응답마다 값이 다르다
- **목록 필터는 서버에서 처리한다** — 전체를 받아 클라이언트에서 거르지 말고 `category`·`q`·`startDate` 파라미터를 쓴다
- **빈 상태를 처리한다** — 데이터가 없으면 `agentInsight`는 `null`, `days`·`content`는 빈 배열

### 이미지 업로드 흐름

`POST /api/gift-assets/presigned-url` → 받은 `uploadUrl`로 **S3에 직접 PUT**(백엔드 경유 X, 인증 헤더 붙이면 안 됨) → `imageKey`를 `POST /api/gift-records/extract`로 전달 → AI가 `DRAFT` 기록 생성 → 사용자가 확인·수정 후 `PATCH /api/gift-records/{id}` (`confirm: true`)로 확정. `src/apis/uploadImage.ts`의 `uploadGiftImage`가 앞 두 단계를 묶는다.

### API 컨벤션

- 엔드포인트와 쿼리 키는 `src/consts/api.ts`에 상수로 모은다
- 도메인 타입은 `src/types/<domain>.ts`, T suffix
- API 함수 위치: 단일 페이지 전용 → `app/<route>/_apis/`, 2개 이상 공유 → `src/apis/`

### API 훅 반환값 네이밍

훅 내부에서 의미 있는 이름으로 rename 후 반환 — 호출부에서 매번 `data: xxx`로 rename하지 않도록.

```ts
// Query — data를 도메인명 + Data로
export const useGetDashboard = () => {
  const { data: dashboardData } = useQuery({ ... });
  return { dashboardData };
};

// Mutation — mutate/isPending에 API 함수명 + Mutation/Pending 접미
export const usePostGiftRecord = () => {
  const { mutate: postGiftRecordMutation, isPending: isPostGiftRecordPending } = useMutation({ ... });
  return { postGiftRecordMutation, isPostGiftRecordPending };
};
```

## 🎨 코딩 컨벤션

- 컴포넌트: `function` 키워드 + default export
- 유틸: 화살표 함수
- 타입 선언: `type` 사용 (`interface` 금지), T suffix
- Props 네이밍: 내부 핸들러 `handle-`, 외부에서 받는 props `on-`

```tsx
function Button({ onClick }: ButtonProps) {
  const handleClick = () => {
    onClick?.();
  };
  return <button onClick={handleClick}>...</button>;
}
```

## 🧩 RSC / UI / Next 가이드

- `page.tsx`는 가능하면 RSC — `'use client'`는 상호작용이 필요한 자식으로 내린다
- 고정 width 지양 — 모바일은 `w-full` + 좌우 패딩, 상한은 `max-w-*`
- Semantic tag — 컨테이너는 `<main>`, 타이틀은 `<h1>`/`<h2>`
- 클릭 요소엔 `cursor-pointer` (Tailwind v4는 자동 적용 X, 공통 Button은 cva에서 처리)
- Next 기능 우선 — `<Link>`, `<Image>`, `next/font`. `router.push`는 부수 작업(모달 닫기, API 후처리)이 있을 때만
- **effect 안에서 동기 setState 금지** (`react-hooks/set-state-in-effect`). 리셋이 필요하면 조건부 마운트로 컴포넌트를 새로 띄우고, 클라이언트 전용 값은 `useSyncExternalStore`를 쓴다

## 🎨 디자인 토큰

색은 `src/styles/globals.css`의 `@theme`에 정의되어 있다. 하드코딩된 hex 대신 토큰을 쓴다.

`coral` / `coral-dark` / `coral-deep` / `coral-soft` — 브랜드 포인트
`forest` / `green` — 에이전트 카드, 강조 배경
`ink` / `muted` / `subtle` / `line` / `cream` — 중립
`mint-soft` / `pink-soft` / `blue-soft` / `gold-soft` — 카테고리 배경

폰트: 본문 `font-sans`(Noto Sans KR), 제목·숫자 `font-serif`(Gowun Batang)

## 📦 Import 규칙

`@trivago/prettier-plugin-sort-imports`로 자동 정렬된다.

```
1. 외부 라이브러리  (<THIRD_PARTY_MODULES>)
2. 절대경로        (^@/)
3. 상대경로        (^[./])
```

그룹 간 빈 줄, 그룹 내 알파벳 정렬. `import type`은 강제(`consistent-type-imports`)이며 정렬 규칙상 대체로 맨 아래 그룹에 모인다.

## 🚨 ESLint 주요 규칙

- `no-console`: `warn`/`error`만 허용 (`console.log` 금지)
- `no-nested-ternary`: 중첩 삼항 금지
- `@typescript-eslint/consistent-type-imports`: `import type` 강제
- `@typescript-eslint/no-explicit-any`: `any` 금지
- `unused-imports/no-unused-imports`
- `_` prefix 변수/인자는 unused 허용

## Prettier

semi: true · singleQuote: true · printWidth: 100 · trailingComma: 'es5' · arrowParens: 'avoid'

## 🌿 Git 컨벤션

- 브랜치: `{type}/{issue-number}-{description}` (예: `feat/1-login-page`, `chore/3-web-setup`)
- 타입: `feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`
- 커밋 메시지: `{type}: {한글 설명}` (예: `feat: 로그인 페이지 구현`)

## 명령어

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드 (타입체크 포함)
npm run lint    # ESLint
```
