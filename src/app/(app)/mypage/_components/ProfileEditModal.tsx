'use client';

import { Camera } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal';
import ProfileAvatar from '@/components/common/profile-avatar';
import { useAppUi } from '@/hooks/useAppUi';
import { usePatchMe } from '@/hooks/useUserMutations';
import type { UserT } from '@/types/user';

const NAME_MAX_LENGTH = 20;

type ProfileEditModalProps = {
  user: UserT;
  onClose: () => void;
};

type PickedImageT = {
  file: File;
  previewUrl: string;
};

function ProfileEditModal({ user, onClose }: ProfileEditModalProps) {
  const { showToast } = useAppUi();
  const { patchMeMutation, isPatchMePending } = usePatchMe();

  const [name, setName] = useState(user.name);
  const [picked, setPicked] = useState<PickedImageT | null>(null);
  /** 기존 사진을 지우기로 했는지 */
  const [isRemoved, setIsRemoved] = useState(false);

  const previewUrl = picked?.previewUrl ?? (isRemoved ? null : user.profileImageUrl);
  const hasImage = Boolean(previewUrl);
  const trimmedName = name.trim();

  const handlePickImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이전 미리보기 URL 은 여기서 정리한다 — effect 없이 교체 시점에 회수.
    if (picked) URL.revokeObjectURL(picked.previewUrl);

    setPicked({ file, previewUrl: URL.createObjectURL(file) });
    setIsRemoved(false);
  };

  const handleRemoveImage = () => {
    if (picked) URL.revokeObjectURL(picked.previewUrl);

    setPicked(null);
    setIsRemoved(true);
  };

  const handleClose = () => {
    if (picked) URL.revokeObjectURL(picked.previewUrl);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!trimmedName) return;

    patchMeMutation(
      {
        name: trimmedName === user.name ? undefined : trimmedName,
        profileImage: picked?.file,
        removeProfileImage: isRemoved && !picked ? true : undefined,
      },
      {
        onSuccess: () => {
          showToast('프로필을 수정했어요');
          handleClose();
        },
        onError: error =>
          showToast(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.'),
      }
    );
  };

  return (
    <Modal onClose={handleClose} size="sm" hideClose>
      <h2 className="mb-5 font-serif text-[21px]">프로필 수정</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2.5">
          <label className="relative cursor-pointer">
            <ProfileAvatar name={trimmedName || user.name} imageUrl={previewUrl} size="xl" />
            <span className="absolute right-0 bottom-0 grid size-7 place-items-center rounded-full border-2 border-white bg-coral text-white">
              <Camera size={14} />
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/heic"
              onChange={handlePickImage}
              className="sr-only"
            />
          </label>

          {hasImage ? (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="cursor-pointer text-[10px] text-subtle underline hover:text-ink"
            >
              기본 이미지로 되돌리기
            </button>
          ) : null}
        </div>

        <label className="flex flex-col gap-[5px]">
          <span className="text-[10px] font-bold text-[#817b74]">이름</span>
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            maxLength={NAME_MAX_LENGTH}
            placeholder="박주승"
            className="rounded-[10px] border border-line bg-white p-2.5 text-[12px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]"
          />
          <span className="text-right text-[9px] text-subtle">
            {name.length}/{NAME_MAX_LENGTH}
          </span>
        </label>

        <div className="flex gap-2">
          <Button variant="ghost" full onClick={handleClose} disabled={isPatchMePending}>
            취소
          </Button>
          <Button type="submit" full disabled={isPatchMePending || !trimmedName}>
            {isPatchMePending ? '수정 중…' : '수정하기'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ProfileEditModal;