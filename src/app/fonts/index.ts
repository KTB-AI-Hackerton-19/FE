import { Baloo_2, Gowun_Batang, Noto_Sans_KR } from 'next/font/google';

export const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const gowunBatang = Gowun_Batang({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-gowun-batang',
  display: 'swap',
});

/** 로고 전용 — weight 를 생략해 가변 폰트 한 벌만 받는다. */
export const baloo2 = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo-2',
  display: 'swap',
});
