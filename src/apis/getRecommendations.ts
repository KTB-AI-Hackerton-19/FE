import { API } from '@/consts/api';
import type { RecommendationT } from '@/types/recommendation';

import { apiClient } from './apiClient';

export type GetRecommendationsResponseT = RecommendationT[];

export const getRecommendations = (params: {
  personId?: number;
  limit?: number;
  refresh?: boolean;
}) => apiClient.get<GetRecommendationsResponseT>(API.RECOMMENDATIONS, params);
