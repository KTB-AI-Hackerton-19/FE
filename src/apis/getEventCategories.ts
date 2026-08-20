import { API } from '@/consts/api';
import type { EventCategoryT } from '@/types/eventCategory';

import { apiClient } from './apiClient';

export type GetEventCategoriesResponseT = EventCategoryT[];

/** 경조사 유형은 서버가 정한 고정 7종이다 — 하드코딩하지 않는다. */
export const getEventCategories = () =>
  apiClient.get<GetEventCategoriesResponseT>(API.EVENT_CATEGORIES);
