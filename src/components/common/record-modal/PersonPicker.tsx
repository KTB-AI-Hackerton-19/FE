'use client';

import { useEffect, useRef, useState } from 'react';

import AddButton from '@/components/common/add-button';
import PersonFormModal from '@/components/common/person-form-modal';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSearchPeople } from '@/hooks/useGetPeople';
import type { PersonT } from '@/types/person';

type PersonPickerProps = {
  value: string;
  onChange: (name: string) => void;
  /** 이미 등록된 사람을 골랐을 때 — 관계까지 함께 채운다 */
  onPick: (person: PersonT) => void;
  /** 사람 등록 모달이 열리고 닫힌 것을 알린다 — 아래 기록 모달을 감추기 위해 */
  onSubModalToggle: (isOpen: boolean) => void;
  className: string;
};

/**
 * 보낸 사람 입력. 타자를 치면 이미 등록된 사람을 좁혀 보여 준다.
 * 목록에서 고르지 않아도 되고, 그 경우 서버가 이름으로 사람을 찾거나 새로 만든다.
 */
function PersonPicker({ value, onChange, onPick, onSubModalToggle, className }: PersonPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const debouncedValue = useDebouncedValue(value);
  const { searchedPeople } = useSearchPeople(debouncedValue);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const handlePick = (person: PersonT) => {
    onPick(person);
    setIsOpen(false);
  };

  const openForm = () => {
    setIsFormOpen(true);
    onSubModalToggle(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    onSubModalToggle(false);
  };

  // 이미 고른 사람과 이름이 정확히 같으면 목록에 다시 띄울 이유가 없다.
  const suggestions = searchedPeople.filter(person => person.name !== value);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-1.5">
        {/* 목록은 + 버튼을 뺀 입력칸 너비에 맞춘다 — 이 span 이 기준이 된다. */}
        <span className="relative min-w-0 flex-1">
          <input
            value={value}
            onChange={event => {
              onChange(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={event => event.key === 'Escape' && setIsOpen(false)}
            placeholder="선택 또는 검색"
            className={`${className} w-full`}
          />

          {isOpen && suggestions.length > 0 ? (
            <ul className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-[196px] w-full overflow-auto rounded-[12px] border border-line bg-white p-1 shadow-[0_12px_30px_#4b3a3218]">
              {suggestions.map(person => (
                <li key={person.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(person)}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] hover:bg-cream"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#f5e3dd] text-[10px] text-[#b86152]">
                      {person.name[0]}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{person.name}</span>
                    <span className="shrink-0 text-[10px] text-subtle">
                      {person.relation ?? '관계 미정'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </span>
        <AddButton label="새로운 사람 등록" onClick={openForm} />
      </div>

      {isFormOpen ? <PersonFormModal onCreated={handlePick} onClose={closeForm} /> : null}
    </div>
  );
}

export default PersonPicker;
