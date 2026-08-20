import { API, API_BASE_URL } from '@/consts/api';
import type { ApiResponseT, FieldErrorT } from '@/types/api';
import type { TokenT } from '@/types/auth';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  notifyAuthChanged,
  setTokens,
} from '@/utils/tokenStorage';

export class ApiError extends Error {
  code: string;
  status: number;
  /** 어느 칸이 잘못됐는지 (INVALID_INPUT 일 때만). 칸 아래 안내 문구로 쓴다 */
  fields: FieldErrorT[];

  constructor(code: string, message: string, status: number, fields: FieldErrorT[] = []) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

/** 서버가 짚어 준 칸별 문구를 { 칸이름: 문구 } 로 바꾼다. */
export const toFieldMessages = (error: unknown) => {
  if (!(error instanceof ApiError)) return {};

  return Object.fromEntries(error.fields.map(({ field, message }) => [field, message]));
};

type RequestOptionsT = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** 인증 헤더를 붙이지 않는다 (로그인·회원가입) */
  skipAuth?: boolean;
};

const buildUrl = (path: string, query?: RequestOptionsT['query']) => {
  const url = new URL(path, API_BASE_URL);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

const baseHeaders = () => ({
  'Content-Type': 'application/json',
  // ngrok 무료 터널의 브라우저 경고 인터스티셜을 건너뛴다.
  'ngrok-skip-browser-warning': '1',
});

/** 동시에 여러 요청이 401을 받아도 재발급은 한 번만 수행한다. */
let refreshPromise: Promise<boolean> | null = null;

const refreshTokens = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(buildUrl(API.REFRESH), {
      method: 'POST',
      headers: baseHeaders(),
      body: JSON.stringify({ refreshToken }),
    });
    const json = (await response.json()) as ApiResponseT<TokenT>;
    if (!response.ok || !json.success || !json.data) return false;

    setTokens(json.data);
    return true;
  } catch {
    return false;
  }
};

const ensureRefreshed = () => {
  refreshPromise ??= refreshTokens().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
};

const send = async (path: string, options: RequestOptionsT) => {
  const { method = 'GET', body, query, skipAuth } = options;
  const accessToken = skipAuth ? null : getAccessToken();

  return fetch(buildUrl(path, query), {
    method,
    headers: {
      ...baseHeaders(),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
};

export const request = async <T>(path: string, options: RequestOptionsT = {}): Promise<T> => {
  let response = await send(path, options);

  // 액세스 토큰이 만료되면 한 번만 재발급 후 재시도한다.
  if (response.status === 401 && !options.skipAuth) {
    const refreshed = await ensureRefreshed();
    if (refreshed) {
      response = await send(path, options);
    } else {
      clearTokens();
      notifyAuthChanged();
      throw new ApiError('UNAUTHORIZED', '로그인이 필요해요.', 401);
    }
  }

  const json = (await response.json().catch(() => null)) as ApiResponseT<T> | null;

  if (!response.ok || !json?.success) {
    const error = json?.error;
    if (response.status === 401) {
      clearTokens();
      notifyAuthChanged();
    }
    throw new ApiError(
      error?.code ?? 'UNKNOWN',
      error?.message ?? '요청을 처리하지 못했어요.',
      response.status,
      error?.fields ?? []
    );
  }

  return json.data as T;
};

export const apiClient = {
  get: <T>(path: string, query?: RequestOptionsT['query']) => request<T>(path, { query }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptionsT, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string, query?: RequestOptionsT['query']) =>
    request<T>(path, { method: 'DELETE', query }),
};
