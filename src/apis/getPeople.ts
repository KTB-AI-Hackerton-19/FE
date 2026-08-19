import { API } from '@/consts/api';
import type { PageResponseT } from '@/types/api';
import type { PersonDetailT, PersonT } from '@/types/person';

import { apiClient } from './apiClient';

export type GetPeopleQueryT = {
  /** 이름 부분 일치 */
  q?: string;
  page?: number;
  /** 서버 상한 100 */
  size?: number;
};

/** 배열이 아니라 페이지 응답이다. */
export type GetPeopleResponseT = PageResponseT<PersonT>;

export const getPeople = (query: GetPeopleQueryT = {}) =>
  apiClient.get<GetPeopleResponseT>(API.PEOPLE, query);

export type GetPersonResponseT = PersonDetailT;

export const getPerson = (id: number) => apiClient.get<GetPersonResponseT>(API.PERSON(id));