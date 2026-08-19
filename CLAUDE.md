@AGENTS.md

# Giftie FE — 마음장부

받은 선물·부조금을 AI가 기록하고, 답례 시점과 선물까지 챙겨주는 인간관계 관리 서비스의 프론트엔드.

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · React Hook Form + Zod · cva · lucide-react

## 📁 폴더 구조

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # RSC — html/body, 폰트, Providers, AppShell
│   ├── providers.tsx           # QueryClientProvider + AppUiProvider
│   ├── fonts/                  # next/font 정의
│   ├── (home)/                 # 홈 — 라우트 그룹(URL은 '/')
│   │   ├── page.tsx
│   │   ├── _components/
│   │   └── _consts/
│   ├── records/
│   │   ├── page.tsx
│   │   └── _components/
│   ├── people/
│   │   ├── page.tsx
│   │   ├── _components/
│   │   └── [name]/
│   │       ├── page.tsx
│   │       └── _components/
│   └── calendar/
│       ├── page.tsx
│       └── _components/
├── components/common/          # app/ 밖 — top-level 라우트 간 공유 + 범용 UI
│   └── {component-name}/       # 폴더명: kebab-case
│       ├── index.tsx           # 컴포넌트 본체 (default export)
│       ├── {componentName}.style.ts   # cva variants (스타일 분리 시)
│       └── {componentName}.const.ts   # 상수/타입 (필요 시)
├── apis/                       # API 호출 함수 (HTTP 메서드 prefix)
├── hooks/                      # 커스텀 훅 · API 훅
├── utils/                      # 공통 유틸리티
├── types/                      # 공통 타입 (T suffix)
├── consts/                     # 상수
└── styles/globals.css          # Tailwind import + 디자인 토큰
```

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

## 🌐 API 컨벤션

- 엔드포인트는 `src/consts/api.ts`에 상수로 모은다. 쿼리 키도 여기(`QUERY_KEY`).
- 도메인 모델 타입은 `src/types/<domain>.ts`.
- API 함수 위치: 단일 페이지 전용 → `app/<route>/_apis/`, 2개 이상 공유 → `src/apis/`.
- **현재 `src/apis/`는 localStorage 기반 목 구현**(`recordStorage.ts`). Spring Boot 서버가 준비되면 `getRecords`/`postRecord` 본문만 HTTP 호출로 교체하면 되고, 훅·컴포넌트는 건드릴 필요 없다.

### API 훅 반환값 네이밍

훅 내부에서 의미 있는 이름으로 rename 후 반환 — 호출부에서 매번 `data: xxx`로 rename하지 않도록.

```ts
// Query — data를 도메인명 + Data로
export const useGetRecords = () => {
  const { data: recordsData = STARTER_RECORDS } = useQuery({ ... });
  return { recordsData };
};

// Mutation — mutate/isPending에 API 함수명 + Mutation/Pending 접미
export const usePostRecord = () => {
  const { mutate: postRecordMutation, isPending: isPostRecordPending } = useMutation({ ... });
  return { postRecordMutation, isPostRecordPending };
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
