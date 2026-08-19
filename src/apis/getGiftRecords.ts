import { API } from '@/consts/api';
import type { PageResponseT } from '@/types/api';
import type { GiftRecordQueryT, GiftRecordT } from '@/types/record';

import { apiClient } from './apiClient';

export type GetGiftRecordsResponseT = PageResponseT<GiftRecordT>;

export const getGiftRecords = (query: GiftRecordQueryT = {}) =>
  apiClient.get<GetGiftRecordsResponseT>(API.GIFT_RECORDS, query);
