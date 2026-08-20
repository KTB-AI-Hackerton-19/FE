import { API } from '@/consts/api';
import type { AccentT, CategoryT } from '@/types/category';

import { apiClient } from './apiClient';

export type PostCategoryRequestT = {
  name: string;
  emoji?: string;
  color?: AccentT;
  displayOrder?: number;
  active?: boolean;
};

export const postCategory = (body: PostCategoryRequestT) =>
  apiClient.post<CategoryT>(API.CATEGORIES, body);

/** 부분 수정이 아니다 — 서버가 name 을 필수로 요구하므로 항상 함께 보낸다. */
export type PatchCategoryRequestT = PostCategoryRequestT & { id: number };

export const patchCategory = ({ id, ...body }: PatchCategoryRequestT) =>
  apiClient.patch<CategoryT>(API.CATEGORY(id), body);
