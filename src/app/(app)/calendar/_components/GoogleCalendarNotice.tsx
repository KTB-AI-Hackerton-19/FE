'use client';

import { CalendarCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { useGetGoogleCalendarStatus } from '@/hooks/useGoogleCalendar';

/** 캘린더 화면에서 구글 연동을 안내한다. 연동 설정 자체는 마이페이지에서 한다. */
function GoogleCalendarNotice() {
  const { googleStatus } = useGetGoogleCalendarStatus();

  // 서버에 구글 설정이 없거나 아직 상태를 모르면 아무것도 띄우지 않는다.
  if (!googleStatus?.available) return null;

  const isConnected = googleStatus.connected && !googleStatus.reauthRequired;

  return (
    <Link
      href="/mypage"
      className={`mb-4 flex items-center gap-3 rounded-[17px] border p-3.5 transition sm:p-4 ${
        isConnected
          ? 'border-line bg-white hover:bg-[#fdfaf7]'
          : 'border-[#dbe4f0] bg-blue-soft hover:bg-[#e6edf7]'
      }`}
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-white text-[#5b6f8a]">
        <CalendarCheck size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <b className="block text-[12px]">
          {isConnected ? '구글 캘린더와 연동돼 있어요' : '구글 캘린더에도 답례 알림을 남겨보세요'}
        </b>
        <span className="mt-0.5 block text-[10px] text-[#7b756e]">
          {isConnected
            ? '답례 알림일이 구글 캘린더에도 등록돼요.'
            : '마이페이지에서 연동하면 알림일이 자동으로 등록돼요.'}
        </span>
      </div>

      <ChevronRight size={17} className="shrink-0 text-[#b1aba3]" />
    </Link>
  );
}

export default GoogleCalendarNotice;
