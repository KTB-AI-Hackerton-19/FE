'use client';

import { ArrowRight, CalendarDays, Heart, Star } from 'lucide-react';

import GiftBoxIcon from '@/assets/icons/gift-box.svg';
import Button from '@/components/common/button';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetDashboard } from '@/hooks/useGetDashboard';
import { formatKoreanDate } from '@/utils/formatDate';

import { bannerClass } from './homeBanner.const';

function AgentCard() {
  const { dashboardData } = useGetDashboard();
  const { showToast } = useAppUi();

  const insight = dashboardData?.agentInsight;
  // 다가오는 일정이 없으면 서버가 null 을 내려주므로 카드를 그리지 않는다.
  if (!insight) return null;

  const handleScrollToRecommendations = () =>
    document.querySelector('#recommendations')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className={bannerClass}>
      <div className="z-2 max-w-full lg:max-w-[620px]">
        <div className="inline-flex items-center gap-[7px] rounded-[20px] bg-white/70 px-[11px] py-[7px] text-[11px] font-bold text-coral-deep">
          <Heart size={15} fill="currentColor" /> 잊지 않으셨죠?
        </div>
        <h2 className="mt-[15px] mb-[7px] font-title font-bold text-[21px] lg:text-[25px]">
          {insight.title}
        </h2>
        <p className="mb-[22px] text-xs leading-[1.7] text-[#8a6a60]">{insight.message}</p>
        <div className="flex flex-col items-stretch gap-[9px] sm:flex-row sm:items-center">
          <Button onClick={handleScrollToRecommendations}>
            선물 추천 보기 <ArrowRight size={17} />
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              showToast(`${formatKoreanDate(insight.date)}에 답례 준비 알림을 등록했어요`)
            }
          >
            <CalendarDays size={17} /> 일정에 추가
          </Button>
        </div>
      </div>

      <div className="absolute top-11 -right-5 size-[190px] opacity-25 lg:right-[7%] lg:opacity-100">
        {/* 달력 뒤에 깔리는 큰 선물상자 — 배경처럼 아주 옅게 */}
        {/* 색에 알파를 주면 도형이 겹치는 곳마다 진해져 테두리처럼 보인다 — 요소 전체에 opacity 를 준다 */}
        <GiftBoxIcon
          width={158}
          height={158}
          className="absolute -right-6 bottom-2 -rotate-[8deg] text-white opacity-60"
        />

        {/* 달력과 별은 한 덩어리로 움직인다 — 뒤에 깔린 선물상자가 오른쪽으로 드러나게 */}
        <div className="relative w-[125px] -translate-x-16">
          <Star
            size={28}
            fill="currentColor"
            strokeWidth={0}
            className="absolute -top-4 -left-7 rotate-[12deg] text-[#f7d78f]"
          />
          <Star
            size={16}
            fill="currentColor"
            strokeWidth={0}
            className="absolute top-14 -left-11 -rotate-[10deg] text-[#fbe6b4]"
          />

          <div className="flex h-[145px] w-[125px] rotate-[5deg] flex-col items-center overflow-hidden rounded-[14px] bg-[#fffdfa] text-ink shadow-[0_14px_28px_#a5705f22]">
            <span className="w-full bg-[#e98170] p-[9px] text-center text-xs font-bold tracking-[0.15em] text-white">
              {insight.monthLabel}
            </span>
            <strong className="font-title font-bold text-[51px] leading-[1.2]">
              {insight.dayLabel}
            </strong>
            <small className="text-[#7e7973]">{insight.caption}</small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgentCard;
