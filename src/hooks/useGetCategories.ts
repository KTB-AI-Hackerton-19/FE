'use client';

import { useQuery } from '@tanstack/react-query';

import { getCategories } from '@/apis/getCategories';
import type { GetCategoriesQueryT } from '@/apis/getCategories';
import { QUERY_KEY } from '@/consts/api';

export const useGetCategories = (query: GetCategoriesQueryT = {}) => {
  const { data: categoriesData = [], isPending: isGetCategoriesPending } = useQuery({
    queryKey: [...QUERY_KEY.CATEGORIES, query],
    queryFn: () => getCategories(query),
    // 카테고리는 거의 바뀌지 않으므로 오래 캐싱한다.
    staleTime: 10 * 60 * 1000,
  });

  return { categoriesData, isGetCategoriesPending };
};
