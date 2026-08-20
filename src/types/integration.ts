export type GoogleCalendarStatusT = {
  connected: boolean;
  googleEmail: string | null;
  connectedAt: string | null;
  /** 토큰이 만료·철회되어 다시 연동해야 하는 상태 */
  reauthRequired: boolean;
  /** 서버에 구글 OAuth 설정이 되어 있는지. false 면 연동 자체를 제공할 수 없다 */
  available: boolean;
};