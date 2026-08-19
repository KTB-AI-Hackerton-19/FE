'use client';

import { useState } from 'react';

import { useLogout } from '@/hooks/useAuth';

/**
 * 로그아웃 확인 다이얼로그의 상태를 관리한다.
 * 트리거와 다이얼로그를 떨어뜨려 놓아야 하는 곳(사이드바 등)이 있어 컴포넌트가 아닌 훅으로 둔다.
 */
export const useLogoutFlow = () => {
  const logout = useLogout();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const openLogoutConfirm = () => setIsConfirmOpen(true);
  const closeLogoutConfirm = () => setIsConfirmOpen(false);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return { isConfirmOpen, isLoggingOut, openLogoutConfirm, closeLogoutConfirm, confirmLogout };
};