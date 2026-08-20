'use client';

import { useEffect, useRef, useState } from 'react';

import AddButton from '@/components/common/add-button';
import CategoryAddModal from '@/components/common/category-add-modal';
import type { CategoryT } from '@/types/category';

type CategoryPickerProps = {
  value: string;
  categories: CategoryT[];
  onChange: (name: string) => void;
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
  /**
   * 이미 고른 값이면 그 이름이 검색어로 쓰여 목록이 비어 버린다 (AI 가 채워 온 '기타' 등).
   * 고른 상태에서는 거르지 말고 전체를 보여주고 고른 것만 표시해 준다.
   */
  const isPicked = categories.some(category => category.name === keyword);
  const suggestions = isPicked
    ? categories
    : categories.filter(category => !keyword || category.name.includes(keyword));

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
            onKeyDown={event => event.key === 'Escape' && close()}
            placeholder="선택 또는 검색"
            className={`${className} w-full`}
          />

          {isOpen && suggestions.length > 0 ? (
            <ul className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-[196px] w-full overflow-auto rounded-[12px] border border-line bg-white p-1 shadow-[0_12px_30px_#4b3a3218]">
              {suggestions.map(category => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(category.name)}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] hover:bg-cream ${
                      category.name === value ? 'bg-cream font-bold text-coral-deep' : ''
                    }`}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#f4efe9] text-[11px]">
                      {category.emoji}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{category.name}</span>
                    <span className="shrink-0 text-[10px] text-subtle">
                      {category.recordCount}건
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </span>
        <AddButton label={addTitle} onClick={openAdd} />
      </div>

      {isAddOpen ? (
        <CategoryAddModal
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
