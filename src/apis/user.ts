import { API } from '@/consts/api';
import type { UserT } from '@/types/user';

import { apiClient } from './apiClient';

export type GetMeResponseT = UserT;

export const getMe = () => apiClient.get<GetMeResponseT>(API.USERS_ME);

/** 보내지 않은 필드는 그대로 유지된다. */
export type PatchMeRequestT = {
  name?: string;
  /** presigned URL 로 업로드한 뒤 받은 imageKey */
  profileImageKey?: string;
  /** true 면 프로필 이미지를 지우고 기본 아바타로 되돌린다 */
  removeProfileImage?: boolean;
};

export const patchMe = (body: PatchMeRequestT) => apiClient.patch<UserT>(API.USERS_ME, body);

/** 회원 탈퇴 — 기록·사람·카테고리가 모두 함께 사라진다. */
export const deleteMe = () => apiClient.delete<void>(API.USERS_ME);