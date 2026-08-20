import { API } from '@/consts/api';
import type { GenderT, PersonT } from '@/types/person';

import { apiClient } from './apiClient';

export type PostPersonRequestT = {
  name: string;
  relation?: string;
  /** 선택 항목 — 선물 추천의 참고 정보로 쓰인다 */
  gender?: GenderT;
  birthday?: string;
  memo?: string;
};
export type PostPersonResponseT = PersonT;

/** 같은 이름이 이미 있으면 갱신된다. */
export const postPerson = (body: PostPersonRequestT) =>
  apiClient.post<PostPersonResponseT>(API.PEOPLE, body);

export type PatchPersonRequestT = PostPersonRequestT & { id: number };

export const patchPerson = ({ id, ...body }: PatchPersonRequestT) =>
  apiClient.patch<PersonT>(API.PERSON(id), body);

export const deletePerson = (id: number) => apiClient.delete<void>(API.PERSON(id));

export type DeletePeopleResponseT = {
  deletedPeople: number;
  deletedRecords: number;
  deletedReminders: number;
};

/** 여러 명을 한 번에 삭제한다. 각자의 기록·알림·추천도 함께 사라진다. */
export const deletePeople = (ids: number[]) =>
  apiClient.delete<DeletePeopleResponseT>(API.PEOPLE, { ids: ids.join(',') });
