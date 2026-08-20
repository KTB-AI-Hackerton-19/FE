'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { ApiError } from '@/apis/apiClient';
import CheckBox from '@/components/common/check-box';
import ConfirmDialog from '@/components/common/confirm-dialog';
import EmptyState from '@/components/common/empty-state';
import { recordEmojiStyles } from '@/components/common/record-card/recordCard.style';
import ThankedBadge from '@/components/common/thanked-badge';
import { useAppUi } from '@/hooks/useAppUi';
import { useDeleteGiftRecords } from '@/hooks/useGiftRecordMutations';
import type { GiftRecordT } from '@/types/record';
import { formatAmount } from '@/utils/formatAmount';
import { formatDate } from '@/utils/formatDate';

import type { RecordSelectionT } from '../_hooks/useRecordSelection';

type RecordRowsProps = {
  records: GiftRecordT[];
  isPending: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  /** 비었을 때 기록 모달을 여는 버튼을 띄울지 (검색 결과가 없는 경우엔 감춘다) */
  canRecord?: boolean;
  /** 삭제 줄이 건수·정렬과 같은 줄에 있어 상태는 부모가 들고 있는다 */
  selection: RecordSelectionT;
};

/** 선물·경조사 탭이 함께 쓰는 기록 목록. 선택 삭제까지 여기서 처리한다. */
function RecordRows({
  records,
  isPending,
  emptyTitle,
  emptyDescription,
  canRecord = false,
  selection,
}: RecordRowsProps) {
  const { showToast, openRecordModal } = useAppUi();
  const { deleteGiftRecordsMutation, isDeleteGiftRecordsPending } = useDeleteGiftRecords();

  const { isSelecting, selectedIds, isConfirmOpen, toggle, cancel, closeConfirm } = selection;
  const selectedRecords = records.filter(record => selectedIds.includes(record.id));

  const handleDelete = () =>
    deleteGiftRecordsMutation(selectedIds, {
      onSuccess: ({ deletedRecords }) => {
        // 서버가 실제로 지운 수를 돌려주므로 그대로 안내한다.
        showToast(`기록 ${deletedRecords}개를 삭제했어요`);
        closeConfirm();
        cancel();
      },
      onError: error => {
        showToast(error instanceof ApiError ? error.message : '삭제하지 못했어요');
        closeConfirm();
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
                  onClick={() => toggle(record.id)}
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

              {isSelecting ? (
                <span className={`relative ${contentClass}`}>
                  <CheckBox checked={isSelected} />
                </span>
              ) : null}

              <div
                className={`relative ${contentClass} ${recordEmojiStyles({ accent: record.color, size: 'sm' })}`}
              >
                {record.emoji}
              </div>

              {/*
                받은 이유는 목록에서 빼 둔다 — 첫 줄에 작은 정보를 모으고
                오른쪽은 금액만 남겨야 눈이 한 번에 읽는다.
              */}
              <div className={`relative min-w-0 flex-1 ${contentClass}`}>
                <div className="flex min-w-0 items-center gap-1.5 text-[9px] text-subtle">
                  <time dateTime={record.date} className="shrink-0">
                    {formatDate(record.date)}
                  </time>
                  {/* 고르는 중에는 뱃지가 클릭을 가로채지 않게 둔다 — 행 전체가 선택 버튼이다. */}
                  <div className={`-my-1 ${isSelecting ? 'pointer-events-none' : ''}`}>
                    <ThankedBadge id={record.id} thanked={record.thanked} stopPropagation />
                  </div>
                </div>
                <div className="my-[3px] flex min-w-0 items-center gap-1.5">
                  <h3 className="min-w-0 truncate text-sm">{record.person}</h3>
                  {record.relation ? (
                    <span className="shrink-0 rounded-md bg-[#f6f4f0] px-1.5 py-0.5 text-[9px] text-[#8f8a82]">
                      {record.relation}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className={`relative flex items-center gap-2 ${contentClass}`}>
                {/* 선물 이름은 금액에 딸린 설명이라 옆에 작게 붙인다 */}
                <span className="hidden max-w-[110px] truncate text-[10px] text-[#a29c94] sm:block">
                  {record.gift}
                </span>
                <b className="max-w-[110px] truncate text-right text-[13px]">
                  {formatAmount(record.amount)}
                </b>
                {isSelecting ? null : <ChevronRight size={18} className="text-[#b1aba3]" />}
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
          onCancel={closeConfirm}
        />
      ) : null}
    </>
  );
}

export default RecordRows;
