'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { QUERY_KEY } from '@/consts/api';
import { useAppUi } from '@/hooks/useAppUi';

const MESSAGES: Record<string, string> = {
  connected: '구글 캘린더를 연동했어요',
  denied: '연동을 취소했어요',
  failed: '연동하지 못했어요. 잠시 후 다시 시도해주세요.',
};

/**
 * 구글 동의 화면에서 돌아오면 서버가 ?google=connected|denied|failed 를 붙여 보낸다.
 * 결과를 토스트로 알리고 주소에서 흔적을 지운다.
 */
function GoogleConnectResult() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useAppUi();

  const result = searchParams.get('google');

  useEffect(() => {
    if (!result) return;

    showToast(MESSAGES[result] ?? MESSAGES.failed);
    queryClient.invalidateQueries({ queryKey: QUERY_KEY.GOOGLE_INTEGRATION });
    // 새로고침해도 토스트가 다시 뜨지 않도록 쿼리를 걷어낸다.
    router.replace(pathname);
  }, [result, pathname, router, queryClient, showToast]);

  return null;
}

export default GoogleConnectResult;
