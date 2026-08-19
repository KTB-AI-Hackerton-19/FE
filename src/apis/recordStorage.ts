import { STARTER_RECORDS } from '@/consts/record';
import type { RecordT } from '@/types/record';

/**
 * 백엔드 연동 전까지 쓰는 로컬 저장소.
 * Spring Boot API 가 준비되면 apis/ 의 함수들만 HTTP 호출로 바꾸면 된다.
 */
const STORAGE_KEY = 'giftie-records';

export const readRecords = (): RecordT[] => {
  if (typeof window === 'undefined') return STARTER_RECORDS;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return STARTER_RECORDS;
    return JSON.parse(saved) as RecordT[];
  } catch {
    return STARTER_RECORDS;
  }
};

export const writeRecords = (records: RecordT[]) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // 저장 실패 시에는 메모리 상태로만 유지한다.
  }
};

/** 실제 네트워크 호출처럼 보이도록 아주 짧은 지연을 준다. */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
