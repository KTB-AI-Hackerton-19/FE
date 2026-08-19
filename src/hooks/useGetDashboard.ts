'use client';

import { useQuery } from '@tanstack/react-query';

import { getDashboard } from '@/apis/getDashboard';
import { QUERY_KEY } from '@/consts/api';

export const useGetDashboard = () => {
  const {
    data: dashboardData,
    isPending: isGetDashboardPending,
    error: getDashboardError,
  } = useQuery({
    queryKey: QUERY_KEY.DASHBOARD,
    queryFn: getDashboard,
  });

  return { dashboardData, isGetDashboardPending, getDashboardError };
};
