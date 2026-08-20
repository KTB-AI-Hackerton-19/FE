'use client';

import { useEffect, useRef, useState } from 'react';

import { useGetDashboard } from '@/hooks/useGetDashboard';
import { useGetGoogleCalendarStatus } from '@/hooks/useGoogleCalendar';

import AgentCard from './AgentCard';
import CalendarBanner from './CalendarBanner';
import StartBanner from './StartBanner';

/** 자동으로 넘어가는 간격 — 읽을 시간은 주되 지루하지 않게 */
const AUTO_MS = 6000;

/**
 * 홈 맨 위 배너. 보여줄 것이 여럿이라 옆으로 넘어간다.
 * 상황에 맞는 것만 골라 담으므로 한 장뿐일 때도 있다.
 */
function HomeBanners() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  /** 마우스를 올려 두거나 직접 넘긴 동안은 멈춘다 */
  const [isPaused, setIsPaused] = useState(false);

  const { dashboardData } = useGetDashboard();
  const { googleStatus } = useGetGoogleCalendarStatus();

  const hasRecords = (dashboardData?.stats.totalRecords ?? 0) > 0;
  const needsGoogle = Boolean(googleStatus?.available) && !googleStatus?.connected;

  const slides = [
    // 챙길 일정이 있을 때만 서버가 내려준다.
    dashboardData?.agentInsight ? { key: 'agent', node: <AgentCard /> } : null,
    // 기록이 없으면 에이전트 카드가 있을 리 없다 — 시작을 권하는 배너를 대신 둔다.
    hasRecords ? null : { key: 'start', node: <StartBanner /> },
    needsGoogle ? { key: 'calendar', node: <CalendarBanner /> } : null,
  ].filter(slide => slide !== null);

  const moveTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    track.scrollTo({ left: track.clientWidth * index, behavior: 'smooth' });
  };

  /**
   * 손으로 넘긴 직후에는 자동 넘김을 잠시 쉰다 —
   * 읽고 있는 배너를 빼앗기면 답답하다.
   */
  useEffect(() => {
    if (slides.length < 2 || isPaused) return;

    const timer = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const next = (Math.round(track.scrollLeft / track.clientWidth) + 1) % slides.length;
      track.scrollTo({ left: track.clientWidth * next, behavior: 'smooth' });
    }, AUTO_MS);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (slides.length === 0) return null;

  return (
    <div>
      <div
        ref={trackRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        // 스크롤 위치로 몇 번째인지 계산한다 — 손으로 넘겨도 점이 따라온다.
        onScroll={event => {
          const track = event.currentTarget;
          setCurrent(Math.round(track.scrollLeft / track.clientWidth));
        }}
        className="flex snap-x snap-mandatory gap-3 overflow-auto"
      >
        {slides.map(slide => (
          <div key={slide.key} className="flex w-full shrink-0 snap-start">
            {slide.node}
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => {
                setIsPaused(true);
                moveTo(index);
              }}
              aria-label={`${index + 1}번째 배너 보기`}
              aria-current={index === current}
              className={`h-[5px] cursor-pointer rounded-full transition-all ${
                index === current ? 'w-5 bg-coral' : 'w-[5px] bg-[#e2dbd3] hover:bg-[#d0c8bf]'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default HomeBanners;
