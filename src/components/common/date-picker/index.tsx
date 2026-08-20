'use client';

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { formatDate, getTodayDateKey, toDateKey } from '@/utils/formatDate';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
/** 펼친 달력의 대략적인 높이 — 아래로 열지 위로 열지 정하는 데 쓴다 */
const PANEL_HEIGHT = 300;

const toCursor = (date: string) => {
  const [year, month] = (date || getTodayDateKey()).split('-').map(Number);
  return { year, month };
};

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** 비울 수 있는 날짜인지 (답례 알림일처럼) */
  clearable?: boolean;
  className: string;
};

/**
 * 브라우저 기본 달력은 스타일을 바꿀 수 없어 직접 그린다.
 * 캘린더 페이지의 월 격자와 계산 방식은 같지만, 그쪽은 일정 데이터에 묶여 있어 따로 둔다.
 */
function DatePicker({
  value,
  onChange,
  placeholder = '선택',
  clearable,
  className,
}: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [opensUp, setOpensUp] = useState(false);
  const [cursor, setCursor] = useState(() => toCursor(value));

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handleOpen = () => {
    // 열 때마다 고른 날짜의 달로 맞추고, 아래 공간이 부족하면 위로 펼친다.
    setCursor(toCursor(value));

    const rect = triggerRef.current?.getBoundingClientRect();
    setOpensUp(Boolean(rect && rect.bottom + PANEL_HEIGHT > window.innerHeight));

    setIsOpen(true);
  };

  const handlePick = (date: string) => {
    onChange(date);
    setIsOpen(false);
  };

  const moveMonth = (amount: number) => {
    const next = new Date(cursor.year, cursor.month - 1 + amount, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() + 1 });
  };

  const { year, month } = cursor;
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = getTodayDateKey();

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        aria-expanded={isOpen}
        className={`${className} flex w-full cursor-pointer items-center justify-between gap-2 text-left ${
          value ? '' : 'text-subtle'
        }`}
      >
        {value ? formatDate(value) : placeholder}
        <CalendarDays size={14} className="shrink-0 text-subtle" />
      </button>

      {isOpen ? (
        <div
          className={`absolute left-0 z-10 w-[236px] rounded-[14px] border border-line bg-white p-3 shadow-[0_12px_30px_#4b3a3222] ${
            opensUp ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              aria-label="이전 달"
              className="grid size-6 cursor-pointer place-items-center rounded-md text-[#7c7770] hover:bg-cream"
            >
              <ChevronLeft size={15} />
            </button>
            <b className="text-[12px]">
              {year}년 {month}월
            </b>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              aria-label="다음 달"
              className="grid size-6 cursor-pointer place-items-center rounded-md text-[#7c7770] hover:bg-cream"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-7">
            {WEEKDAYS.map((weekday, index) => (
              <span
                key={weekday}
                className={`pb-1 text-center text-[9px] ${
                  index === 0 ? 'text-[#db725f]' : 'text-[#9d968e]'
                }`}
              >
                {weekday}
              </span>
            ))}

            {Array.from({ length: firstWeekday }, (_, index) => (
              <span key={`empty-${index}`} />
            ))}

            {Array.from({ length: daysInMonth }, (_, index) => {
              const dateKey = toDateKey(year, month, index + 1);
              const isSelected = dateKey === value;
              const isToday = dateKey === today;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => handlePick(dateKey)}
                  aria-pressed={isSelected}
                  className={`grid size-[30px] cursor-pointer place-items-center rounded-lg text-[11px] transition ${
                    isSelected ? 'bg-coral font-bold text-white' : 'hover:bg-cream'
                  } ${!isSelected && isToday ? 'font-bold text-coral-deep' : ''}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex gap-1.5 border-t border-line pt-2">
            <button
              type="button"
              onClick={() => handlePick(today)}
              className="flex-1 cursor-pointer rounded-md py-1 text-[10px] font-bold text-[#7c7770] hover:bg-cream"
            >
              오늘
            </button>
            {clearable ? (
              <button
                type="button"
                onClick={() => handlePick('')}
                className="flex-1 cursor-pointer rounded-md py-1 text-[10px] font-bold text-[#a5a09a] hover:bg-cream"
              >
                지우기
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default DatePicker;
