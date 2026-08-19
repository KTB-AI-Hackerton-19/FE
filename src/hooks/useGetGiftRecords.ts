'use client';

import { useQuery } from '@tanstack/react-query';

import { getGiftRecords } from '@/apis/getGiftRecords';
import { QUERY_KEY } from '@/consts/api';
import type { GiftRecordQueryT } from '@/types/record';

export const useGetGiftRecords = (query: GiftRecordQueryT = {}) => {
  const {
    data: giftRecordsData,
    isPending: isGetGiftRecordsPending,
    isFetching: isGetGiftRecordsFetching,
  } = useQuery({
    queryKey: [...QUERY_KEY.GIFT_RECORDS, query],
    queryFn: () => getGiftRecords(query),
    placeholderData: previous => previous,
  });

  return { giftRecordsData, isGetGiftRecordsPending, isGetGiftRecordsFetching };
};
