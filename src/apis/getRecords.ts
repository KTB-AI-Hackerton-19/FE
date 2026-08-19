import type { RecordT } from '@/types/record';

import { delay, readRecords } from './recordStorage';

export type GetRecordsResponseT = RecordT[];

export const getRecords = async (): Promise<GetRecordsResponseT> => {
  await delay(120);
  return readRecords();
};
