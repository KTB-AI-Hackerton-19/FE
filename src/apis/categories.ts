import { API } from '@/consts/api';
import type { AccentT, CategoryT, KindT } from '@/types/category';

import { apiClient } from './apiClient';

export type PostCategoryRequestT = {
  name: string;
  emoji?: string;
  color?: AccentT;
  displayOrder?: number;
  active?: boolean;
  /** 속할 탭. 생략하면 GIFT */
  kind?: KindT;
  /** 행사일 (YYYY-MM-DD). 경조사에만 쓰이고 선물 카테고리로 보내면 무시된다 */
  eventDate?: string;
};

export const postCategory = (body: PostCategoryRequestT) =>
  apiClient.post<CategoryT>(API.CATEGORIES, body);

/** 부분 수정이 아니다 — 서버가 name 을 필수로 요구하므로 항상 함께 보낸다. */
export type PatchCategoryRequestT = PostCategoryRequestT & { id: number };

export const patchCategory = ({ id, ...body }: PatchCategoryRequestT) =>
  apiClient.patch<CategoryT>(API.CATEGORY(id), body);
