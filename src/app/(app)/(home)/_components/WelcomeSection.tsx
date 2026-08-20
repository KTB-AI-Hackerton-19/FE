'use client';

import { Heart } from 'lucide-react';

import Gift3dIcon from '@/assets/icons/gift-3d.svg';
import { useGetDashboard } from '@/hooks/useGetDashboard';
import { formatFullKoreanDate } from '@/utils/formatDate';

function WelcomeSection() {
  const { dashboardData } = useGetDashboard();

  return (
    <section className="flex min-h-[145px] items-center justify-between lg:min-h-[180px]">
      <div>
        <span className="text-xs font-semibold tracking-[0.03em] text-[#96918a]">
          {dashboardData ? formatFullKoreanDate(dashboardData.today) : ' '}
        </span>
        <h1 className="mt-[9px] font-title font-bold text-[29px] leading-[1.42] tracking-[-0.04em] lg:text-[34px]">
          오늘도 소중한 마음을
          <br />
          <em className="text-coral-deep not-italic">잊지 않게 챙겨드릴게요.</em>
        </h1>
      </div>

      {/*
        장식 — 흰 동그라미 배지를 걷어내고 연한 하트를 배경처럼 깔았다.
        상자만 또렷하고 나머지는 뒤로 물러나 있어야 인사말이 먼저 읽힌다.
      */}
      <div className="relative mr-[30px] hidden size-[190px] place-items-center lg:grid">
        {/* 경계를 흐려 배경에 스며들게 한다 — 또렷한 원이면 상자보다 먼저 눈에 걸린다 */}
        <span className="absolute -inset-3 rounded-[48%_52%_55%_45%] bg-[#f6e3dc] blur-2xl" />

        <Heart
          size={56}
          fill="currentColor"
          strokeWidth={0}
          className="absolute top-1 right-2 rotate-[14deg] text-[#f0cabe] blur-[1px]"
        />
        <Heart
          size={30}
          fill="currentColor"
          strokeWidth={0}
          className="absolute bottom-4 left-1 -rotate-[10deg] text-[#f4d7cd] blur-[2px]"
        />

        <Gift3dIcon
          width={128}
          height={128}
          className="relative drop-shadow-[0_14px_20px_#c477661f]"
        />
      </div>
    </section>
  );
}

export default WelcomeSection;
