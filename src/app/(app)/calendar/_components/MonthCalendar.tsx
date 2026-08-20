'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import EmptyState from '@/components/common/empty-state';
import { useGetCalendar } from '@/hooks/useGetCalendar';
import { formatKoreanDate, toDateKey } from '@/utils/formatDate';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type MonthCalendarProps = {
  /** 서버 기준 오늘 (초기 선택 날짜) */
  today: string;
};

function MonthCalendar({ today }: MonthCalendarProps) {
  const [todayYear, todayMonth] = today.split('-').map(Number);
  const [cursor, setCursor] = useState({ year: todayYear, month: todayMonth });
  const [selectedDate, setSelectedDate] = useState(today);

  const { calendarData } = useGetCalendar(cursor);

  const { year, month } = cursor;
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  // 이벤트가 있는 날짜만 응답에 담기므로 날짜 → 일자 정보로 인덱싱해 둔다.
  const dayMap = new Map((calendarData?.days ?? []).map(day => [day.date, day]));
  const selectedDay = dayMap.get(selectedDate);

  const moveMonth = (amount: number) => {
    const next = new Date(year, month - 1 + amount, 1);
    const nextCursor = { year: next.getFullYear(), month: next.getMonth() + 1 };
    setCursor(nextCursor);
    setSelectedDate(toDateKey(nextCursor.year, nextCursor.month, 1));
  };

  const getCellClass = (dateKey: string) =>
    selectedDate === dateKey ? 'bg-[#fff2ed]' : 'hover:bg-[#faf7f3]';

  const getDayNumberClass = (dateKey: string, hasEvent: boolean) => {
    if (selectedDate === dateKey) return 'bg-coral font-bold text-white';
    return hasEvent ? 'font-bold text-[#d66e5d]' : '';
  };

  return (
    <>
      <section className="rounded-[17px] border border-line bg-white px-[9px] py-[15px] lg:rounded-[20px] lg:p-6">
        <div className="mb-[21px] flex items-center justify-center gap-[22px]">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => moveMonth(-1)}
            className="grid size-8 cursor-pointer place-items-center rounded-[9px] bg-[#f5f2ee]"
          >
            <ChevronLeft size={17} />
          </button>
          <h2 className="min-w-[120px] text-center font-title font-bold text-xl">
            {year}년 {month}월
          </h2>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => moveMonth(1)}
            className="grid size-8 cursor-pointer place-items-center rounded-[9px] bg-[#f5f2ee]"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="grid grid-cols-7">
          {WEEKDAYS.map((weekday, index) => (
            <span
              key={weekday}
              className={`pb-3 text-center text-[10px] ${index === 0 ? 'text-[#db725f]' : 'text-[#9d968e]'}`}
            >
              {weekday}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstWeekday }, (_, index) => (
            <div key={`empty-${index}`} className="min-h-[58px] border-t border-[#f0ece6]" />
          ))}

          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dateKey = toDateKey(year, month, day);
            const dayData = dayMap.get(dateKey);
            const received = dayData?.events.filter(event => event.type === 'RECEIVED') ?? [];
            const hasEvent = Boolean(dayData);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={`flex min-h-[58px] cursor-pointer flex-col items-center gap-[3px] rounded-[11px] border-t border-[#f0ece6] px-px py-1.5 lg:min-h-[76px] lg:gap-[9px] lg:p-[9px] ${getCellClass(dateKey)}`}
              >
                <span
                  className={`grid size-[23px] place-items-center rounded-full text-[11px] lg:size-[26px] ${getDayNumberClass(dateKey, hasEvent)}`}
                >
                  {day}
                </span>
                <div className="flex h-[22px] items-center gap-0.5">
                  {received.slice(0, 2).map(event => (
                    <i key={event.id} className="text-[11px] not-italic lg:text-sm">
                      {event.emoji}
                    </i>
                  ))}
                  {(dayData?.toGiveCount ?? 0) > 0 && (
                    <i className="size-[5px] rounded-full bg-[#668372]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 flex justify-end gap-3.5 text-[9px] text-[#908a82]">
          <span className="flex items-center gap-[5px]">
            <i className="size-[7px] rounded-full bg-coral" /> 받은 마음
          </span>
          <span className="flex items-center gap-[5px]">
            <i className="size-[7px] rounded-full bg-[#668372]" /> 답례 알림
          </span>
        </div>
      </section>

      <section className="mt-[18px]">
        <span className="text-[10px] font-bold text-[#dd725f]">
          {formatKoreanDate(selectedDate)}
        </span>
        <h2 className="mt-[3px] mb-3 font-title font-bold text-xl">이날의 마음</h2>

        {selectedDay && selectedDay.events.length > 0 ? (
          <div className="grid gap-[9px]">
            {selectedDay.events.map(event => (
              <Link
                key={`${event.type}-${event.id}`}
                href={`/people/${event.personId}`}
                aria-label={`${event.person}님 상세 보기`}
                className="flex items-center gap-3 rounded-[14px] border border-line bg-white p-3.5 transition hover:bg-[#fdfaf7]"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-[#f6eee9] text-xl">
                  {event.emoji}
                </div>
                <div className="flex-1">
                  <span className="text-[8px] text-[#dc725f]">
                    {event.type === 'RECEIVED' ? '받은 선물' : '답례 알림'}
                  </span>
                  <h3 className="my-0.5 text-xs">
                    {event.person} · {event.gift}
                  </h3>
                  <p className="text-[9px] text-[#908a82]">
                    {event.occasion} · {event.price}
                  </p>
                </div>
                <ChevronRight size={17} className="text-[#b1aba3]" />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="이날은 기록된 마음이 없어요"
            description="다른 날짜를 눌러 확인해보세요."
          />
        )}
      </section>
    </>
  );
}

export default MonthCalendar;
