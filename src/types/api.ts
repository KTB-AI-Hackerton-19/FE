/** 어느 칸이 잘못됐는지 서버가 알려주는 항목 — 그 칸 아래에 그대로 띄운다 */
export type FieldErrorT = {
  field: string;
  message: string;
};

export type ErrorDetailT = {
  code: string;
  message: string;
  /** INVALID_INPUT 일 때만 담긴다 */
  fields?: FieldErrorT[];
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
