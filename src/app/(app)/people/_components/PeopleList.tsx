'use client';

import { ChevronRight, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetPeople } from '@/hooks/useGetPeople';
import { useDeletePeople } from '@/hooks/usePeopleMutations';

import PersonFormModal from './PersonFormModal';

const AVATAR_TONES = [
  'bg-[#f5e3dd] text-[#b86152]',
  'bg-[#e4f0e9] text-[#587867]',
  'bg-[#e8edf6] text-[#617695]',
  'bg-[#f6edda] text-[#9b7940]',
];

function PeopleList() {
  const { peopleData, isGetPeoplePending } = useGetPeople();
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

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        {isSelecting ? (
          <>
            <span className="text-[11px] text-muted">{selectedIds.length}명 선택됨</span>
            <div className="flex gap-2">
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
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsSelecting(true)}
              disabled={peopleData.length === 0}
              className="cursor-pointer text-[11px] text-muted underline underline-offset-4 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              선택 삭제
            </button>
            <Button size="sm" onClick={() => setIsFormOpen(true)}>
              <Plus size={15} /> 사람 등록
            </Button>
          </>
        )}
      </div>

      {peopleData.length === 0 && !isGetPeoplePending ? (
        <div className="rounded-2xl border border-dashed border-[#d8d2ca] bg-white p-8 text-center text-[11px] text-muted">
          아직 등록된 사람이 없어요. 마음을 기록하면 자동으로 추가돼요.
        </div>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {peopleData.map((person, index) => {
            const isSelected = selectedIds.includes(person.id);
            const avatar = (
              <div
                className={`grid size-[47px] shrink-0 place-items-center rounded-2xl font-serif text-[19px] ${
                  AVATAR_TONES[index % AVATAR_TONES.length]
                }`}
              >
                {person.name[0]}
              </div>
            );
            const body = (
              <div className="min-w-0 flex-1">
                <h3 className="mb-[3px] text-sm">{person.name}</h3>
                <p className="text-[10px] text-[#908a82]">
                  {person.relation} · 마음 {person.giftCount}개
                </p>
                {person.latestGift ? (
                  <span className="mt-1.5 block truncate text-[10px] text-[#6f7e76]">
                    최근 {person.latestGift}
                  </span>
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
                  className={`flex cursor-pointer items-center gap-[13px] rounded-2xl border bg-white p-4 text-left transition ${
                    isSelected ? 'border-coral bg-coral-soft/40' : 'border-line'
                  }`}
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-md border text-[11px] ${
                      isSelected ? 'border-coral bg-coral text-white' : 'border-[#d7d1c8] bg-white'
                    }`}
                  >
                    {isSelected ? '✓' : ''}
                  </span>
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
