'use client';

import { useState } from 'react';

type GiftThumbnailProps = {
  /** 상품 대표 이미지. AI가 상품을 못 찾았거나 쇼핑몰에 og:image 가 없으면 null */
  imageUrl: string | null;
  emoji: string;
  name: string;
  /** 이미지가 없을 때 깔리는 배경 */
  toneClass: string;
};

/**
 * 추천 카드의 윗부분.
 * 이미지가 없거나 불러오지 못하면 이모지로 대신한다 — 쇼핑몰 주소라 언제든 깨질 수 있다.
 */
function GiftThumbnail({ imageUrl, emoji, name, toneClass }: GiftThumbnailProps) {
  const [isBroken, setIsBroken] = useState(false);

  if (!imageUrl || isBroken) {
    return (
      <div className={`grid size-full place-items-center text-[51px] ${toneClass}`}>{emoji}</div>
    );
  }

  return (
    // 쇼핑몰 주소는 미리 알 수 없다. next/image 로 최적화하려면 모든 호스트를 열어야 해서 그대로 띄운다.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={name}
      loading="lazy"
      onError={() => setIsBroken(true)}
      className="size-full object-cover"
    />
  );
}

export default GiftThumbnail;
