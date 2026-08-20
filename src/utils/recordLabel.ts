import type { GiftRecordT } from '@/types/record';

/**
 * 기록에 붙이는 분류 이름.
 * 선물은 사용자가 만든 카테고리, 경조사는 서버가 정한 행사 유형을 쓴다.
 */
export const getRecordCategoryLabel = (record: GiftRecordT) =>
  record.event
    ? (record.eventCategoryLabel ?? record.recordTypeLabel)
    : (record.category ?? '기타');

/** 날짜 아래 한 줄로 붙는 설명 — 비어 있는 값은 빼고 이어 붙인다. */
export const getRecordSubtitle = (record: GiftRecordT) =>
  [record.occasion, getRecordCategoryLabel(record)].filter(Boolean).join(' · ');
