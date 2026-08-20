import type { LucideIcon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

import { statIconStyles } from './statCard.style';

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
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
      <div className="sm:grid sm:flex-1 sm:grid-cols-[auto_auto] sm:items-end">
        <span className="mt-2 block text-[11px] text-[#858079] sm:col-span-2 sm:mt-0">{label}</span>
        <strong className="mt-[3px] block font-title font-bold text-[19px] sm:text-2xl">
          {value}
        </strong>
        <small className="hidden pb-1 text-right text-[9px] text-[#a49f97] sm:block">
          {detail}
        </small>
      </div>
    </Link>
  );
}

export default StatCard;
