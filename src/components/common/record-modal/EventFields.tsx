'use client';

import { useEffect, useRef, useState } from 'react';

import DatePicker from '@/components/common/date-picker';
import { useGetEventCategories } from '@/hooks/useGetEventCategories';
import type { EventCategoryT, EventGroupT } from '@/types/eventCategory';

const EVENT_GROUPS = [
  { key: 'CELEBRATION', label: '경사' },
  { key: 'CONDOLENCE', label: '조사' },
] as const satisfies readonly { key: EventGroupT; label: string }[];

type EventFieldsProps = {
  groupValue: EventGroupT;
  onGroupChange: (group: EventGroupT) => void;
  /** 고른 경조사 유형. 서버가 기록에 한글 라벨로 돌려주므로 라벨로 들고 있는다 */
  categoryValue: string;
  /** 유형을 고르면 그 유형과 속한 그룹을 함께 알린다 */
  onPick: (picked: EventCategoryT) => void;
  dateValue: string;
  onDateChange: (date: string) => void;
  labelClass: string;
  labelTextClass: string;
  fieldClass: string;
};

/**
 * 경조사는 서버가 정한 고정 7종 중에서 고른다 — 이름을 직접 만들지 않는다.
 * 경사·조사 버튼은 그 아래 유형 목록을 좁히는 역할이다.
 */
function EventFields({
  groupValue,
  onGroupChange,
  categoryValue,
  onPick,
  dateValue,
  onDateChange,
  labelClass,
  labelTextClass,
  fieldClass,
}: EventFieldsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { eventCategories } = useGetEventCategories();

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const options = eventCategories.filter(option => option.group === groupValue);
  // AI 초안은 라벨로, 직접 고르면 라벨로 들어온다 — 코드로 온 값도 받아 준다.
  const picked = eventCategories.find(
    option => option.label === categoryValue || option.name === categoryValue
  );

  const handlePick = (option: EventCategoryT) => {
    onPick(option);
    setIsOpen(false);
  };

  return (
    <>
      <div className={labelClass}>
        <span className={labelTextClass}>행사 유형</span>
        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(current => !current)}
            onKeyDown={event => event.key === 'Escape' && setIsOpen(false)}
            aria-expanded={isOpen}
            className={`${fieldClass} flex w-full cursor-pointer items-center gap-1.5 text-left ${
              picked ? '' : 'text-subtle'
            }`}
          >
            {picked ? (
              <>
                <span className="shrink-0">{picked.emoji}</span>
                <span className="truncate">{picked.label}</span>
              </>
            ) : (
              '선택'
            )}
          </button>

          {isOpen ? (
            <ul className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-[196px] w-full overflow-auto rounded-[12px] border border-line bg-white p-1 shadow-[0_12px_30px_#4b3a3218]">
              {options.map(option => (
                <li key={option.name}>
                  <button
                    type="button"
                    onClick={() => handlePick(option)}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] hover:bg-cream ${
                      option.name === picked?.name ? 'bg-cream font-bold text-coral-deep' : ''
                    }`}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#f4efe9] text-[11px]">
                      {option.emoji}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={labelClass}>
        <span className={labelTextClass}>경사·조사</span>
        <div className="flex gap-1.5">
          {EVENT_GROUPS.map(option => (
            <button
              key={option.key}
              type="button"
              onClick={() => onGroupChange(option.key)}
              aria-pressed={groupValue === option.key}
              className={`h-9 flex-1 cursor-pointer rounded-[10px] border text-[11px] font-bold transition ${
                groupValue === option.key
                  ? 'border-coral-soft bg-coral-soft text-coral-deep'
                  : 'border-line bg-white text-[#a5a09a] hover:border-[#d7c7bc] hover:text-[#7c7770]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`${labelClass} col-span-2`}>
        <span className={labelTextClass}>행사 날짜</span>
        <DatePicker
          value={dateValue}
          onChange={onDateChange}
          placeholder="선택 안 함"
          clearable
          className={fieldClass}
        />
      </div>
    </>
  );
}

export default EventFields;
