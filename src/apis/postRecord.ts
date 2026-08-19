import type { RecordDraftT, RecordT } from '@/types/record';
import { getCategoryAccent, getCategoryEmoji } from '@/utils/getCategoryEmoji';

import { delay, readRecords, writeRecords } from './recordStorage';

export type PostRecordRequestT = RecordDraftT;
export type PostRecordResponseT = RecordT;

export const postRecord = async (body: PostRecordRequestT): Promise<PostRecordResponseT> => {
  await delay(200);

  const created: RecordT = {
    ...body,
    id: Date.now(),
    accent: getCategoryAccent(body.category),
    thanked: false,
  };

  writeRecords([created, ...readRecords()]);
  return created;
};

/** 확인 화면에 쓸 이모지 (카테고리 기준) */
export const getRecordEmoji = getCategoryEmoji;
