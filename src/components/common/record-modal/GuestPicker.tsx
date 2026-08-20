'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import AddButton from '@/components/common/add-button';
import PersonFormModal from '@/components/common/person-form-modal';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useSearchPeople } from '@/hooks/useGetPeople';
import type { PersonT } from '@/types/person';

/** 고른 보낸 사람. 목록에서 고르면 personId 가 붙고, 직접 적으면 이름만 남는다 */
export type GuestT = {
  personId?: number;
  name: string;
  relation?: string;
};

type GuestPickerProps = {
  guests: GuestT[];
  onChange: (guests: GuestT[]) => void;
  /** 사람 등록 모달이 열리고 닫힌 것을 알린다 — 아래 기록 모달을 감추기 위해 */
  onSubModalToggle: (isOpen: boolean) => void;
  className: string;
};

/**
 * 경조사는 한 행사에 여러 명이 오므로 보낸 사람을 여러 명 고른다.
 * 고른 사람 수만큼 기록이 만들어지고, 금액·행사 정보는 폼의 값을 함께 쓴다.
 */
function GuestPicker({ guests, onChange, onSubModalToggle, className }: GuestPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const debouncedKeyword = useDebouncedValue(keyword);
  const { searchedPeople } = useSearchPeople(debouncedKeyword);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const add = (guest: GuestT) => {
    // 같은 사람을 두 번 넣으면 기록도 두 번 만들어진다.
    if (guests.some(item => item.name === guest.name)) return;

    onChange([...guests, guest]);
    setKeyword('');
  };

  const remove = (name: string) => onChange(guests.filter(guest => guest.name !== name));

  const handlePickPerson = (person: PersonT) => {
    add({ personId: person.id, name: person.name, relation: person.relation ?? undefined });
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

  // 이미 고른 사람은 목록에서 뺀다.
  const picked = new Set(guests.map(guest => guest.name));
  const suggestions = searchedPeople.filter(person => !picked.has(person.name));

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-1.5">
        {/* 목록은 + 버튼을 뺀 입력칸 너비에 맞춘다 — 이 span 이 기준이 된다. */}
        <span className="relative min-w-0 flex-1">
          <input
            value={keyword}
            onChange={event => {
              setKeyword(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={event => {
              if (event.key === 'Escape') setIsOpen(false);
              // 목록에 없는 사람은 이름만 적어 넣는다 — 하객은 '사람들'에 올리지 않는다.
              if (event.key === 'Enter' && keyword.trim()) {
                event.preventDefault();
                add({ name: keyword.trim() });
              }
            }}
            placeholder={guests.length > 0 ? '더 선택하기' : '선택 또는 검색'}
            className={`${className} w-full`}
          />

          {isOpen && suggestions.length > 0 ? (
            <ul className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-[196px] w-full overflow-auto rounded-[12px] border border-line bg-white p-1 shadow-[0_12px_30px_#4b3a3218]">
              {suggestions.map(person => (
                <li key={person.id}>
                  <button
                    type="button"
                    onClick={() => handlePickPerson(person)}
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

      {guests.length > 0 ? (
        <ul className="mt-1.5 flex flex-wrap gap-1">
          {guests.map(guest => (
            <li key={guest.name}>
              <button
                type="button"
                onClick={() => remove(guest.name)}
                aria-label={`${guest.name} 빼기`}
                className="flex cursor-pointer items-center gap-1 rounded-full bg-coral-soft px-2 py-1 text-[10px] text-coral-deep transition hover:bg-[#ffe6dd]"
              >
                <b>{guest.name}</b>
                {/* 등록된 사람은 각자의 관계를 그대로 쓴다 — 여기서 바꾸지 않는다. */}
                {guest.relation ? <span className="opacity-70">· {guest.relation}</span> : null}
                <X size={11} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {isFormOpen ? <PersonFormModal onCreated={handlePickPerson} onClose={closeForm} /> : null}
    </div>
  );
}

export default GuestPicker;
