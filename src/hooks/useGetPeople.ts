'use client';

import { useQuery } from '@tanstack/react-query';

import { getPeople, getPerson } from '@/apis/getPeople';
import { QUERY_KEY } from '@/consts/api';

export const useGetPeople = () => {
  const { data: peopleData = [], isPending: isGetPeoplePending } = useQuery({
    queryKey: QUERY_KEY.PEOPLE,
    queryFn: () => getPeople(),
  });

  return { peopleData, isGetPeoplePending };
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
