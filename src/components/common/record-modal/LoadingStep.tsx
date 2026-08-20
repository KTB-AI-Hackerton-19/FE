'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

/** 실제로 5초 안팎이 걸린다. 그 사이를 채우도록 잡은 눈금 */
const TICK_MS = 100;
const EXPECTED_MS = 5000;
/** 끝났다고 착각하지 않도록 마지막 몇 %는 응답이 와야 채워진다 */
const CEILING = 96;

/** 지금 무엇을 하는 중인지 — 숫자 대신 이 문구가 바뀌며 진행을 알린다 */
const STEPS = ['사진을 읽고 있어요', '보낸 사람을 찾고 있어요', '금액과 날짜를 정리하고 있어요'];
const STEP_MS = 1600;

function LoadingStep() {
  const [percent, setPercent] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // 남은 거리의 일부씩만 좁혀 끝으로 갈수록 느려진다 — 실제 응답 시간이 들쭉날쭉하다.
      setPercent(current => current + (CEILING - current) * (TICK_MS / EXPECTED_MS));
    }, TICK_MS);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 마지막 문구에서 멈춘다 — 되돌아가면 처음부터 다시 하는 것처럼 보인다.
    const timer = setInterval(() => {
      setStep(current => Math.min(current + 1, STEPS.length - 1));
    }, STEP_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-11 text-center">
      <div className="mx-auto grid size-[65px] animate-pulse place-items-center rounded-[22px] bg-coral-soft text-coral">
        <Heart size={28} fill="currentColor" />
      </div>

      <h2 className="mt-[22px] mb-2 font-title font-bold text-[23px]">
        받으신 마음의 정보를 살펴보고 있어요
      </h2>
      <p className="text-[11px] leading-[1.7] text-[#938d85]">{STEPS[step]}</p>
      <p className="mt-1.5 text-[10px] text-subtle">잠시만 기다려주세요.</p>

      <div className="mx-auto mt-6 h-[5px] w-[190px] overflow-hidden rounded-full bg-[#f1ebe5]">
        <div
          style={{ width: `${percent}%` }}
          className="h-full rounded-full bg-coral transition-[width] duration-100 ease-linear"
        />
      </div>
    </div>
  );
}

export default LoadingStep;
