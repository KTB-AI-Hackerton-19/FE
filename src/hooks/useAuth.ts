'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useSyncExternalStore } from 'react';

import { postLogin, postLogout, postSignup } from '@/apis/auth';
import {
  AUTH_CHANGED_EVENT,
  clearTokens,
  getAccessToken,
  getDisplayName,
  getUsername,
  notifyAuthChanged,
  setTokens,
  setUsername,
} from '@/utils/tokenStorage';

const subscribe = (onChange: () => void) => {
  window.addEventListener(AUTH_CHANGED_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};

/** 로그인 여부. 서버 렌더 중에는 항상 false 라서 화면 보호는 클라이언트에서 이뤄진다. */
export const useIsLoggedIn = () =>
  useSyncExternalStore(
    subscribe,
    () => getAccessToken() !== null,
    () => false
  );

export const usePostLogin = () => {
  const queryClient = useQueryClient();

  const { mutate: postLoginMutation, isPending: isPostLoginPending } = useMutation({
    mutationFn: postLogin,
    onSuccess: (token, variables) => {
      setTokens(token);
      setUsername(variables.username);
      notifyAuthChanged();
      queryClient.clear();
    },
  });

  return { postLoginMutation, isPostLoginPending };
};

export const useUsername = () =>
  useSyncExternalStore(
    subscribe,
    () => getUsername(),
    () => null
  );

/** 로그인 응답으로 받은 표시 이름. 없으면 아이디로 대체한다. */
export const useDisplayName = () => {
  const username = useUsername();
  const displayName = useSyncExternalStore(
    subscribe,
    () => getDisplayName(),
    () => null
  );

  return displayName ?? username;
};

export const usePostSignup = () => {
  const { mutate: postSignupMutation, isPending: isPostSignupPending } = useMutation({
    mutationFn: postSignup,
  });

  return { postSignupMutation, isPostSignupPending };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(async () => {
    // 서버 무효화가 실패해도 로컬 토큰은 반드시 지운다.
    await postLogout().catch(() => undefined);
    clearTokens();
    notifyAuthChanged();
    queryClient.clear();
    router.replace('/login');
  }, [queryClient, router]);
};
