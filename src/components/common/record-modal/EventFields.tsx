'use client';

import { useEffect, useRef, useState } from 'react';

import CategoryAddModal from '@/components/common/category-add-modal';
import type { CategoryT, KindT } from '@/types/category';

import AddButton from './AddButton';

const EVENT_KINDS = [
  { key: 'CELEBRATION', label: '경사' },
  { key: 'CONDOLENCE', label: '조사' },
] as const;

export type EventKindT = (typeof EVENT_KINDS)[number]['key'];

type EventFieldsProps = {
  kindValue: EventKindT;
  onKindChange: (kind: EventKindT) => void;
  nameValue: string;
  onNameChange: (name: string) => void;
  /** 이미 있는 행사들 — 같은 행사를 두 번 만들지 않도록 제안한다 */
  events: CategoryT[];
  /** 행사를 고르거나 새로 만들었을 때 — 이름·분류·날짜를 폼에 채운다 */
  onCreated: (created: CategoryT, date: string) => void;
  /** 추가 모달이 열리고 닫힌 것을 알린다 — 아래 기록 모달을 감추기 위해 */
  onSubModalToggle: (isOpen: boolean) => void;
  labelClass: string;
  labelTextClass: string;
  fieldClass: string;
};

/**
 * 경조사는 목록에서 고르는 게 아니라 경사·조사를 정하고 행사 이름을 직접 적는다.
 * 다만 같은 행사에 여러 명이 부조하므로, 이미 만든 행사는 제안해서 중복 생성을 막는다.
 */
function EventFields({
  kindValue,
  onKindChange,
  nameValue,
  onNameChange,
  events,
  onCreated,
  onSubModalToggle,
  labelClass,
  labelTextClass,
  fieldClass,
}: EventFieldsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const keyword = nameValue.trim();
  const suggestions = events.filter(
    event =>
      event.kind === (kindValue as KindT) &&
      event.name !== nameValue &&
      (!keyword || event.name.includes(keyword))
  );

  // 이미 있는 행사를 고르면 그 행사의 날짜까지 폼에 채운다.
  const handlePick = (event: CategoryT) => {
    onCreated(event, event.eventDate ?? '');
    setIsOpen(false);
  };

  const openAdd = () => {
    setIsAddOpen(true);
    onSubModalToggle(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    onSubModalToggle(false);
  };

  return (
    <>
      <div className={labelClass}>
        <span className={labelTextClass}>행사 이름</span>
        <div ref={containerRef} className="relative flex gap-1.5">
          <input
            value={nameValue}
            onChange={changeEvent => {
              onNameChange(changeEvent.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={changeEvent => changeEvent.key === 'Escape' && setIsOpen(false)}
            placeholder="선택 또는 입력"
            className={`${fieldClass} min-w-0 flex-1`}
          />
          <AddButton label="새 행사 추가" onClick={openAdd} />

          {isOpen && suggestions.length > 0 ? (
            <ul className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-[196px] w-full overflow-auto rounded-[12px] border border-line bg-white p-1 shadow-[0_12px_30px_#4b3a3218]">
              {suggestions.map(event => (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(event)}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] hover:bg-cream"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#f4efe9] text-[11px]">
                      {event.emoji}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{event.name}</span>
                    <span className="shrink-0 text-[10px] text-subtle">{event.recordCount}명</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={labelClass}>
        <span className={labelTextClass}>행사 카테고리</span>
        <div className="flex gap-1.5">
          {EVENT_KINDS.map(option => (
            <button
              key={option.key}
              type="button"
              onClick={() => onKindChange(option.key)}
              aria-pressed={kindValue === option.key}
              className={`h-9 flex-1 cursor-pointer rounded-[10px] border text-[11px] font-bold transition ${
                kindValue === option.key
                  ? 'border-coral-soft bg-coral-soft text-coral-deep'
                  : 'border-line bg-white text-[#a5a09a] hover:border-[#d7c7bc] hover:text-[#7c7770]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {isAddOpen ? (
        <CategoryAddModal
          kinds={EVENT_KINDS}
          title="새 행사 추가"
          nameLabel="행사 이름"
          namePlaceholder="내 결혼식"
          withDate
          onCreated={onCreated}
          onClose={closeAdd}
        />
      ) : null}
    </>
  );
}

export default EventFields;
