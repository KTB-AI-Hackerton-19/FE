'use client';

import { ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import ConfirmDialog from '@/components/common/confirm-dialog';
import EmptyState from '@/components/common/empty-state';
import { recordEmojiStyles } from '@/components/common/record-card/recordCard.style';
import ThankedBadge from '@/components/common/thanked-badge';
import { useAppUi } from '@/hooks/useAppUi';
import { useDeleteGiftRecord } from '@/hooks/useGiftRecordMutations';
import type { GiftRecordT } from '@/types/record';
import { formatAmount } from '@/utils/formatAmount';
import { formatDate } from '@/utils/formatDate';

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

/** 선물·경조사 탭이 함께 쓰는 기록 목록. 삭제 확인까지 여기서 처리한다. */
function RecordRows({
  records,
  isPending,
  emptyTitle,
  emptyDescription,
  canRecord = false,
  showCategory = true,
}: RecordRowsProps) {
  const { showToast, openRecordModal } = useAppUi();
  const { deleteGiftRecordMutation, isDeleteGiftRecordPending } = useDeleteGiftRecord();
  const [pendingDelete, setPendingDelete] = useState<GiftRecordT | null>(null);

  const handleDelete = () => {
    if (!pendingDelete) return;

    deleteGiftRecordMutation(pendingDelete.id, {
      onSuccess: () => {
        showToast('기록을 삭제했어요');
        setPendingDelete(null);
      },
      onError: error => {
        showToast(error instanceof ApiError ? error.message : '삭제하지 못했어요');
        setPendingDelete(null);
      },
    });
  };

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
        {records.map(record => (
          <div
            key={record.id}
            className="relative flex w-full items-center gap-2.5 rounded-[17px] border border-line bg-white px-[11px] py-[13px] transition hover:bg-[#fdfaf7] sm:gap-3.5 sm:p-4"
          >
            {/* 행 전체를 덮는 링크. 위의 버튼들은 그보다 앞에 떠 있어 클릭이 겹치지 않는다. */}
            <Link
              href={record.personId ? `/people/${record.personId}` : '/records'}
              aria-label={`${record.person}님 상세 보기`}
              className="absolute inset-0"
            />

            <div className={`relative ${recordEmojiStyles({ accent: record.color, size: 'sm' })}`}>
              {record.emoji}
            </div>

            <div className="relative min-w-0 flex-1">
              <span className="text-[9px] text-subtle">{formatDate(record.date)}</span>
              <h3 className="my-[3px] text-sm">
                {record.person}
                <small className="mt-0.5 block font-normal text-[#9a948c] sm:mt-0 sm:ml-2 sm:inline">
                  {record.relation}
                </small>
              </h3>
              <p className="text-[11px] text-[#716b64]">{record.gift}</p>
              <div className="-ml-1.5">
                <ThankedBadge id={record.id} thanked={record.thanked} stopPropagation />
              </div>
            </div>

            <div className="relative flex items-center gap-1.5">
              <div className="text-right">
                <b className="block max-w-[88px] truncate text-[11px]">
                  {formatAmount(record.amount)}
                </b>
                {showCategory ? (
                  <span className="text-[9px] text-subtle">{record.category}</span>
                ) : (
                  <span className="text-[9px] text-subtle">{record.kindLabel}</span>
                )}
              </div>
              <button
                type="button"
                onClick={event => {
                  event.preventDefault();
                  setPendingDelete(record);
                }}
                aria-label={`${record.gift} 기록 삭제`}
                className="cursor-pointer rounded-lg p-1.5 text-[#c3bcb4] transition hover:bg-coral-soft hover:text-coral-dark"
              >
                <Trash2 size={15} />
              </button>
              <ChevronRight size={18} className="text-[#b1aba3]" />
            </div>
          </div>
        ))}
      </div>

      {pendingDelete ? (
        <ConfirmDialog
          title="이 기록을 삭제할까요?"
          description={
            <>
              <b className="text-ink">
                {pendingDelete.person}님의 {pendingDelete.gift}
              </b>
              <br />
              연결된 답례 알림도 함께 사라져요.
            </>
          }
          isPending={isDeleteGiftRecordPending}
          onConfirm={handleDelete}
          onCancel={() => setPendingDelete(null)}
        />
      ) : null}
    </>
  );
}

export default RecordRows;
