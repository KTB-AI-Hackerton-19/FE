import { API } from '@/consts/api';
import type { CredentialsT, TokenT } from '@/types/auth';

import { apiClient } from './apiClient';

export type PostLoginRequestT = CredentialsT;
export type PostLoginResponseT = TokenT;

export const postLogin = (body: PostLoginRequestT) =>
  apiClient.post<PostLoginResponseT>(API.LOGIN, body, { skipAuth: true });

export type PostSignupRequestT = CredentialsT & {
  /** 화면에 표시할 이름 (필수, 20자 이내) */
  name: string;
};

export const postSignup = (body: PostSignupRequestT) =>
  apiClient.post<void>(API.SIGNUP, body, { skipAuth: true });

export const postLogout = () => apiClient.post<void>(API.LOGOUT);
