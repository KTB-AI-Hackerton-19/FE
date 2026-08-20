'use client';

import { useEffect, useState } from 'react';

/** 실제로 5초 안팎이 걸린다. 그 사이를 채우도록 잡은 눈금 */
const TICK_MS = 100;
const EXPECTED_MS = 5000;
/** 끝났다고 착각하지 않도록 마지막 몇 %는 응답이 와야 채워진다 */
const CEILING = 95;

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function LoadingStep() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // 남은 거리의 일부씩만 좁혀 끝으로 갈수록 느려지게 한다 — 실제 응답 시간이 들쭉날쭉하다.
      setPercent(current => current + (CEILING - current) * (TICK_MS / EXPECTED_MS));
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-11 text-center">
      <div className="relative mx-auto size-[84px]">
        <svg viewBox="0 0 84 84" className="size-full -rotate-90">
          <circle cx="42" cy="42" r={RADIUS} fill="none" stroke="#f3ece6" strokeWidth="6" />
          <circle
            cx="42"
            cy="42"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
            className="text-coral transition-[stroke-dashoffset] duration-100 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-title font-bold text-[19px] text-coral-deep">
          {Math.round(percent)}%
        </span>
      </div>

      <h2 className="mt-6 mb-2 font-title font-bold text-[23px]">
        전달된 마음을 정리하는 중이에요
      </h2>
      <p className="text-[11px] leading-[1.7] text-[#938d85]">
        보낸 사람과 금액, 날짜를 읽고 있어요.
      </p>
      <p className="mt-1.5 text-[10px] text-subtle">5초만 기다려주세요.</p>
    </div>
  );
}

export default LoadingStep;
