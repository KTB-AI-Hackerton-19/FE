'use client';

import { useQuery } from '@tanstack/react-query';

import { getRecords } from '@/apis/getRecords';
import { QUERY_KEY } from '@/consts/api';
import { STARTER_RECORDS } from '@/consts/record';

export const useGetRecords = () => {
  const { data: recordsData = STARTER_RECORDS, isPending: isGetRecordsPending } = useQuery({
    queryKey: QUERY_KEY.RECORDS,
    queryFn: getRecords,
  });

  return { recordsData, isGetRecordsPending };
};
