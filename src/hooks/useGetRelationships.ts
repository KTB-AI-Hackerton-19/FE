'use client';

import { useQuery } from '@tanstack/react-query';

import { getRelationships } from '@/apis/getRelationships';
import { QUERY_KEY } from '@/consts/api';

export const useGetRelationships = () => {
  const { data: relationships = [], isPending: isGetRelationshipsPending } = useQuery({
    queryKey: QUERY_KEY.RELATIONSHIPS,
    queryFn: getRelationships,
    // 거의 바뀌지 않는 목록이라 오래 캐싱한다.
    staleTime: 30 * 60 * 1000,
  });

  return { relationships, isGetRelationshipsPending };
};
