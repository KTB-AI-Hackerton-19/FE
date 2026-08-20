'use client';

import { useState } from 'react';

/**
 * 목록의 선택 삭제 상태.
 * 삭제 줄은 건수·정렬과 같은 줄에 있고 체크박스는 카드에 있어,
 * 상태를 두 컴포넌트가 나눠 쓰기 위해 여기로 뺐다.
 */
export const useRecordSelection = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const start = () => setIsSelecting(true);

  const cancel = () => {
    setIsSelecting(false);
    setSelectedIds([]);
  };

  const toggle = (id: number) =>
    setSelectedIds(current =>
      current.includes(id) ? current.filter(value => value !== id) : [...current, id]
    );

  return {
    isSelecting,
    selectedIds,
    isConfirmOpen,
    start,
    cancel,
    toggle,
    selectAll: setSelectedIds,
    clear: () => setSelectedIds([]),
    openConfirm: () => setIsConfirmOpen(true),
    closeConfirm: () => setIsConfirmOpen(false),
  };
};

export type RecordSelectionT = ReturnType<typeof useRecordSelection>;
