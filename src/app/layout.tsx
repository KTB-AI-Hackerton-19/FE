import type { Metadata, Viewport } from 'next';

import AppShell from '@/components/common/app-shell';
import '@/styles/globals.css';

import { gowunBatang, notoSansKr } from './fonts';
import Providers from './providers';

export const metadata: Metadata = {
  title: '마음장부 — 받은 마음을 기억하는 AI',
  description:
    '선물과 부조금 기록을 AI가 대신 정리하고, 답례 시점과 선물까지 찾아주는 인간관계 관리 서비스',
};

export const viewport: Viewport = {
  themeColor: '#f6f4ef',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${gowunBatang.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f1efeb] font-sans lg:bg-cream">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
