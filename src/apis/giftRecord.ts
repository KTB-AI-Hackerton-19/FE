import { API } from '@/consts/api';
import type { GiftRecordT } from '@/types/record';

import { apiClient } from './apiClient';

export type PostGiftRecordRequestT = {
  personId?: number;
  personName?: string;
  relation?: string;
  categoryId?: number;
  category?: string;
  occasion?: string;
  gift?: string;
  /** 숫자와 "35,000원" 형식 문자열 모두 허용된다 */
  price?: string;
  date: string;
  reminderDate?: string;
  thanked?: boolean;
};
export type PostGiftRecordResponseT = GiftRecordT;

export const postGiftRecord = (body: PostGiftRecordRequestT) =>
  apiClient.post<PostGiftRecordResponseT>(API.GIFT_RECORDS, body);

export type PatchGiftRecordRequestT = Partial<PostGiftRecordRequestT> & {
  /** true면 DRAFT를 CONFIRMED로 확정한다 (모달 저장 = 확정) */
  confirm?: boolean;
};
export type PatchGiftRecordResponseT = GiftRecordT;

export const patchGiftRecord = ({ id, ...body }: PatchGiftRecordRequestT & { id: number }) =>
  apiClient.patch<PatchGiftRecordResponseT>(API.GIFT_RECORD(id), body);

export type PostGiftRecordExtractRequestT = { imageKey: string };
export type PostGiftRecordExtractResponseT = GiftRecordT;

/** 업로드된 이미지를 AI가 분석해 DRAFT 기록을 만든다. */
export const postGiftRecordExtract = (body: PostGiftRecordExtractRequestT) =>
  apiClient.post<PostGiftRecordExtractResponseT>(API.GIFT_RECORD_EXTRACT, body);
