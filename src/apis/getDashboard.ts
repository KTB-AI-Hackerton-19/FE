import { API } from '@/consts/api';
import type { DashboardT } from '@/types/dashboard';

import { apiClient } from './apiClient';

export type GetDashboardResponseT = DashboardT;

export const getDashboard = () => apiClient.get<GetDashboardResponseT>(API.DASHBOARD);
