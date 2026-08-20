'use client';

import { useEffect } from 'react';

/**
 * 모달이 떠 있는 동안 뒤 화면이 따라 움직이지 않게 막는다.
 * 사라지는 스크롤바만큼 여백을 채워 화면이 옆으로 밀리지 않게 한다.
 */
export const useLockBodyScroll = () => {
  useEffect(() => {
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (gap > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gap}px`;
    }

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, []);
};
