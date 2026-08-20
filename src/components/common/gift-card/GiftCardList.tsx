'use client';

import type { RecommendedGiftT } from '@/types/recommendation';

import GiftCard from '.';

type GiftCardListProps = {
  gifts: RecommendedGiftT[];
};

/**
 * 추천 카드 줄. 모바일은 옆으로 넘겨 보고, 넓은 화면에서는 한 줄에 편다.
 *
 * 줄(썸네일·이름·가격·이유·링크)을 여기서 정의해 카드가 subgrid 로 물려 쓴다 —
 * 그래야 각 칸이 세 장 중 가장 큰 것에 맞춰지고, 다 짧으면 같이 줄어든다.
 */
function GiftCardList({ gifts }: GiftCardListProps) {
  return (
    // gap 은 카드 사이에만 준다 — 세로에도 걸리면 subgrid 줄마다 벌어져 카드 안이 성글어진다.
    <div className="flex snap-x snap-mandatory gap-[15px] overflow-auto lg:grid lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto_auto] lg:gap-y-0 lg:overflow-visible">
      {gifts.map((gift, index) => (
        <GiftCard key={gift.id} gift={gift} index={index} />
      ))}
    </div>
  );
}

export default GiftCardList;
