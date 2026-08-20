'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getGiftRecords } from '@/apis/getGiftRecords';
import { QUERY_KEY } from '@/consts/api';
import type { GiftRecordQueryT } from '@/types/record';

/** '더 보기' 한 번에 불러올 개수 (서버 상한은 100) */
const PAGE_SIZE = 20;

export const useGetInfiniteGiftRecords = (query: GiftRecordQueryT = {}) => {
  const {
    data,
    fetchNextPage: fetchNextGiftRecordsPage,
    hasNextPage: hasNextGiftRecordsPage,
    isFetchingNextPage: isFetchingNextGiftRecordsPage,
    isPending: isGetGiftRecordsPending,
  } = useInfiniteQuery({
    queryKey: [...QUERY_KEY.GIFT_RECORDS, 'infinite', query],
    queryFn: ({ pageParam }) => getGiftRecords({ ...query, page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.page + 1),
  });

  /**
   * 남은 페이지를 끝까지 불러오고 전체 id 를 돌려준다 — '전체선택'이 화면에 불러온 것만
   * 고르면 안 되기 때문이다. fetchNextPage 가 돌려주는 결과를 이어 받아야 최신 상태를 본다.
   */
  const loadAllGiftRecordIds = async () => {
    let result = { data, hasNextPage: hasNextGiftRecordsPage };

    while (result.hasNextPage) {
      result = await fetchNextGiftRecordsPage();
    }

    return result.data?.pages.flatMap(page => page.content).map(record => record.id) ?? [];
  };

  return {
    giftRecords: data?.pages.flatMap(page => page.content) ?? [],
    loadAllGiftRecordIds,
    giftRecordsTotal: data?.pages[0]?.totalElements ?? 0,
    fetchNextGiftRecordsPage,
    hasNextGiftRecordsPage,
    isFetchingNextGiftRecordsPage,
    isGetGiftRecordsPending,
  };
};
