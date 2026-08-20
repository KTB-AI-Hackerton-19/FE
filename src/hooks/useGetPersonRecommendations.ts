'use client';

import { useQuery } from '@tanstack/react-query';

import { getPersonRecommendations } from '@/apis/getPersonRecommendations';
import { QUERY_KEY } from '@/consts/api';

export const useGetPersonRecommendations = (id: number) => {
  const { data: personRecommendations = [], isPending: isGetPersonRecommendationsPending } =
    useQuery({
      queryKey: QUERY_KEY.PERSON_RECOMMENDATIONS(id),
      queryFn: () => getPersonRecommendations({ id }),
      // 서버가 만들어 둔 추천을 재사용한다 — 들어올 때마다 AI를 부르지 않는다.
      staleTime: 10 * 60 * 1000,
    });

  return { personRecommendations, isGetPersonRecommendationsPending };
};
