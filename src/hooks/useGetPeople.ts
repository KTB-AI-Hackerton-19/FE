'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getPeople, getPerson } from '@/apis/getPeople';
import { QUERY_KEY } from '@/consts/api';

/** 한 번에 불러올 인원 (서버 상한은 100) */
const PAGE_SIZE = 30;

export const useGetPeople = () => {
  const {
    data,
    fetchNextPage: fetchNextPeoplePage,
    hasNextPage: hasNextPeoplePage,
    isFetchingNextPage: isFetchingNextPeoplePage,
    isPending: isGetPeoplePending,
  } = useInfiniteQuery({
    queryKey: QUERY_KEY.PEOPLE,
    queryFn: ({ pageParam }) => getPeople({ page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.last ? undefined : lastPage.page + 1),
  });

  return {
    peopleData: data?.pages.flatMap(page => page.content) ?? [],
    peopleTotal: data?.pages[0]?.totalElements ?? 0,
    fetchNextPeoplePage,
    hasNextPeoplePage,
    isFetchingNextPeoplePage,
    isGetPeoplePending,
  };
};

export const useGetPerson = (id: number) => {
  const {
    data: personData,
    isPending: isGetPersonPending,
    error: getPersonError,
  } = useQuery({
    queryKey: QUERY_KEY.PERSON(id),
    queryFn: () => getPerson(id),
    enabled: Number.isFinite(id),
  });

  return { personData, isGetPersonPending, getPersonError };
};
