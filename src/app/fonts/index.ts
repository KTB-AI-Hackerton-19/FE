import { Baloo_2 } from 'next/font/google';

/**
 * 본문·제목은 Pretendard 를 쓴다.
 * Google Fonts 에 없어 `public/fonts/pretendard/pretendard.css` 를 자체 호스팅한다 —
 * unicode-range 로 92개 청크가 나뉘어 있어 브라우저가 화면에 쓰인 글자의 청크만 받는다.
 */
export const PRETENDARD_CSS_HREF = '/fonts/pretendard/pretendard.css';

/** 로고 전용 — weight 를 생략해 가변 폰트 한 벌만 받는다. */
export const baloo2 = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo-2',
  display: 'swap',
});