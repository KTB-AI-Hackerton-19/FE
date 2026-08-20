import type { AccentT } from './category';
import type { EventGroupT } from './eventCategory';

export type RecordStatusT = 'DRAFT' | 'CONFIRMED';

/** 대분류. 선물이면 카테고리를, 경조사면 행사 유형을 쓴다 */
export type RecordTypeT = 'GIFT' | 'EVENT';

export type GiftRecordT = {
  id: number;
  personId: number | null;
  person: string;
  relation: string | null;
  date: string;
  reminderDate: string | null;
  /** 받은 이유 — 선물 기록에만 있다 */
  occasion: string | null;
  gift: string;
  /** 선물 기록에만 있다. 경조사면 null */
  categoryId: number | null;
  category: string | null;
  amount: number;
  /** 화면 표시용 포맷 문자열 — 그대로 출력한다 (직접 파싱 금지) */
  price: string;
  emoji: string;
  color: AccentT;
  thanked: boolean;
  extractedSenderName: string | null;
  extractedRelationship: string | null;
  /** 15분 만료 presigned GET URL — 캐싱하지 않는다 */
  imageUrl: string | null;
  /**
   * 대분류. 한글 라벨('경조사')로 내려오다 영문 코드(GIFT·EVENT)로 바뀌는 중이라
   * 값으로 분기하지 않는다 — 경조사 여부는 event 를 본다.
   */
  recordType: string;
  recordTypeLabel: string;
  /** 경조사 기록이면 true */
  event: boolean;
  /** 경조사 유형. 코드가 아니라 한글 라벨로 내려온다('결혼'). 선물이면 null */
  eventCategory: string | null;
  eventCategoryLabel: string | null;
  eventGroup: EventGroupT | null;
  /** '경사' · '조사' */
  eventGroupLabel: string | null;
  /** 행사가 실제로 열린 날. 받은 날짜(date)와 다를 수 있다 */
  eventDate: string | null;
  status: RecordStatusT;
  createdAt: string;
};

/**
 * 목록 kind 필터.
 * 대분류(GIFT·EVENT) · 그룹(CELEBRATION·CONDOLENCE) · 구체 유형(WEDDING·결혼)을 모두 받는다.
 */
export type RecordKindFilterT = RecordTypeT | EventGroupT | (string & {});

/** 목록 조회 필터 — 클라이언트에서 거르지 않고 서버에 그대로 넘긴다. */
export type GiftRecordQueryT = {
  category?: string;
  categoryId?: number;
  personId?: number;
  /** 보낸 사람 이름으로만 좁힌다 — 통합 검색(q)과 달리 선물명·사유는 보지 않는다 */
  personName?: string;
  thanked?: boolean;
  kind?: RecordKindFilterT;
  status?: RecordStatusT;
  startDate?: string;
  endDate?: string;
  q?: string;
  sort?: 'latest' | 'oldest' | 'amount' | 'created';
  page?: number;
  size?: number;
};
