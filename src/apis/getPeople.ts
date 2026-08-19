import { API } from '@/consts/api';
import type { PersonDetailT, PersonT } from '@/types/person';

import { apiClient } from './apiClient';

export type GetPeopleResponseT = PersonT[];

export const getPeople = (q?: string) => apiClient.get<GetPeopleResponseT>(API.PEOPLE, { q });

export type GetPersonResponseT = PersonDetailT;

export const getPerson = (id: number) => apiClient.get<GetPersonResponseT>(API.PERSON(id));
