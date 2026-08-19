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

  return {
    giftRecords: data?.pages.flatMap(page => page.content) ?? [],
    giftRecordsTotal: data?.pages[0]?.totalElements ?? 0,
    fetchNextGiftRecordsPage,
    hasNextGiftRecordsPage,
    isFetchingNextGiftRecordsPage,
    isGetGiftRecordsPending,
  };
};