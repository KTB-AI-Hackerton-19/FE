/** 추천 선물 한 개 */
export type RecommendedGiftT = {
  id: number;
  personId: number | null;
  person: string | null;
  emoji: string;
  name: string;
  amount: number;
  price: string;
  tag: string;
  reason: string;
  /** 실제 상품 구매 링크. AI가 상품을 찾지 못하면 null — 있을 때만 링크로 만든다 */
  productUrl: string | null;
  /** 상품 대표 이미지. productUrl 페이지의 og:image 라 링크가 없으면 함께 null — 없으면 이모지로 그린다 */
  imageUrl: string | null;
  thankYouMessage: string | null;
};

/** 사람·일정 단위로 묶인 추천. 선물은 gifts 안에 들어 있다. */
export type RecommendationT = {
  /** 특정 대상이 없는 추천이면 person 계열 필드가 모두 null */
  personId: number | null;
  person: string | null;
  type: 'BIRTHDAY' | 'REMINDER' | null;
  reminderDate: string | null;
  daysLeft: number | null;
  gifts: RecommendedGiftT[];
};
