import { API } from '@/consts/api';
import type { RelationshipT } from '@/types/relationship';

import { apiClient } from './apiClient';

export type PostRelationshipRequestT = {
  name: string;
};

export type PostRelationshipResponseT = RelationshipT;

/** 기본 9가지 말고 직접 만든 관계를 추가한다. */
export const postRelationship = (body: PostRelationshipRequestT) =>
  apiClient.post<PostRelationshipResponseT>(API.RELATIONSHIPS, body);
