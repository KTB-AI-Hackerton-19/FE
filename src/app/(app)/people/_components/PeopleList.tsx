'use client';

import { ChevronRight, Gift, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import CheckBox from '@/components/common/check-box';
import ConfirmDialog from '@/components/common/confirm-dialog';
import EmptyState from '@/components/common/empty-state';
import InfiniteScrollSentinel from '@/components/common/infinite-scroll-sentinel';
import PersonFormModal from '@/components/common/person-form-modal';
import SelectionToolbar from '@/components/common/selection-toolbar';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetPeople } from '@/hooks/useGetPeople';
import { useDeletePeople } from '@/hooks/usePeopleMutations';

const AVATAR_TONES = [
  'bg-[#f5e3dd] text-[#b86152]',
  'bg-[#e4f0e9] text-[#587867]',
  'bg-[#e8edf6] text-[#617695]',
  'bg-[#f6edda] text-[#9b7940]',
];

function PeopleList() {
  const {
    peopleData,
    peopleTotal,
    loadAllPeopleIds,
    fetchNextPeoplePage,
    hasNextPeoplePage,
    isFetchingNextPeoplePage,
    isGetPeoplePending,
  } = useGetPeople();
  const { deletePeopleMutation, isDeletePeoplePending } = useDeletePeople();
  const { showToast } = useAppUi();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const selectedPeople = peopleData.filter(person => selectedIds.includes(person.id));
  const selectedRecordCount = selectedPeople.reduce((sum, person) => sum + person.giftCount, 0);

  const exitSelecting = () => {
    setIsSelecting(false);
    setSelectedIds([]);
  };

  const toggleSelected = (id: number) =>
    setSelectedIds(current =>
      current.includes(id) ? current.filter(value => value !== id) : [...current, id]
    );

  // 무한 스크롤이라 화면에 불러온 건 일부다 — 전체선택은 남은 페이지까지 불러와서 고른다.
  const toggleAll = async () => {
    if (selectedIds.length === peopleTotal) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(await loadAllPeopleIds());
  };

  const handleDelete = () =>
    deletePeopleMutation(selectedIds, {
      onSuccess: () => {
        showToast(`${selectedPeople.length}명을 삭제했어요`);
        setIsConfirmOpen(false);
        exitSelecting();
      },
      onError: error => {
        showToast(error instanceof ApiError ? error.message : '삭제하지 못했어요');
        setIsConfirmOpen(false);
      },
    });

  const isEmpty = peopleData.length === 0 && !isGetPeoplePending;

  return (
    <>
      {/* 아무도 없으면 선택 삭제·등록 버튼을 감춘다 — 빈 화면의 안내 버튼 하나로 충분하다. */}
      {isEmpty ? null : (
        <SelectionToolbar
          isSelecting={isSelecting}
          selectedCount={selectedIds.length}
          totalCount={peopleTotal}
          onStart={() => setIsSelecting(true)}
          onToggleAll={toggleAll}
          onDelete={() => setIsConfirmOpen(true)}
          onCancel={exitSelecting}
          className="mb-3"
          leading={
            // 사이드바의 '사람들' 아이콘과 같은 것을 써서 어느 목록의 건수인지 바로 보이게 한다.
            <b className="flex min-w-0 items-center gap-1.5 truncate text-[11px]">
              <User size={15} className="shrink-0" />
              {peopleTotal}명
            </b>
          }
          trailing={
            <Button size="xs" onClick={() => setIsFormOpen(true)}>
              <Plus size={13} /> 사람 등록
            </Button>
          }
        />
      )}

      {isEmpty ? (
        <EmptyState
          title="아직 등록된 사람이 없어요"
          description="마음을 주고받은 소중한 사람은 누구인가요?"
          actionLabel="사람 등록하기"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {peopleData.map((person, index) => {
            const isSelected = selectedIds.includes(person.id);
            const avatar = (
              <div
                className={`grid size-[47px] shrink-0 place-items-center rounded-2xl font-title font-bold text-[19px] ${
                  AVATAR_TONES[index % AVATAR_TONES.length]
                }`}
              >
                {person.name[0]}
              </div>
            );
            const body = (
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="min-w-0 truncate text-sm font-bold">{person.name}</h3>
                  {person.relation ? (
                    <span className="shrink-0 rounded-md bg-[#f6f4f0] px-1.5 py-0.5 text-[9px] text-[#8f8a82]">
                      {person.relation}
                    </span>
                  ) : null}
                  {/* '마음 4개'보다 아이콘에 숫자만 붙이는 편이 한눈에 읽힌다 */}
                  <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-[#c98878]">
                    <Gift size={12} strokeWidth={2.4} />
                    {person.giftCount}
                  </span>
                </div>
                {person.latestGift ? (
                  <p className="mt-[5px] truncate text-[10px] text-[#908a82]">
                    최근 받은 마음 <span className="text-[#d9d3cb]">|</span> {person.latestGift}
                  </p>
                ) : null}
              </div>
            );

            if (isSelecting) {
              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => toggleSelected(person.id)}
                  aria-pressed={isSelected}
                  className={`flex cursor-pointer items-center gap-[13px] rounded-2xl border p-4 text-left transition ${
                    isSelected ? 'border-coral bg-coral-soft/40' : 'border-line bg-white'
                  }`}
                >
                  <CheckBox checked={isSelected} />
                  {avatar}
                  {body}
                </button>
              );
            }

            return (
              <Link
                key={person.id}
                href={`/people/${person.id}`}
                className="flex items-center gap-[13px] rounded-2xl border border-line bg-white p-4 text-left transition hover:bg-[#fdfaf7]"
              >
                {avatar}
                {body}
                <ChevronRight className="shrink-0 text-[#b1aba3]" />
              </Link>
            );
          })}
        </div>
      )}

      <InfiniteScrollSentinel
        hasMore={hasNextPeoplePage}
        isFetching={isFetchingNextPeoplePage}
        onReach={fetchNextPeoplePage}
      />

      {isFormOpen ? <PersonFormModal onClose={() => setIsFormOpen(false)} /> : null}

      {isConfirmOpen ? (
        <ConfirmDialog
          title={`${selectedPeople.length}명을 삭제할까요?`}
          description={
            <>
              <b className="text-ink">{selectedPeople.map(person => person.name).join(', ')}</b>
              <br />
              {selectedRecordCount > 0
                ? `이분들과 주고받은 마음 기록 ${selectedRecordCount}개도 함께 사라져요.`
                : '되돌릴 수 없어요.'}
            </>
          }
          isPending={isDeletePeoplePending}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}

export default PeopleList;
