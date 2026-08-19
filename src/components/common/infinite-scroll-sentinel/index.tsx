'use client';

import { useEffect, useRef } from 'react';

type InfiniteScrollSentinelProps = {
  hasMore: boolean;
  isFetching: boolean;
  onReach: () => void;
};

/** 목록 끝에 두는 감시 지점. 화면에 들어오면 다음 페이지를 불러온다. */
function InfiniteScrollSentinel({ hasMore, isFetching, onReach }: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasMore) return;

    // 바닥에 닿기 전에 미리 불러 와 끊김을 줄인다.
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) onReach();
      },
      { rootMargin: '240px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, onReach]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="py-5 text-center text-[11px] text-subtle">
      {isFetching ? '불러오는 중…' : ' '}
    </div>
  );
}

export default InfiniteScrollSentinel;
