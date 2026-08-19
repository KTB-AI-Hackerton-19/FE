import type { RecommendationT } from '@/types/recommendation';

/** 백엔드 추천 API 연동 전 데모용 후보 */
export const RECOMMENDATIONS: RecommendationT[] = [
  {
    emoji: '☕',
    name: '스페셜티 드립백 세트',
    price: '32,000원',
    tag: '취향 일치',
    reason: '민수님이 커피를 좋아하고, 받은 선물과 부담이 비슷해요.',
  },
  {
    emoji: '🍽️',
    name: '모바일 외식 상품권',
    price: '40,000원',
    tag: '실패 확률 낮음',
    reason: '친한 친구에게 편하게 전하기 좋고 사용처가 다양해요.',
  },
  {
    emoji: '🍪',
    name: '프리미엄 디저트 박스',
    price: '38,000원',
    tag: '답례 추천',
    reason: '받았던 케이크와 자연스럽게 이어지는 따뜻한 답례예요.',
  },
];

export const RECOMMEND_TONES = ['bg-[#e9f1ed]', 'bg-[#f5ede2]', 'bg-[#f7e9e7]'];
