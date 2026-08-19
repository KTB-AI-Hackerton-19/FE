import type { TokenT } from '@/types/auth';

const ACCESS_KEY = 'giftie-access-token';
const REFRESH_KEY = 'giftie-refresh-token';
const USERNAME_KEY = 'giftie-username';
const DISPLAY_NAME_KEY = 'giftie-display-name';

const read = (key: string) => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // 저장 실패는 무시 — 다음 요청에서 다시 로그인 흐름을 탄다.
  }
};

export const getAccessToken = () => read(ACCESS_KEY);
export const getRefreshToken = () => read(REFRESH_KEY);

export const setTokens = ({ accessToken, refreshToken, name }: TokenT) => {
  write(ACCESS_KEY, accessToken);
  write(REFRESH_KEY, refreshToken);
  if (name) write(DISPLAY_NAME_KEY, name);
};

export const getUsername = () => read(USERNAME_KEY);
export const setUsername = (username: string) => write(USERNAME_KEY, username);

export const getDisplayName = () => read(DISPLAY_NAME_KEY);
export const setDisplayName = (name: string) => write(DISPLAY_NAME_KEY, name);

export const clearTokens = () => {
  write(ACCESS_KEY, null);
  write(REFRESH_KEY, null);
  write(USERNAME_KEY, null);
  write(DISPLAY_NAME_KEY, null);
};

/** 로그인 상태 변화를 구독하는 쪽(useAuth)에 알리기 위한 이벤트 */
export const AUTH_CHANGED_EVENT = 'giftie:auth-changed';

export const notifyAuthChanged = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};
