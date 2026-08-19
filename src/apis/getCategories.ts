import { API } from '@/consts/api';
import type { CategoryT } from '@/types/category';

import { apiClient } from './apiClient';

export type GetCategoriesResponseT = CategoryT[];

export const getCategories = () => apiClient.get<GetCategoriesResponseT>(API.CATEGORIES);
