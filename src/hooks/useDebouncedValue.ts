'use client';

import { useEffect, useState } from 'react';

/** 입력이 멈춘 뒤에만 값을 반영해 검색 요청 수를 줄인다. */
export const useDebouncedValue = <T>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
