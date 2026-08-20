import { API } from '@/consts/api';
import type { GiftRecordT, RecordTypeT } from '@/types/record';

import { apiClient } from './apiClient';

export type PostGiftRecordRequestT = {
  personId?: number;
  personName?: string;
  /** GET /api/relationships 의 값만 받는다 */
  relation?: string;
  /** 생략하면 GIFT */
  recordType?: RecordTypeT;
  /** GIFT 에서만 쓰인다 */
  categoryId?: number;
  /** GIFT 에서만 쓰인다. 없는 이름을 보내면 '기타'로 저장된다 */
  category?: string;
  /** EVENT 에서는 필수 — 고정 7종의 코드(WEDDING) 또는 한글 라벨(결혼) */
  eventCategory?: string;
  /** EVENT 에서만 쓰인다 — 행사가 실제로 열린 날 */
  eventDate?: string;
  /** GIFT 에서만 쓰인다 */
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

export type PatchGiftRecordThankedRequestT = { id: number; thanked: boolean };

/** '감사 완료' / '확인 필요' 뱃지 토글 */
export const patchGiftRecordThanked = ({ id, thanked }: PatchGiftRecordThankedRequestT) =>
  apiClient.patch<GiftRecordT>(API.GIFT_RECORD_THANKED(id), { thanked });

export type PostGiftRecordExtractRequestT = { imageKey: string };
export type PostGiftRecordExtractResponseT = GiftRecordT;

/** 업로드된 이미지를 AI가 분석해 DRAFT 기록을 만든다. */
export const postGiftRecordExtract = (body: PostGiftRecordExtractRequestT) =>
  apiClient.post<PostGiftRecordExtractResponseT>(API.GIFT_RECORD_EXTRACT, body);

/** 기록과 연결된 답례 알림을 함께 삭제한다. */
export const deleteGiftRecord = (id: number) => apiClient.delete<void>(API.GIFT_RECORD(id));
