'use client';

import { useSyncExternalStore } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const subscribe = () => () => {};

const getTodayLabel = () => {
  const now = new Date();
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${WEEKDAYS[now.getDay()]}요일`;
};

function TodayLabel() {
  // 서버에서는 빈 값을, 클라이언트에서는 실제 오늘 날짜를 렌더해 hydration 불일치를 피한다.
  const today = useSyncExternalStore(subscribe, getTodayLabel, () => '');

  return (
    <span className="text-xs font-semibold tracking-[0.03em] text-[#96918a]">{today || ' '}</span>
  );
}

export default TodayLabel;
