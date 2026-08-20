import { API } from '@/consts/api';
import type { GoogleCalendarStatusT } from '@/types/integration';

import { apiClient } from './apiClient';

export type GetGoogleCalendarStatusResponseT = GoogleCalendarStatusT;

export const getGoogleCalendarStatus = () =>
  apiClient.get<GetGoogleCalendarStatusResponseT>(API.GOOGLE_INTEGRATION);

export type GetGoogleAuthorizeUrlResponseT = { authorizeUrl: string };

/** 동의 화면 주소. 받아서 브라우저를 그쪽으로 보내면 된다. */
export const getGoogleAuthorizeUrl = () =>
  apiClient.get<GetGoogleAuthorizeUrlResponseT>(API.GOOGLE_AUTHORIZE_URL);

/** 저장된 refresh token 만 지운다. 이미 등록된 구글 일정은 그대로 남는다. */
export const deleteGoogleIntegration = () => apiClient.delete<void>(API.GOOGLE_INTEGRATION);