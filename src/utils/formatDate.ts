/** '2026-08-18' → '2026. 08. 18' */
export const formatDate = (date: string) => date.replaceAll('-', '. ');

/** '2026-08-18' → '08.18' */
export const formatShortDate = (date: string) => date.slice(5).replace('-', '.');

/** '2026-08-18' → '8월 18일' */
export const formatKoreanDate = (date: string) => {
  const [, month, day] = date.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
};

/** Date → 'YYYY-MM-DD' (로컬 기준, toISOString 의 UTC 밀림 방지) */
export const toDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
