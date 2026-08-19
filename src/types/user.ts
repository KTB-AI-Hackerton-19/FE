export type UserT = {
  /** 로그인 아이디 — 변경할 수 없다 */
  username: string;
  /** 화면에 표시할 이름 (20자 이내) */
  name: string;
  /** 15분 만료 presigned URL. 캐싱하지 않는다 */
  profileImageUrl: string | null;
};