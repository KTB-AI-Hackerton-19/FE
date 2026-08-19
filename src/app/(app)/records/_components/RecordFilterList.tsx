'use client';

import { ChevronRight, Plus, Settings2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { recordEmojiStyles } from '@/components/common/record-card/recordCard.style';
import ThankedBadge from '@/components/common/thanked-badge';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetCategories } from '@/hooks/useGetCategories';
import { useGetGiftRecords } from '@/hooks/useGetGiftRecords';
import { useDeleteGiftRecord } from '@/hooks/useGiftRecordMutations';
import type { GiftRecordT } from '@/types/record';
import { formatDate } from '@/utils/formatDate';

import CategoryManagerModal from './CategoryManagerModal';

const ALL = '전체';

function RecordFilterList() {
  const [category, setCategory] = useState(ALL);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<GiftRecordT | null>(null);

  const { categoriesData } = useGetCategories();
  const { openRecordModal, showToast } = useAppUi();
  const { deleteGiftRecordMutation, isDeleteGiftRecordPending } = useDeleteGiftRecord();

  // 필터링은 서버에서 처리한다 — 전체를 받아 클라이언트에서 거르지 않는다.
  const { giftRecordsData, isGetGiftRecordsPending } = useGetGiftRecords({
    category,
    sort: 'latest',
    size: 100,
  });

  const records = giftRecordsData?.content ?? [];
  const chips = [
    ALL,
    ...categoriesData.filter(item => item.recordCount > 0).map(item => item.name),
  ];

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

  return (
    <>
      <div className="flex items-center gap-2 overflow-auto pb-[5px]">
        {chips.map(name => (
          <button
            key={name}
            type="button"
            onClick={() => setCategory(name)}
            className={`cursor-pointer rounded-[20px] border px-3.5 py-2 text-[10px] whitespace-nowrap transition ${
              category === name
                ? 'border-forest bg-forest text-white'
                : 'border-line bg-white text-[#7c7770]'
            }`}
          >
            {name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsCategoryManagerOpen(true)}
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-[20px] border border-dashed border-[#d7c7bc] bg-white px-3 py-2 text-[10px] whitespace-nowrap text-[#a5988f] hover:text-ink"
        >
          <Settings2 size={13} /> 카테고리
        </button>
      </div>

      <div className="my-[25px] mb-[11px] flex justify-between text-[11px]">
        <b>{giftRecordsData?.totalElements ?? 0}개의 마음</b>
        <span className="text-[#99938c]">최신순</span>
      </div>

      {records.length === 0 && !isGetGiftRecordsPending ? (
        <div className="rounded-[17px] border border-dashed border-[#d8d2ca] bg-white p-8 text-center text-[11px] text-muted">
          아직 기록한 마음이 없어요.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[17px] border border-line bg-white">
          {records.map(record => (
            <div
              key={record.id}
              className="relative flex w-full items-center gap-2.5 border-b border-line px-[11px] py-[13px] transition last:border-b-0 hover:bg-[#fdfaf7] sm:gap-3.5 sm:p-4"
            >
              {/* 행 전체를 덮는 링크. 위의 버튼들은 그보다 앞에 떠 있어 클릭이 겹치지 않는다. */}
              <Link
                href={record.personId ? `/people/${record.personId}` : '/records'}
                aria-label={`${record.person}님 상세 보기`}
                className="absolute inset-0"
              />

              <div
                className={`relative ${recordEmojiStyles({ accent: record.color, size: 'sm' })}`}
              >
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
                  <b className="block max-w-[88px] truncate text-[11px]">{record.price}</b>
                  <span className="text-[9px] text-subtle">{record.category}</span>
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
      )}

      <button
        type="button"
        onClick={openRecordModal}
        className="mt-[13px] flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-[14px] border border-dashed border-[#d7c7bc] bg-[#fff7f2] p-3.5 text-[11px] font-bold text-[#cf6e5d] lg:hidden"
      >
        <Plus size={17} /> 마음 기록하기
      </button>

      {isCategoryManagerOpen ? (
        <CategoryManagerModal onClose={() => setIsCategoryManagerOpen(false)} />
      ) : null}

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

export default RecordFilterList;
