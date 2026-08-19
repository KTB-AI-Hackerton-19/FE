'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * 미디어 쿼리 일치 여부를 구독한다.
 * 클라이언트 전용 값이라 effect + setState 대신 useSyncExternalStore 를 쓴다.
 * 서버 스냅샷은 false — 데스크톱 기준으로 그린 뒤 클라이언트에서 정정된다.
 */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onStoreChange);

      return () => mediaQueryList.removeEventListener('change', onStoreChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
};