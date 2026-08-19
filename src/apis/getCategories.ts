import { API } from '@/consts/api';
import type { CategoryT, KindFilterT } from '@/types/category';

import { apiClient } from './apiClient';

export type GetCategoriesQueryT = {
  /** 생략하면 전체 */
  kind?: KindFilterT;
  /** 비활성 카테고리까지 포함할지 (기본 false) */
  includeInactive?: boolean;
};

export type GetCategoriesResponseT = CategoryT[];

export const getCategories = (query: GetCategoriesQueryT = {}) =>
  apiClient.get<GetCategoriesResponseT>(API.CATEGORIES, query);