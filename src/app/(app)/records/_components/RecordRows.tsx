'use client';

import { ChevronRight, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import ConfirmDialog from '@/components/common/confirm-dialog';
import EmptyState from '@/components/common/empty-state';
import { recordEmojiStyles } from '@/components/common/record-card/recordCard.style';
import ThankedBadge from '@/components/common/thanked-badge';
import { useAppUi } from '@/hooks/useAppUi';
import { useDeleteGiftRecords } from '@/hooks/useGiftRecordMutations';
import type { GiftRecordT } from '@/types/record';
import { formatAmount } from '@/utils/formatAmount';
import { formatDate } from '@/utils/formatDate';
import { getRecordCategoryLabel } from '@/utils/recordLabel';

type RecordRowsProps = {
  records: GiftRecordT[];
  isPending: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  /** 비었을 때 기록 모달을 여는 버튼을 띄울지 (검색 결과가 없는 경우엔 감춘다) */
  canRecord?: boolean;
  /** 경조사 목록은 행마다 카테고리가 같아 감추는 편이 낫다 */
  showCategory?: boolean;
};

/** 선물·경조사 탭이 함께 쓰는 기록 목록. 선택 삭제까지 여기서 처리한다. */
function RecordRows({
  records,
  isPending,
  emptyTitle,
  emptyDescription,
  canRecord = false,
  showCategory = true,
}: RecordRowsProps) {
  const { showToast, openRecordModal } = useAppUi();
  const { deleteGiftRecordsMutation, isDeleteGiftRecordsPending } = useDeleteGiftRecords();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const selectedRecords = records.filter(record => selectedIds.includes(record.id));

  const exitSelecting = () => {
    setIsSelecting(false);
    setSelectedIds([]);
  };

  const toggleSelected = (id: number) =>
    setSelectedIds(current =>
      current.includes(id) ? current.filter(value => value !== id) : [...current, id]
    );

  const handleDelete = () =>
    deleteGiftRecordsMutation(selectedIds, {
      onSuccess: ({ deletedRecords }) => {
        // 서버가 실제로 지운 수를 돌려주므로 그대로 안내한다.
        showToast(`기록 ${deletedRecords}개를 삭제했어요`);
        setIsConfirmOpen(false);
        exitSelecting();
      },
      onError: error => {
        showToast(error instanceof ApiError ? error.message : '삭제하지 못했어요');
        setIsConfirmOpen(false);
      },
    });

  if (records.length === 0 && !isPending) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={canRecord ? '마음 기록하기' : undefined}
        onAction={canRecord ? openRecordModal : undefined}
      />
    );
  }

  return (
    <>
      <div className="mb-2.5 flex min-h-[30px] items-center justify-end gap-2">
        {isSelecting ? (
          <>
            <span className="mr-auto text-[11px] text-muted">{selectedIds.length}개 선택됨</span>
            <Button variant="ghost" size="sm" onClick={exitSelecting}>
              <X size={15} /> 취소
            </Button>
            <Button
              size="sm"
              disabled={selectedIds.length === 0}
              onClick={() => setIsConfirmOpen(true)}
            >
              <Trash2 size={15} /> 삭제
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsSelecting(true)}
            className="cursor-pointer text-[11px] text-muted underline underline-offset-4 hover:text-ink"
          >
            선택 삭제
          </button>
        )}
      </div>

      {/* 모바일은 1열, 데스크톱은 2열 — 한 행이 좁아지면 이름·금액이 붙어 읽기 나빠진다. */}
      <div className="grid gap-2.5 lg:grid-cols-2">
        {records.map(record => {
          const isSelected = selectedIds.includes(record.id);
          // 고르는 중에는 행 전체가 선택 버튼이다 — 내용이 클릭을 가로채지 않게 비켜 준다.
          const contentClass = isSelecting ? 'pointer-events-none' : '';

          return (
            <div
              key={record.id}
              className={`relative flex w-full items-center gap-2.5 rounded-[17px] border px-[11px] py-[13px] transition sm:gap-3.5 sm:p-4 ${
                isSelected
                  ? 'border-coral bg-coral-soft/40'
                  : 'border-line bg-white hover:bg-[#fdfaf7]'
              }`}
            >
              {/* 행 전체를 덮는다. 위의 버튼들은 그보다 앞에 떠 있어 클릭이 겹치지 않는다. */}
              {isSelecting ? (
                <button
                  type="button"
                  onClick={() => toggleSelected(record.id)}
                  aria-pressed={isSelected}
                  aria-label={`${record.person}님의 ${record.gift} 기록 선택`}
                  className="absolute inset-0 cursor-pointer"
                />
              ) : (
                <Link
                  href={record.personId ? `/people/${record.personId}` : '/records'}
                  aria-label={`${record.person}님 상세 보기`}
                  className="absolute inset-0"
                />
              )}

              <div
                className={`relative ${contentClass} ${recordEmojiStyles({ accent: record.color, size: 'sm' })}`}
              >
                {record.emoji}
              </div>

              <div className={`relative min-w-0 flex-1 ${contentClass}`}>
                <span className="text-[9px] text-subtle">{formatDate(record.date)}</span>
                <h3 className="my-[3px] text-sm">
                  {record.person}
                  <small className="mt-0.5 block font-normal text-[#9a948c] sm:mt-0 sm:ml-2 sm:inline">
                    {record.relation}
                  </small>
                </h3>
                <p className="text-[11px] text-[#716b64]">{record.gift}</p>
                {/* 고르는 중에는 뱃지가 클릭을 가로채지 않게 둔다 — 행 전체가 선택 버튼이다. */}
                <div className={`-ml-1.5 ${isSelecting ? 'pointer-events-none' : ''}`}>
                  <ThankedBadge id={record.id} thanked={record.thanked} stopPropagation />
                </div>
              </div>

              <div className={`relative flex items-center gap-1.5 ${contentClass}`}>
                <div className="text-right">
                  <b className="block max-w-[88px] truncate text-[11px]">
                    {formatAmount(record.amount)}
                  </b>
                  {showCategory ? (
                    <span className="text-[9px] text-subtle">{getRecordCategoryLabel(record)}</span>
                  ) : (
                    <span className="text-[9px] text-subtle">{record.recordTypeLabel}</span>
                  )}
                </div>
                {isSelecting ? (
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-md border text-[11px] ${
                      isSelected ? 'border-coral bg-coral text-white' : 'border-[#d7d1c8] bg-white'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
                ) : (
                  <ChevronRight size={18} className="text-[#b1aba3]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isConfirmOpen ? (
        <ConfirmDialog
          title={`기록 ${selectedRecords.length}개를 삭제할까요?`}
          description={
            <>
              <b className="text-ink">
                {selectedRecords.map(record => `${record.person}님의 ${record.gift}`).join(', ')}
              </b>
              <br />
              연결된 답례 알림도 함께 사라져요.
            </>
          }
          isPending={isDeleteGiftRecordsPending}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}

export default RecordRows;
