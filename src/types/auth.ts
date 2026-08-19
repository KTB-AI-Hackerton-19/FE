export type TokenT = {
  accessToken: string;
  refreshToken: string;
  /** 화면에 표시할 사용자 이름 (로그인에는 쓰지 않음) */
  name: string;
};

export type CredentialsT = {
  username: string;
  password: string;
};
