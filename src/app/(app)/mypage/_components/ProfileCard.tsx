'use client';

import { Pencil } from 'lucide-react';
import { useState } from 'react';

import ProfileAvatar from '@/components/common/profile-avatar';
import { useGetMe } from '@/hooks/useGetMe';

import ProfileEditModal from './ProfileEditModal';

function ProfileCard() {
  const { meData, isGetMePending } = useGetMe();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <section className="flex items-center gap-3.5 rounded-[17px] border border-line bg-white p-4 sm:p-[18px]">
        <ProfileAvatar name={meData?.name ?? null} imageUrl={meData?.profileImageUrl} size="lg" />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-bold">
            {isGetMePending ? '불러오는 중…' : (meData?.name ?? '사용자')}
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-[#918b83]">{meData?.username ?? '—'}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          aria-label="프로필 수정"
          disabled={!meData}
          className="cursor-pointer rounded-lg p-2 text-subtle transition hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil size={16} />
        </button>
      </section>

      {isEditOpen && meData ? (
        <ProfileEditModal user={meData} onClose={() => setIsEditOpen(false)} />
      ) : null}
    </>
  );
}

export default ProfileCard;