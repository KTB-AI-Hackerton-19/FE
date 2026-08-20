'use client';

import { Trash2 } from 'lucide-react';

import CheckBox from '@/components/common/check-box';

type SelectionToolbarProps = {
  isSelecting: boolean;
  selectedCount: number;
  /** 지금 화면에 있는 항목 수 — 전체선택 여부를 판단한다 */
  totalCount: number;
  onStart: () => void;
  onToggleAll: () => void;
  onDelete: () => void;
  onCancel: () => void;
  /** 고르지 않을 때 왼쪽에 놓을 것 (건수 등) */
  leading?: React.ReactNode;
  /** 고르지 않을 때 오른쪽 끝에 놓을 것 (정렬 등) */
  trailing?: React.ReactNode;
  className?: string;
};

/**
 * 목록 위 한 줄을 통째로 그린다 — 건수·정렬과 같은 줄을 쓰기 위해서다.
 * 기록·사람 목록이 같은 모양을 쓴다.
 */
function SelectionToolbar({
  isSelecting,
  selectedCount,
  totalCount,
  onStart,
  onToggleAll,
  onDelete,
  onCancel,
  leading,
  trailing,
  className = '',
}: SelectionToolbarProps) {
  const actionClass =
    'flex cursor-pointer items-center gap-1 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div
      className={`flex min-h-[28px] items-center justify-between gap-3 text-[11px] ${className}`}
    >
      {isSelecting ? (
        <button
          type="button"
          onClick={onToggleAll}
          className="flex min-w-0 cursor-pointer items-center gap-2 font-bold"
        >
          <CheckBox checked={totalCount > 0 && selectedCount === totalCount} />
          전체선택
        </button>
      ) : (
        // 왼쪽에 놓을 게 없어도 자리를 잡아 둔다 — 없으면 오른쪽 묶음이 왼쪽으로 붙는다.
        (leading ?? <span />)
      )}

      <div className="flex shrink-0 items-center gap-3.5">
        <button
          type="button"
          onClick={isSelecting ? onDelete : onStart}
          disabled={isSelecting && selectedCount === 0}
          className={`${actionClass} ${isSelecting ? 'text-coral-dark hover:text-coral-deep' : 'text-[#8b857e] hover:text-ink'}`}
        >
          <Trash2 size={15} /> 삭제
          {isSelecting && selectedCount > 0 ? ` ${selectedCount}` : ''}
        </button>

        {isSelecting ? (
          <button
            type="button"
            onClick={onCancel}
            className={`${actionClass} text-[#8b857e] hover:text-ink`}
          >
            취소
          </button>
        ) : (
          trailing
        )}
      </div>
    </div>
  );
}

export default SelectionToolbar;
