'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { uploadProfileImage } from '@/apis/uploadImage';
import { deleteMe, patchMe } from '@/apis/user';
import type { PatchMeRequestT } from '@/apis/user';
import { QUERY_KEY } from '@/consts/api';
import { notifyAuthChanged, setDisplayName } from '@/utils/tokenStorage';

/** 이미지 파일이 있으면 S3 업로드까지 묶어서 처리한다. */
type PatchMeVariablesT = Omit<PatchMeRequestT, 'profileImageKey'> & {
  profileImage?: File;
};

export const usePatchMe = () => {
  const queryClient = useQueryClient();

  const { mutate: patchMeMutation, isPending: isPatchMePending } = useMutation({
    mutationFn: async ({ profileImage, ...body }: PatchMeVariablesT) => {
      const profileImageKey = profileImage ? await uploadProfileImage(profileImage) : undefined;

      return patchMe({ ...body, profileImageKey });
    },
    onSuccess: user => {
      // 사이드바·헤더가 보는 표시 이름은 localStorage 라 함께 갱신한다.
      setDisplayName(user.name);
      notifyAuthChanged();
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.ME });
    },
  });

  return { patchMeMutation, isPatchMePending };
};

export const useDeleteMe = () => {
  const { mutate: deleteMeMutation, isPending: isDeleteMePending } = useMutation({
    mutationFn: deleteMe,
  });

  return { deleteMeMutation, isDeleteMePending };
};