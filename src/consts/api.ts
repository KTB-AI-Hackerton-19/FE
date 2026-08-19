/**
 * API 엔드포인트 모음.
 * 백엔드 연동 전까지 apis/ 의 함수들은 localStorage 로 동작하며,
 * 서버가 준비되면 이 상수를 사용해 HTTP 호출로 교체한다.
 */
export const API = {
  RECORDS: '/api/records',
  RECORD: (id: number) => `/api/records/${id}`,
  RECOMMENDATIONS: '/api/recommendations',
} as const;

export const QUERY_KEY = {
  RECORDS: ['records'],
  RECOMMENDATIONS: ['recommendations'],
} as const;
