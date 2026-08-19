const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** '2026-08-18' → '2026. 08. 18' */
export const formatDate = (date: string | null) => (date ? date.replaceAll('-', '. ') : '미정');

/** '2026-08-18' → '08.18' */
export const formatShortDate = (date: string | null) =>
  date ? date.slice(5).replace('-', '.') : '미정';

/** '2026-08-18' → '8월 18일' */
export const formatKoreanDate = (date: string) => {
  const [, month, day] = date.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
};

/** '2026-08-18' → '2026년 8월 18일 화요일' (서버가 내려준 날짜 기준) */
export const formatFullKoreanDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${year}년 ${month}월 ${day}일 ${weekday}요일`;
};

/** 로컬 기준 'YYYY-MM-DD' (toISOString 의 UTC 밀림 방지) */
export const toDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
