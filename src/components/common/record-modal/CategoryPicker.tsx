'use client';

import { useEffect, useRef, useState } from 'react';

import CategoryAddModal from '@/components/common/category-add-modal';
import type { CategoryT, KindT } from '@/types/category';

import AddButton from './AddButton';

type CategoryPickerProps = {
  value: string;
  categories: CategoryT[];
  onChange: (name: string) => void;
  /** 새로 만들 카테고리가 속할 분류 */
  addKind: KindT;
  addTitle: string;
  addNameLabel: string;
  addPlaceholder: string;
  /** 카테고리 추가 모달이 열리고 닫힌 것을 알린다 */
  onSubModalToggle: (isOpen: boolean) => void;
  className: string;
};

/** 사람 선택과 같은 형태의 카테고리 선택. 눌러서 고르거나 타자로 좁힌다. */
function CategoryPicker({
  value,
  categories,
  onChange,
  addKind,
  addTitle,
  addNameLabel,
  addPlaceholder,
  onSubModalToggle,
  className,
}: CategoryPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // 목록을 닫을 때 고르지 않은 문자열이 남아 있으면 비운다 — 없는 카테고리로 저장되면 안 된다.
  const close = () => {
    setIsOpen(false);
    if (!categories.some(category => category.name === value)) onChange('');
  };

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return;

      setIsOpen(false);
      if (!categories.some(category => category.name === value)) onChange('');
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [categories, value, onChange]);

  const openAdd = () => {
    setIsAddOpen(true);
    onSubModalToggle(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    onSubModalToggle(false);
  };

  const handlePick = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  const keyword = value.trim();
  const suggestions = categories.filter(
    category => category.name !== value && (!keyword || category.name.includes(keyword))
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-1.5">
        <input
          value={value}
          onChange={event => {
            onChange(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={event => event.key === 'Escape' && close()}
          placeholder="선택 또는 검색"
          className={`${className} min-w-0 flex-1`}
        />
        <AddButton label={addTitle} onClick={openAdd} />
      </div>

      {isOpen && suggestions.length > 0 ? (
        <ul className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-[196px] w-full overflow-auto rounded-[12px] border border-line bg-white p-1 shadow-[0_12px_30px_#4b3a3218]">
          {suggestions.map(category => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => handlePick(category.name)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] hover:bg-cream"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#f4efe9] text-[11px]">
                  {category.emoji}
                </span>
                <span className="min-w-0 flex-1 truncate">{category.name}</span>
                <span className="shrink-0 text-[10px] text-subtle">{category.recordCount}건</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {isAddOpen ? (
        <CategoryAddModal
          kinds={[{ key: addKind, label: '' }]}
          title={addTitle}
          nameLabel={addNameLabel}
          namePlaceholder={addPlaceholder}
          onCreated={created => handlePick(created.name)}
          onClose={closeAdd}
        />
      ) : null}
    </div>
  );
}

export default CategoryPicker;
