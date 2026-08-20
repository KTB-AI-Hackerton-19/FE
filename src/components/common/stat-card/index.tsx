import type { LucideIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

import { statIconStyles } from './statCard.style';

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  /** 값 아래 붙는 부연. 비우면 그리지 않는다 */
  detail?: string;
  tone: 'coral' | 'mint' | 'blue';
  /** 이 숫자를 자세히 볼 수 있는 화면 */
  href: Route;
};

function StatCard({ icon: Icon, label, value, detail, tone, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="rounded-[15px] border border-line bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_#503e3512] sm:flex sm:items-center sm:gap-3.5 sm:p-[19px]"
    >
      <div className={statIconStyles({ tone })}>
        <Icon size={21} />
      </div>
      {/* 부연은 오른쪽 아래 — 숫자의 아랫선에 맞춰 따로 떠 보이지 않게 한다 */}
      <div className="sm:flex sm:flex-1 sm:items-end sm:justify-between sm:gap-2">
        {/* 이름표와 숫자는 줄바꿈하지 않는다 — 좁은 칸에서 '다가오는 / 일정' 으로 쪼개졌다 */}
        <div className="shrink-0">
          <span className="mt-2 block text-[11px] font-bold whitespace-nowrap text-[#6f6a63] sm:mt-0">
            {label}
          </span>
          <strong className="mt-[3px] block font-title font-bold text-[19px] whitespace-nowrap sm:text-2xl">
            {value}
          </strong>
        </div>
        {/* 자리가 모자라면 부연이 먼저 줄어든다 — 숫자를 밀어내면 안 된다 */}
        {detail ? (
          <small className="hidden min-w-0 truncate pb-1 text-[10px] text-[#a49f97] sm:block">
            {detail}
          </small>
        ) : null}
      </div>
    </Link>
  );
}

export default StatCard;
