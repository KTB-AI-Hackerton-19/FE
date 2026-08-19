'use client';

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { useGetRecords } from '@/hooks/useGetRecords';
import { formatKoreanDate, toDateKey } from '@/utils/formatDate';
import { getCategoryEmoji } from '@/utils/getCategoryEmoji';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function MonthCalendar() {
  const { recordsData } = useGetRecords();
  const [cursor, setCursor] = useState(new Date(2026, 7, 1));
  const [selectedDate, setSelectedDate] = useState('2026-08-18');

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const selectedRecords = recordsData.filter(
    record => record.date === selectedDate || record.reminderDate === selectedDate
  );

  const moveMonth = (amount: number) => {
    const next = new Date(year, month + amount, 1);
    setCursor(next);
    setSelectedDate(toDateKey(next.getFullYear(), next.getMonth() + 1, 1));
  };

  const getCellClass = (dateKey: string, hasEvent: boolean) => {
    if (selectedDate === dateKey) return 'bg-[#fff2ed]';
    return hasEvent ? 'hover:bg-[#faf7f3]' : 'hover:bg-[#faf7f3]';
  };

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
          <h2 className="min-w-[120px] text-center font-serif text-xl">
            {year}년 {month + 1}월
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
            const dateKey = toDateKey(year, month + 1, day);
            const gifts = recordsData.filter(record => record.date === dateKey);
            const reminders = recordsData.filter(record => record.reminderDate === dateKey);
            const hasEvent = gifts.length > 0 || reminders.length > 0;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={`flex min-h-[58px] cursor-pointer flex-col items-center gap-[3px] rounded-[11px] border-t border-[#f0ece6] px-px py-1.5 lg:min-h-[76px] lg:gap-[9px] lg:p-[9px] ${getCellClass(dateKey, hasEvent)}`}
              >
                <span
                  className={`grid size-[23px] place-items-center rounded-full text-[11px] lg:size-[26px] ${getDayNumberClass(dateKey, hasEvent)}`}
                >
                  {day}
                </span>
                <div className="flex h-[22px] items-center gap-0.5">
                  {gifts.slice(0, 2).map(gift => (
                    <i key={gift.id} className="text-[11px] not-italic lg:text-sm">
                      {getCategoryEmoji(gift.category)}
                    </i>
                  ))}
                  {reminders.length > 0 && <i className="size-[5px] rounded-full bg-[#668372]" />}
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
        <h2 className="mt-[3px] mb-3 font-serif text-xl">이날의 마음</h2>

        {selectedRecords.length > 0 ? (
          <div className="grid gap-[9px]">
            {selectedRecords.map(record => {
              const isGiftDay = record.date === selectedDate;
              return (
                <article
                  key={`${record.id}-${selectedDate}`}
                  className="flex items-center gap-3 rounded-[14px] border border-line bg-white p-3.5"
                >
                  <div className="grid size-10 place-items-center rounded-xl bg-[#f6eee9] text-xl">
                    {isGiftDay ? getCategoryEmoji(record.category) : '🔔'}
                  </div>
                  <div className="flex-1">
                    <span className="text-[8px] text-[#dc725f]">
                      {isGiftDay ? '받은 선물' : '답례 알림'}
                    </span>
                    <h3 className="my-0.5 text-xs">
                      {record.person} · {record.gift}
                    </h3>
                    <p className="text-[9px] text-[#908a82]">
                      {record.occasion} · {record.price}
                    </p>
                  </div>
                  <ChevronRight size={17} className="text-[#b1aba3]" />
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[14px] border border-dashed border-[#d8d2ca] bg-white p-[26px] text-center text-muted">
            <CalendarDays size={24} className="mx-auto" />
            <p className="mt-[5px] text-[10px]">기록된 마음이 없는 날이에요.</p>
          </div>
        )}
      </section>
    </>
  );
}

export default MonthCalendar;
