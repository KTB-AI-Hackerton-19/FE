export type ErrorDetailT = {
  code: string;
  message: string;
};

/** 백엔드 공통 응답 포맷 — 성공이면 data만, 실패면 error만 채워진다. */
export type ApiResponseT<T> = {
  success: boolean;
  data: T | null;
  error: ErrorDetailT | null;
};

export type PageResponseT<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};
