'use client';

import { Bell, ChevronLeft, Gift, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import ConfirmDialog from '@/components/common/confirm-dialog';
import PersonFormModal from '@/components/common/person-form-modal';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetPerson } from '@/hooks/useGetPeople';
import { useDeletePeople } from '@/hooks/usePeopleMutations';
import { formatDate, formatShortDate } from '@/utils/formatDate';
import { getRecordSubtitle } from '@/utils/recordLabel';

import PersonRecommendSection from './PersonRecommendSection';

type PersonTimelineProps = {
  id: number;
};

function PersonTimeline({ id }: PersonTimelineProps) {
  const { personData, isGetPersonPending, getPersonError } = useGetPerson(id);
  const { deletePeopleMutation, isDeletePeoplePending } = useDeletePeople();
  const { showToast } = useAppUi();
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () =>
    deletePeopleMutation([id], {
      onSuccess: () => {
        showToast(`${personData?.person.name}님을 삭제했어요`);
        router.replace('/people');
      },
      onError: error => {
        showToast(error instanceof ApiError ? error.message : '삭제하지 못했어요');
        setIsConfirmOpen(false);
      },
    });

  return (
    <>
      <div className="mb-[18px] flex items-center justify-between">
        <Link
          href="/people"
          className="flex items-center text-[11px] text-[#777169] hover:text-ink"
        >
          <ChevronLeft size={18} /> 사람 목록
        </Link>

        {personData ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              aria-label="정보 수정"
              className="cursor-pointer rounded-lg p-2 text-subtle transition hover:bg-white hover:text-ink"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmOpen(true)}
              aria-label="사람 삭제"
              className="cursor-pointer rounded-lg p-2 text-subtle transition hover:bg-coral-soft hover:text-coral-dark"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ) : null}
      </div>

      {getPersonError ? (
        <div className="rounded-[14px] border border-dashed border-[#d8d2ca] bg-white p-[26px] text-center text-[11px] text-muted">
          이 사람을 찾을 수 없어요.
        </div>
      ) : null}

      {personData ? (
        <>
          <div className="rounded-[20px] border border-line bg-white p-[26px] text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#f3e1db] font-title font-bold text-[26px] text-[#b65f51]">
              {personData.person.name[0]}
            </div>
            <h1 className="mt-2.5 mb-[3px] font-title font-bold text-2xl">
              {personData.person.name}
            </h1>
            <div className="flex items-center justify-center gap-1.5">
              {personData.person.relation ? (
                <span className="rounded-md bg-[#f6f4f0] px-1.5 py-0.5 text-[10px] text-[#8f8a82]">
                  {personData.person.relation}
                </span>
              ) : null}
              {/* 목록 카드와 같은 표시 — 선물 아이콘에 개수만 붙인다 */}
              <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#c98878]">
                <Gift size={13} strokeWidth={2.4} />
                받은 마음 {personData.person.giftCount}개
              </span>
            </div>
          </div>

          <div className="my-3 mb-7 grid grid-cols-2 rounded-2xl bg-coral-soft px-1.5 py-3.5 text-coral-deep sm:p-[17px]">
            <div className="flex flex-col items-center gap-[5px]">
              <span className="text-[10px] text-[#c59283]">최근 받은 날</span>
              <b className="text-[15px]">{formatDate(personData.person.latestReceivedDate)}</b>
            </div>
            <div className="flex flex-col items-center gap-[5px] border-l border-[#eec9bd]">
              <span className="text-[10px] text-[#c59283]">다가오는 알림</span>
              <b className="text-[15px]">{formatDate(personData.person.upcomingReminderDate)}</b>
            </div>
          </div>

          {/* 개수는 위 프로필에 이미 있어 되풀이하지 않는다 */}
          <h2 className="font-title font-bold text-[19px]">받은 마음</h2>

          <div className="mt-3">
            {personData.records.map((record, index) => (
              <article key={record.id} className="relative grid grid-cols-[40px_1fr] gap-3">
                <div className="z-1 grid size-[38px] place-items-center rounded-full border border-line bg-white">
                  {record.emoji}
                </div>
                {index < personData.records.length - 1 && (
                  <div className="absolute top-[38px] -bottom-3 left-[19px] w-px bg-[#ded8cf]" />
                )}
                <div className="mb-3 rounded-[14px] border border-line bg-white p-3.5">
                  <time className="text-[9px] text-subtle" dateTime={record.date}>
                    {formatDate(record.date)}
                  </time>
                  <h3 className="my-[3px] text-[13px] font-bold">{record.gift}</h3>
                  <p className="text-[10px] text-[#8c867f]">{getRecordSubtitle(record)}</p>
                  <div className="mt-2.5 flex justify-between border-t border-line pt-[9px] text-[10px]">
                    <b>{record.price}</b>
                    <span className="flex items-center gap-1 text-[#c27566]">
                      <Bell size={13} /> {formatShortDate(record.reminderDate)} 알림
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <PersonRecommendSection id={id} name={personData.person.name} />
        </>
      ) : null}

      {isGetPersonPending ? <p className="text-[11px] text-muted">불러오는 중이에요…</p> : null}

      {isEditOpen && personData ? (
        <PersonFormModal person={personData.person} onClose={() => setIsEditOpen(false)} />
      ) : null}

      {isConfirmOpen && personData ? (
        <ConfirmDialog
          title={`${personData.person.name}님을 삭제할까요?`}
          description={
            personData.person.giftCount > 0 ? (
              <>
                {personData.person.name}님과 주고받은 마음 기록{' '}
                <b className="text-ink">{personData.person.giftCount}개</b>도 함께 사라져요.
                <br />
                되돌릴 수 없어요.
              </>
            ) : (
              '되돌릴 수 없어요.'
            )
          }
          isPending={isDeletePeoplePending}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}

export default PersonTimeline;
