/** 미설정 시 같은 오리진으로 폴백한다 (new URL 이 빈 base 로 던지는 것을 막는다). */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window === 'undefined' ? 'http://localhost:8080' : window.location.origin);

export const API = {
  SIGNUP: '/api/auth/signup',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',

  DASHBOARD: '/api/dashboard',
  CATEGORIES: '/api/categories',

  GIFT_RECORDS: '/api/gift-records',
  GIFT_RECORD: (id: number) => `/api/gift-records/${id}`,
  GIFT_RECORD_EXTRACT: '/api/gift-records/extract',
  PRESIGNED_URL: '/api/gift-assets/presigned-url',

  PEOPLE: '/api/people',
  PERSON: (id: number) => `/api/people/${id}`,
  PERSON_GIFT_RECORDS: (id: number) => `/api/people/${id}/gift-records`,

  CALENDAR: '/api/calendar',

  RECOMMENDATIONS: '/api/recommendations',
  SEARCH: '/api/search',
} as const;

export const QUERY_KEY = {
  DASHBOARD: ['dashboard'],
  CATEGORIES: ['categories'],
  GIFT_RECORDS: ['gift-records'],
  PEOPLE: ['people'],
  PERSON: (id: number) => ['people', id],
  CALENDAR: (year: number, month: number) => ['calendar', year, month],
  RECOMMENDATIONS: ['recommendations'],
} as const;
