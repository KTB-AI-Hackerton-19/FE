'use client';

import { Plus } from 'lucide-react';

/** 옆 칸 높이에 맞춘다 — 기록 모달은 36px, 사람 등록 모달은 40px 이다. */
const SIZE_CLASS = {
  md: 'size-9',
  lg: 'size-10',
} as const;

type AddButtonProps = {
  label: string;
  onClick: () => void;
  size?: keyof typeof SIZE_CLASS;
};

/** 입력창 옆에 붙는 '새로 만들기' 버튼. 옆 칸과 같은 높이의 정사각형이다. */
function AddButton({ label, onClick, size = 'md' }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid ${SIZE_CLASS[size]} shrink-0 cursor-pointer place-items-center rounded-[10px] border border-coral-soft bg-coral-soft text-coral-deep transition hover:border-[#f7d7cc] hover:bg-[#ffe6dd]`}
    >
      <Plus size={15} strokeWidth={2.8} />
    </button>
  );
}

export default AddButton;
