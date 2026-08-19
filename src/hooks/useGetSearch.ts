'use client';

import { useQuery } from '@tanstack/react-query';

import { getSearch } from '@/apis/getSearch';
import { QUERY_KEY } from '@/consts/api';

export const useGetSearch = (q: string) => {
  const query = q.trim();

  const { data: searchData, isFetching: isGetSearchFetching } = useQuery({
    queryKey: QUERY_KEY.SEARCH(query),
    queryFn: () => getSearch({ q: query }),
    enabled: query.length > 0,
  });

  return { searchData, isGetSearchFetching };
};
