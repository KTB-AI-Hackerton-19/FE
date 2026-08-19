import { API } from '@/consts/api';
import type { SearchT } from '@/types/search';

import { apiClient } from './apiClient';

export type GetSearchResponseT = SearchT;

/** 사람 이름 · 선물명 · 받은 이유를 부분 일치로 통합 검색한다. */
export const getSearch = ({ q, limit = 5 }: { q: string; limit?: number }) =>
  apiClient.get<GetSearchResponseT>(API.SEARCH, { q, limit });
