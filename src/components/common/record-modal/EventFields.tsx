'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import DatePicker from '@/components/common/date-picker';
import { useGetEventCategories } from '@/hooks/useGetEventCategories';
import type { EventCategoryT } from '@/types/eventCategory';

type EventFieldsProps = {
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
 * 경사·조사는 따로 고르지 않는다. 목록에서 묶어 보여주고, 고른 유형에서 따라간다.
 */
function EventFields({
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

  // 서버가 경사 → 조사 순으로 내려주므로 순서를 지키며 묶기만 한다.
  const groups = eventCategories.reduce<
    { key: string; label: string; options: EventCategoryT[] }[]
  >((acc, option) => {
    const group = acc.find(item => item.key === option.group);
    if (group) group.options.push(option);
    else acc.push({ key: option.group, label: option.groupLabel, options: [option] });

    return acc;
  }, []);

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
        <span className={labelTextClass}>경조사 유형</span>
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
                <span className="min-w-0 flex-1 truncate">{picked.label}</span>
              </>
            ) : (
              <span className="min-w-0 flex-1 truncate">선택</span>
            )}
            <ChevronDown size={13} className="shrink-0 text-subtle" />
          </button>

          {isOpen ? (
            <ul className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-[268px] w-full overflow-auto rounded-[12px] border border-line bg-white p-1 shadow-[0_12px_30px_#4b3a3218]">
              {groups.map(group => (
                <li key={group.key}>
                  <p className="px-2 pt-1.5 pb-1 text-[9px] font-bold text-subtle">{group.label}</p>
                  <ul>
                    {group.options.map(option => (
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
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={labelClass}>
        <span className={labelTextClass}>경조사 날짜</span>
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
