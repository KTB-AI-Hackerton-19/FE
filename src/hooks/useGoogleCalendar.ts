'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteGoogleIntegration,
  getGoogleAuthorizeUrl,
  getGoogleCalendarStatus,
} from '@/apis/integrations';
import { QUERY_KEY } from '@/consts/api';

export const useGetGoogleCalendarStatus = () => {
  const { data: googleStatus, isPending: isGetGoogleStatusPending } = useQuery({
    queryKey: QUERY_KEY.GOOGLE_INTEGRATION,
    queryFn: getGoogleCalendarStatus,
  });

  return { googleStatus, isGetGoogleStatusPending };
};

/** 동의 화면 주소를 받아 브라우저를 그쪽으로 보낸다. 돌아올 때 ?google= 이 붙는다. */
export const useConnectGoogleCalendar = () => {
  const { mutate: connectGoogleMutation, isPending: isConnectGooglePending } = useMutation({
    mutationFn: getGoogleAuthorizeUrl,
    onSuccess: ({ authorizeUrl }) => {
      window.location.href = authorizeUrl;
    },
  });

  return { connectGoogleMutation, isConnectGooglePending };
};

export const useDisconnectGoogleCalendar = () => {
  const queryClient = useQueryClient();

  const { mutate: disconnectGoogleMutation, isPending: isDisconnectGooglePending } = useMutation({
    mutationFn: deleteGoogleIntegration,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY.GOOGLE_INTEGRATION }),
  });

  return { disconnectGoogleMutation, isDisconnectGooglePending };
};