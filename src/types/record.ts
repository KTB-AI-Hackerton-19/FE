import type { AccentT } from './category';

export type RecordStatusT = 'DRAFT' | 'CONFIRMED';

export type GiftRecordT = {
  id: number;
  personId: number | null;
  person: string;
  relation: string | null;
  date: string;
  reminderDate: string | null;
  occasion: string | null;
  gift: string;
  categoryId: number | null;
  category: string;
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
  status: RecordStatusT;
  createdAt: string;
};

/** 목록 조회 필터 — 클라이언트에서 거르지 않고 서버에 그대로 넘긴다. */
export type GiftRecordQueryT = {
  category?: string;
  categoryId?: number;
  personId?: number;
  thanked?: boolean;
  status?: RecordStatusT;
  startDate?: string;
  endDate?: string;
  q?: string;
  sort?: 'latest' | 'oldest' | 'amount' | 'created';
  page?: number;
  size?: number;
};
