'use client';

import { useQuery } from '@tanstack/react-query';

import { getEventCategories } from '@/apis/getEventCategories';
import { QUERY_KEY } from '@/consts/api';

export const useGetEventCategories = () => {
  const { data: eventCategories = [], isPending: isGetEventCategoriesPending } = useQuery({
    queryKey: QUERY_KEY.EVENT_CATEGORIES,
    queryFn: getEventCategories,
    // 고정 목록이라 거의 바뀌지 않는다.
    staleTime: 30 * 60 * 1000,
  });

  return { eventCategories, isGetEventCategoriesPending };
};
