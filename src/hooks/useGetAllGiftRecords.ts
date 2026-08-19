'use client';

import { useQuery } from '@tanstack/react-query';

import { getGiftRecords } from '@/apis/getGiftRecords';
import { QUERY_KEY } from '@/consts/api';
import type { GiftRecordQueryT } from '@/types/record';

/** 서버가 한 페이지에 100건까지만 준다 (size 를 더 크게 보내도 잘린다). */
const PAGE_SIZE = 100;
/** 폭주 방지 상한 — 2,000건까지만 모은다 */
const MAX_PAGES = 20;

/**
 * 집계용으로 모든 페이지를 모아 온다.
 * 목록은 첫 페이지만 보여주면 되지만 차트는 전량이 있어야 비율이 맞다.
 */
export const useGetAllGiftRecords = (query: GiftRecordQueryT = {}, enabled = true) => {
  const { data, isPending: isGetAllGiftRecordsPending } = useQuery({
    queryKey: [...QUERY_KEY.GIFT_RECORDS, 'all', query],
    enabled,
    queryFn: async () => {
      const first = await getGiftRecords({ ...query, page: 0, size: PAGE_SIZE });
      const pageCount = Math.min(first.totalPages, MAX_PAGES);

      const rest = await Promise.all(
        Array.from({ length: Math.max(pageCount - 1, 0) }, (_, index) =>
          getGiftRecords({ ...query, page: index + 1, size: PAGE_SIZE })
        )
      );

      return {
        records: [first, ...rest].flatMap(page => page.content),
        totalElements: first.totalElements,
      };
    },
  });

  return {
    allGiftRecords: data?.records ?? [],
    allGiftRecordsTotal: data?.totalElements ?? 0,
    isGetAllGiftRecordsPending,
  };
};
