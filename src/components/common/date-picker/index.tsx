'use client';

import { CalendarDays, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { formatDate, getTodayDateKey, toDateKey } from '@/utils/formatDate';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
/** 펼친 달력의 크기 — 아래로 열지 위로 열지, 화면 밖으로 나가는지 판단하는 데 쓴다 */
const PANEL_HEIGHT = 300;
const PANEL_WIDTH = 236;
const GAP = 6;

const toCursor = (date: string) => {
  const [year, month] = (date || getTodayDateKey()).split('-').map(Number);
  return { year, month };
};

/** 스크롤을 갖고 있는 조상들 — 달력이 떠 있는 동안 여기를 다 잠근다. */
const getScrollableAncestors = (node: HTMLElement | null) => {
  const found: HTMLElement[] = [];

  for (let current = node?.parentElement; current; current = current.parentElement) {
    const { overflowY } = getComputedStyle(current);
    if (overflowY === 'auto' || overflowY === 'scroll') found.push(current);
  }

  return [...found, document.body];
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
 *
 * 펼친 달력은 body 에 포털로 붙인다 — 모달처럼 overflow 가 잠긴 곳 안에서도 잘리지 않아야 한다.
 * 화면 기준 좌표로 고정되므로 떠 있는 동안에는 스크롤을 막는다.
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
  const panelRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0 });
  const [cursor, setCursor] = useState(() => toCursor(value));

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      // 달력은 포털로 나가 있어 컨테이너 밖이다 — 패널도 같이 확인한다.
      if (containerRef.current?.contains(target) || panelRef.current?.contains(target)) return;

      setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  /** 화면 크기가 바뀌면 붙여 둔 좌표가 어긋나므로 닫는다. */
  useEffect(() => {
    if (!isOpen) return;

    const close = () => setIsOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [isOpen]);

  /** 달력이 떠 있는 동안 스크롤 잠금. 사라지는 스크롤바만큼 여백을 채워 화면이 흔들리지 않게 한다. */
  useEffect(() => {
    if (!isOpen) return;

    const restores = getScrollableAncestors(containerRef.current).map(element => {
      const { overflow, paddingRight } = element.style;
      const gap = element.offsetWidth - element.clientWidth;

      element.style.overflow = 'hidden';
      if (gap > 0)
        element.style.paddingRight = `${parseFloat(getComputedStyle(element).paddingRight) + gap}px`;

      return () => {
        element.style.overflow = overflow;
        element.style.paddingRight = paddingRight;
      };
    });

    return () => restores.forEach(restore => restore());
  }, [isOpen]);

  const handleOpen = () => {
    // 열 때마다 고른 날짜의 달로 맞추고, 아래 공간이 부족하면 위로 펼친다.
    setCursor(toCursor(value));

    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const opensUp = rect.bottom + PANEL_HEIGHT > window.innerHeight;
      setPanelPosition({
        top: opensUp ? rect.top - PANEL_HEIGHT - GAP : rect.bottom + GAP,
        // 오른쪽 끝에 붙은 칸이면 화면 밖으로 나가지 않게 왼쪽으로 당긴다.
        left: Math.max(GAP, Math.min(rect.left, window.innerWidth - PANEL_WIDTH - GAP)),
      });
    }

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

  const arrowClass =
    'grid size-6 cursor-pointer place-items-center rounded-md text-[#7c7770] hover:bg-cream';

  const panel = (
    <div
      ref={panelRef}
      style={{ top: panelPosition.top, left: panelPosition.left, width: PANEL_WIDTH }}
      className="fixed z-40 rounded-[14px] border border-line bg-white p-3 shadow-[0_12px_30px_#4b3a3222]"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex">
          <button
            type="button"
            onClick={() => moveMonth(-12)}
            aria-label="이전 해"
            className={arrowClass}
          >
            <ChevronsLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            aria-label="이전 달"
            className={arrowClass}
          >
            <ChevronLeft size={15} />
          </button>
        </div>
        <b className="text-[12px]">
          {year}년 {month}월
        </b>
        <div className="flex">
          <button
            type="button"
            onClick={() => moveMonth(1)}
            aria-label="다음 달"
            className={arrowClass}
          >
            <ChevronRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => moveMonth(12)}
            aria-label="다음 해"
            className={arrowClass}
          >
            <ChevronsRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS.map((weekday, index) => (
          <span
            key={weekday}
            className={`pb-1 text-center text-[9px] ${index === 0 ? 'text-[#db725f]' : 'text-[#9d968e]'}`}
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
  );

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

      {isOpen ? createPortal(panel, document.body) : null}
    </div>
  );
}

export default DatePicker;
