export type CategoryT =
  '디저트' | '꽃·식물' | '부조금' | '패션·잡화' | '상품권' | '생활용품' | '기타';

export type AccentT = 'mint' | 'pink' | 'blue' | 'gold';

export type RecordT = {
  id: number;
  person: string;
  relation: string;
  /** 선물을 받은 날 (YYYY-MM-DD) */
  date: string;
  /** 답례를 준비할 날 (YYYY-MM-DD) */
  reminderDate: string;
  occasion: string;
  gift: string;
  category: CategoryT;
  price: string;
  accent: AccentT;
  thanked: boolean;
};

export type RecordDraftT = Omit<RecordT, 'id' | 'accent' | 'thanked'>;

export type PersonT = {
  name: string;
  relation: string;
  records: RecordT[];
  latest: RecordT;
};
