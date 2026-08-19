'use client';

import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/apis/user';
import { QUERY_KEY } from '@/consts/api';

export const useGetMe = () => {
  const { data: meData, isPending: isGetMePending } = useQuery({
    queryKey: QUERY_KEY.ME,
    queryFn: getMe,
    // profileImageUrl 이 15분 만료 presigned URL 이라 오래 들고 있지 않는다.
    staleTime: 5 * 60 * 1000,
  });

  return { meData, isGetMePending };
};