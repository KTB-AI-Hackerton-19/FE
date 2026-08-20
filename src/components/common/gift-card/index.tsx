'use client';

import { ArrowRight } from 'lucide-react';

import type { RecommendedGiftT } from '@/types/recommendation';

import GiftThumbnail from './GiftThumbnail';

/** 이미지가 없을 때 깔리는 배경. 카드가 나란히 놓이므로 번갈아 쓴다 */
const TONES = ['bg-[#e9f1ed]', 'bg-[#f5ede2]', 'bg-[#f7e9e7]'];

const footerClass =
  'mt-2.5 flex w-full items-center justify-center gap-[5px] border-t border-line pt-[11px] text-[10px] font-bold';

type GiftCardProps = {
  gift: RecommendedGiftT;
  /** 배경색을 번갈아 쓰기 위한 순번 */
  index: number;
};

/** 추천 선물 한 장. 홈과 사람 상세가 함께 쓴다. */
function GiftCard({ gift, index }: GiftCardProps) {
  return (
    <article className="min-w-[78%] snap-start overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_14px_30px_#503e3514] lg:min-w-0">
      <div className="relative h-[125px]">
        <GiftThumbnail
          imageUrl={gift.imageUrl}
          emoji={gift.emoji}
          name={gift.name}
          toneClass={TONES[index % TONES.length]}
        />
        <span className="absolute top-2.5 left-[11px] rounded-[10px] bg-white px-2 py-[5px] text-[8px] font-bold text-[#7a746c]">
          {gift.tag}
        </span>
      </div>
      <div className="p-[15px]">
        <h3 className="mb-[3px] text-[13px]">{gift.name}</h3>
        <strong className="text-xs text-[#dc725f]">{gift.price}</strong>
        <p className="h-[29px] text-[9px] leading-[1.55] text-[#8e8981]">{gift.reason}</p>
        {/* 구매 링크는 AI가 상품을 찾았을 때만 내려온다 */}
        {gift.productUrl ? (
          <a
            href={gift.productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${footerClass} cursor-pointer text-[#5c7769]`}
          >
            이 선물로 마음 전하기 <ArrowRight size={16} />
          </a>
        ) : (
          <p className={`${footerClass} text-subtle`}>구매 링크를 찾지 못했어요</p>
        )}
      </div>
    </article>
  );
}

export default GiftCard;
