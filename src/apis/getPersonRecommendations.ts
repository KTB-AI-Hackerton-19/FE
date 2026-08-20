import { API } from '@/consts/api';
import type { RecommendedGiftT } from '@/types/recommendation';

import { apiClient } from './apiClient';

export type GetPersonRecommendationsResponseT = RecommendedGiftT[];

/**
 * 한 사람의 관계·메모·지난 선물을 근거로 만든 추천.
 * 홈 추천과 달리 사람이 이미 정해져 있어 묶음 없이 선물만 내려온다.
 */
export const getPersonRecommendations = ({ id, refresh }: { id: number; refresh?: boolean }) =>
  apiClient.get<GetPersonRecommendationsResponseT>(API.PERSON_RECOMMENDATIONS(id), { refresh });
