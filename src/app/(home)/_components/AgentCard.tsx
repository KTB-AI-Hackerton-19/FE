'use client';

import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react';

import Button from '@/components/common/button';
import { useAppUi } from '@/hooks/useAppUi';

function AgentCard() {
  const { showToast } = useAppUi();

  const handleScrollToRecommendations = () =>
    document.querySelector('#recommendations')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative flex min-h-[220px] overflow-hidden rounded-[20px] bg-forest px-6 py-[27px] text-white shadow-[0_15px_35px_#344f451f] lg:px-[39px] lg:py-[34px]">
      <div className="z-2 max-w-full lg:max-w-[620px]">
        <div className="inline-flex items-center gap-[7px] rounded-[20px] bg-white/10 px-[11px] py-[7px] text-[11px] font-bold text-[#cce3d7]">
          <Sparkles size={16} /> 마음 에이전트가 발견했어요
        </div>
        <h2 className="mt-[15px] mb-[7px] font-serif text-[21px] lg:text-[25px]">
          민수님의 생일이 한 달 남았어요
        </h2>
        <p className="mb-[22px] text-xs leading-[1.7] text-[#d2ded9]">
          지난 생일에 받은 케이크를 참고해, 부담 없이 마음을 전할 선물을 준비해볼까요?
        </p>
        <div className="flex flex-col items-stretch gap-[9px] sm:flex-row sm:items-center">
          <Button onClick={handleScrollToRecommendations}>
            선물 추천 보기 <ArrowRight size={17} />
          </Button>
          <Button
            variant="onDark"
            onClick={() => showToast('9월 14일에 답례 준비 알림을 등록했어요')}
          >
            <CalendarDays size={17} /> 일정에 추가
          </Button>
        </div>
      </div>

      <div className="absolute top-5 -right-5 size-[190px] opacity-25 lg:right-[7%] lg:opacity-100">
        <div className="flex h-[145px] w-[125px] rotate-[5deg] flex-col items-center overflow-hidden rounded-[14px] bg-[#fff9f4] text-ink shadow-[0_15px_30px_#172b2438]">
          <span className="w-full bg-[#e98170] p-[9px] text-center text-xs font-bold tracking-[0.15em] text-white">
            SEP
          </span>
          <strong className="font-serif text-[51px] leading-[1.2]">18</strong>
          <small className="text-[#7e7973]">민수 생일</small>
        </div>
        <div className="absolute right-[3px] bottom-[5px] grid size-[72px] place-items-center rounded-full bg-[#f1d397] text-[38px] shadow-[0_13px_24px_#172b2438]">
          🎁
        </div>
      </div>
    </section>
  );
}

export default AgentCard;
