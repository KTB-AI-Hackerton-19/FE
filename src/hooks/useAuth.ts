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

/**
 * 로그인 여부. `null` 은 "아직 모름" 이다.
 *
 * 토큰이 localStorage 에 있어 서버 렌더 중에는 알 수 없고, React 는 하이드레이션 때도
 * 서버 스냅샷을 쓴다. 이때 `false` 를 돌려주면 토큰이 있는데도 "로그아웃" 으로 읽혀
 * 새로고침마다 로그인 화면으로 튕긴다. 그래서 모르는 상태를 따로 표현한다.
 */
export const useIsLoggedIn = () =>
  useSyncExternalStore<boolean | null>(
    subscribe,
    () => getAccessToken() !== null,
    () => null
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
