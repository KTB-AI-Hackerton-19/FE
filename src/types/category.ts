/** 카드 배경 테마 — 서버가 내려주는 문자열과 1:1 */
export type AccentT = 'mint' | 'pink' | 'blue' | 'gold';

export type CategoryT = {
  id: number;
  name: string;
  emoji: string;
  color: AccentT;
  displayOrder: number;
  active: boolean;
  recordCount: number;
};
