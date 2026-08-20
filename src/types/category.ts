/** 카드 배경 테마 — 서버가 내려주는 문자열과 1:1 */
export type AccentT = 'mint' | 'pink' | 'blue' | 'gold';

/** 분류. 목록 탭과 필터에 그대로 쓴다. */
export type KindT = 'GIFT' | 'CELEBRATION' | 'CONDOLENCE';

/** 목록 필터용 — EVENT 는 경사·조사를 함께 본다는 뜻이라 KindT 와 따로 둔다. */
export type KindFilterT = KindT | 'EVENT';

export type CategoryT = {
  id: number;
  name: string;
  emoji: string;
  color: AccentT;
  displayOrder: number;
  active: boolean;
  recordCount: number;
  kind: KindT;
  /** '선물' · '경사' · '조사' — 그대로 출력한다 */
  kindLabel: string;
  /** 경조사면 true. 이 카테고리 하나가 곧 하나의 행사다 */
  event: boolean;
  totalAmount: number;
  /** 화면 표시용 포맷 문자열 (직접 파싱 금지) */
  totalAmountText: string;
  latestDate: string | null;
  /** 사용자가 입력한 실제 행사 날짜 (선물 카테고리는 항상 null) */
  eventDate: string | null;
  /** 카드에 그릴 날짜 — 행사일이 있으면 행사일, 없으면 최근 기록일. 정렬도 이 기준이다 */
  displayDate: string | null;
};