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
 *
 * 하이드레이션이 끝나기 전(`null`)에는 판단을 미룬다 — 여기서 튕기면
 * 토큰이 멀쩡한데도 새로고침마다 로그인이 풀린 것처럼 보인다.
 */
function AuthGuard({ children }: AuthGuardProps) {
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn === false) router.replace('/login');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
}

export default AuthGuard;
