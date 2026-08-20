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

  /** 남은 페이지를 끝까지 불러오고 전체 id 를 돌려준다 — '전체선택'용. */
  const loadAllPeopleIds = async () => {
    let result = { data, hasNextPage: hasNextPeoplePage };

    while (result.hasNextPage) {
      result = await fetchNextPeoplePage();
    }

    return result.data?.pages.flatMap(page => page.content).map(person => person.id) ?? [];
  };

  return {
    peopleData: data?.pages.flatMap(page => page.content) ?? [],
    loadAllPeopleIds,
    peopleTotal: data?.pages[0]?.totalElements ?? 0,
    fetchNextPeoplePage,
    hasNextPeoplePage,
    isFetchingNextPeoplePage,
    isGetPeoplePending,
  };
};

/**
 * 기록 모달의 사람 선택용.
 * 검색어가 없으면 전체 목록을 보여 주고, 치기 시작하면 좁힌다.
 */
export const useSearchPeople = (keyword: string) => {
  const trimmed = keyword.trim();

  const { data, isFetching: isSearchPeopleFetching } = useQuery({
    queryKey: [...QUERY_KEY.PEOPLE, 'search', trimmed],
    queryFn: () => getPeople({ q: trimmed || undefined, size: 20 }),
    // 글자를 칠 때마다 키가 바뀌는데, 이전 결과를 붙잡아 두지 않으면
    // 매번 빈 목록을 거쳐 가서 선택창이 깜빡인다.
    placeholderData: previous => previous,
  });

  return { searchedPeople: data?.content ?? [], isSearchPeopleFetching };
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
