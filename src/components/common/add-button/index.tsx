'use client';

import { Plus } from 'lucide-react';

type AddButtonProps = {
  label: string;
  onClick: () => void;
};

/** 입력창 옆에 붙는 '새로 만들기' 버튼. 입력창과 같은 36px 정사각형이다. */
function AddButton({ label, onClick }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-coral-soft bg-coral-soft text-coral-deep transition hover:border-[#f7d7cc] hover:bg-[#ffe6dd]"
    >
      <Plus size={15} strokeWidth={2.8} />
    </button>
  );
}

export default AddButton;
