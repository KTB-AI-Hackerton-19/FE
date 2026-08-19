import type { Metadata, Viewport } from 'next';

import '@/styles/globals.css';

import { baloo2, gowunBatang, notoSansKr } from './fonts';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Giftie - 마음을 기억하는 가장 쉬운 방법',
  description:
    '선물과 부조금 기록을 AI가 대신 정리하고, 답례 시점과 선물까지 찾아주는 인간관계 관리 서비스',
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#f6f4ef',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${gowunBatang.variable} ${baloo2.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f1efeb] font-sans lg:bg-cream">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
