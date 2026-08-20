/** 카드 배경 테마 — 서버가 내려주는 문자열과 1:1 */
export type AccentT = 'mint' | 'pink' | 'blue' | 'gold';

/**
 * 선물 카테고리. 사용자가 만들고 지운다.
 * 경조사는 카테고리가 아니라 고정 유형이다 — types/eventCategory.ts 참고.
 */
export type CategoryT = {
  id: number;
  name: string;
  emoji: string;
  color: AccentT;
  displayOrder: number;
  active: boolean;
  recordCount: number;
  totalAmount: number;
  /** 화면 표시용 포맷 문자열 (직접 파싱 금지) */
  totalAmountText: string;
  latestDate: string | null;
};
