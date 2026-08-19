import type { AccentT, CategoryT, RecordT } from '@/types/record';

export const CATEGORIES: CategoryT[] = [
  '디저트',
  '꽃·식물',
  '부조금',
  '패션·잡화',
  '상품권',
  '생활용품',
  '기타',
];

export const CATEGORY_EMOJI: Record<CategoryT, string> = {
  디저트: '🍰',
  '꽃·식물': '💐',
  부조금: '💌',
  '패션·잡화': '👜',
  상품권: '🎫',
  생활용품: '🕯️',
  기타: '🎁',
};

export const CATEGORY_ACCENT: Record<CategoryT, AccentT> = {
  디저트: 'mint',
  '꽃·식물': 'pink',
  부조금: 'blue',
  '패션·잡화': 'gold',
  상품권: 'blue',
  생활용품: 'mint',
  기타: 'gold',
};

/** 백엔드 연동 전 데모용 초기 데이터 */
export const STARTER_RECORDS: RecordT[] = [
  {
    id: 1,
    person: '김민수',
    relation: '친한 친구',
    date: '2026-08-18',
    reminderDate: '2026-09-14',
    occasion: '내 생일',
    gift: '스타벅스 케이크',
    category: '디저트',
    price: '35,000원',
    accent: 'mint',
    thanked: true,
  },
  {
    id: 2,
    person: '이지은',
    relation: '직장 동료',
    date: '2026-08-07',
    reminderDate: '2026-08-27',
    occasion: '프로젝트 축하',
    gift: '꽃다발과 카드',
    category: '꽃·식물',
    price: '45,000원',
    accent: 'pink',
    thanked: true,
  },
  {
    id: 3,
    person: '박서준',
    relation: '대학 동기',
    date: '2026-08-08',
    reminderDate: '2026-10-03',
    occasion: '결혼식',
    gift: '축의금',
    category: '부조금',
    price: '100,000원',
    accent: 'blue',
    thanked: false,
  },
  {
    id: 4,
    person: '김민수',
    relation: '친한 친구',
    date: '2026-04-02',
    reminderDate: '2026-09-14',
    occasion: '취업 축하',
    gift: '가죽 카드지갑',
    category: '패션·잡화',
    price: '59,000원',
    accent: 'gold',
    thanked: true,
  },
];
