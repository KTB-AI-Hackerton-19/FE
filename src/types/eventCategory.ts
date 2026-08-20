import type { AccentT } from './category';

/** 경사 · 조사 */
export type EventGroupT = 'CELEBRATION' | 'CONDOLENCE';

/**
 * 경조사 유형. 사용자가 만드는 게 아니라 서버가 정한 고정 7종이다.
 * GET /api/gift-records/event-categories 로 받아 그린다.
 */
export type EventCategoryT = {
  /** 요청에 넣는 영문 코드 (WEDDING 등). 한글 라벨도 허용된다 */
  name: string;
  label: string;
  group: EventGroupT;
  /** '경사' · '조사' — 그대로 출력한다 */
  groupLabel: string;
  emoji: string;
  color: AccentT;
};
