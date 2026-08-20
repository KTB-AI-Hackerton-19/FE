'use client';

import { ArrowRight } from 'lucide-react';

import GoogleCalendarIcon from '@/assets/icons/google-calendar.svg';
import Button from '@/components/common/button';
import { useConnectGoogleCalendar } from '@/hooks/useGoogleCalendar';

import { bannerClass } from './homeBanner.const';

/** 구글 캘린더를 아직 연결하지 않은 사람에게 보여주는 배너. */
function CalendarBanner() {
  const { connectGoogleMutation, isConnectGooglePending } = useConnectGoogleCalendar();

  return (
    <section className={bannerClass}>
      <div className="z-2 max-w-full lg:max-w-[620px]">
        <div className="inline-flex items-center gap-[7px] rounded-[20px] bg-white/70 px-[11px] py-[7px] text-[11px] font-bold text-coral-deep">
          <GoogleCalendarIcon width={15} height={15} /> 구글 캘린더 연동
        </div>
        <h2 className="mt-[15px] mb-[7px] font-title font-bold text-[21px] lg:text-[25px]">
          답례할 날, 캘린더에서도 알려드릴게요
        </h2>
        <p className="mb-[22px] text-xs leading-[1.7] text-[#8a6a60]">
          연동해두면 답례 알림일이 구글 캘린더에 자동으로 등록돼요.
          <br />
          Giftie를 열지 않아도 놓치지 않아요.
        </p>
        <Button onClick={() => connectGoogleMutation()} disabled={isConnectGooglePending}>
          {isConnectGooglePending ? '연결하는 중…' : '구글 캘린더 연동하기'}
          <ArrowRight size={17} />
        </Button>
      </div>

      {/* 브랜드 색이 있는 로고라 흰색으로 덮지 않고 옅게만 깐다 */}
      <GoogleCalendarIcon
        width={140}
        height={140}
        className="absolute top-14 -right-6 rotate-[8deg] opacity-20 lg:right-[9%]"
      />
    </section>
  );
}

export default CalendarBanner;
