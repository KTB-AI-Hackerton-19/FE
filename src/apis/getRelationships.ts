import { API } from '@/consts/api';
import type { RelationshipT } from '@/types/relationship';

import { apiClient } from './apiClient';

export type GetRelationshipsResponseT = RelationshipT[];

/** 관계는 서버가 정한 목록에서만 고른다 — 자유 입력을 받지 않는다. */
export const getRelationships = () => apiClient.get<GetRelationshipsResponseT>(API.RELATIONSHIPS);
