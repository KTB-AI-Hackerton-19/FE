'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import AddButton from '@/components/common/add-button';
import { useGetRelationships } from '@/hooks/useGetRelationships';

import RelationAddModal from './RelationAddModal';

type RelationPickerProps = {
  value: string;
  onChange: (value: string) => void;
  /** 관계 추가 모달이 열리고 닫힌 것을 알린다 — 아래 모달을 감추는 데 쓴다 */
  onSubModalToggle?: (isOpen: boolean) => void;
  className: string;
};

/** 관계 선택. 목록에서 고르거나, 없으면 + 로 새로 만든다. */
function RelationPicker({ value, onChange, onSubModalToggle, className }: RelationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { relationships } = useGetRelationships();

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const openAdd = () => {
    setIsOpen(false);
    setIsAddOpen(true);
    onSubModalToggle?.(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    onSubModalToggle?.(false);
  };

  const handlePick = (picked: string) => {
    // 고른 항목을 다시 누르면 해제된다 — 관계는 필수가 아니다.
    onChange(picked === value ? '' : picked);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => setIsOpen(current => !current)}
          onKeyDown={event => event.key === 'Escape' && setIsOpen(false)}
          className={`${className} flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-1.5 text-left`}
        >
          <span className={value ? 'truncate' : 'truncate text-subtle'}>{value || '선택'}</span>
          <ChevronDown size={13} className="shrink-0 text-subtle" />
        </button>
        <AddButton label="관계 추가" onClick={openAdd} />
      </div>

      {isOpen ? (
        <ul className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-[196px] w-full overflow-auto rounded-[12px] border border-line bg-white p-1 shadow-[0_12px_30px_#4b3a3218]">
          {relationships.map(relationship => (
            <li key={relationship.value}>
              <button
                type="button"
                onClick={() => handlePick(relationship.value)}
                className={`w-full cursor-pointer rounded-lg px-2 py-1.5 text-left text-[11px] hover:bg-cream ${
                  relationship.value === value ? 'bg-cream font-bold text-coral-deep' : ''
                }`}
              >
                {relationship.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {isAddOpen ? (
        <RelationAddModal onCreated={created => onChange(created.value)} onClose={closeAdd} />
      ) : null}
    </div>
  );
}

export default RelationPicker;
