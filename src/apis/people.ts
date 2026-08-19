import { API } from '@/consts/api';
import type { PersonT } from '@/types/person';

import { apiClient } from './apiClient';

export type PostPersonRequestT = {
  name: string;
  relation?: string;
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

/**
 * 여러 명을 한 번에 삭제한다.
 * 벌크 엔드포인트가 생기면 이 함수 안만 바꾸면 된다.
 */
export const deletePeople = async (ids: number[]) => {
  await Promise.all(ids.map(deletePerson));
};
