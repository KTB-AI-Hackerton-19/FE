'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useIsLoggedIn } from '@/hooks/useAuth';

type AuthGuardProps = {
  children: React.ReactNode;
};

/**
 * 토큰이 localStorage 에 있어 서버에서는 로그인 여부를 알 수 없다.
 * 따라서 클라이언트에서 확인하고, 없으면 로그인 화면으로 보낸다.
 */
function AuthGuard({ children }: AuthGuardProps) {
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
}

export default AuthGuard;
