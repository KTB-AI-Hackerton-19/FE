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
      <section className="relative rounded-[20px] border border-line bg-white p-[26px] text-center">
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          aria-label="프로필 수정"
          disabled={!meData}
          className="absolute top-3.5 right-3.5 cursor-pointer rounded-lg p-2 text-subtle transition hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil size={15} />
        </button>

        <div className="mx-auto w-fit">
          <ProfileAvatar name={meData?.name ?? null} imageUrl={meData?.profileImageUrl} size="lg" />
        </div>

        <h2 className="mt-3 mb-1 font-serif text-2xl">
          {isGetMePending ? '불러오는 중…' : (meData?.name ?? '사용자')}
        </h2>
        <p className="text-[11px] text-[#918b83]">@{meData?.username ?? '—'}</p>
      </section>

      {isEditOpen && meData ? (
        <ProfileEditModal user={meData} onClose={() => setIsEditOpen(false)} />
      ) : null}
    </>
  );
}

export default ProfileCard;