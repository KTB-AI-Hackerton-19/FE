'use client';

import { ArrowRight } from 'lucide-react';

import HappyGiftIcon from '@/assets/icons/happy-gift.svg';
import Button from '@/components/common/button';
import { useAppUi } from '@/hooks/useAppUi';

import { bannerClass } from './homeBanner.const';

/** 기록이 하나도 없는 사람에게 보여주는 첫 배너. 에이전트 카드는 챙길 일정이 있어야 뜬다. */
function StartBanner() {
  const { openRecordModal } = useAppUi();

  return (
    <section className={bannerClass}>
      <div className="z-2 max-w-full lg:max-w-[620px]">
        <div className="inline-flex items-center gap-[7px] rounded-[20px] bg-white/70 px-[11px] py-[7px] text-[11px] font-bold text-coral-deep">
          Giftie 시작하기
        </div>
        <h2 className="mt-[15px] mb-[7px] font-title font-bold text-[21px] lg:text-[25px]">
          받은 마음, 첫 장부터 적어볼까요?
        </h2>
        <p className="mb-[22px] text-xs leading-[1.7] text-[#8a6a60]">
          사진 한 장만 올리면 보낸 사람과 금액을 대신 정리해드려요.
          <br />
          답례할 때가 되면 잊지 않게 먼저 알려드릴게요.
        </p>
        <Button onClick={openRecordModal}>
          마음 기록하기 <ArrowRight size={17} />
        </Button>
      </div>

      <HappyGiftIcon
        width={150}
        height={150}
        className="absolute top-12 -right-4 rotate-[8deg] text-white opacity-60 lg:right-[9%]"
      />
    </section>
  );
}

export default StartBanner;
