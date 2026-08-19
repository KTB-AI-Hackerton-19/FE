import type { LucideIcon } from 'lucide-react';

import { statIconStyles } from './statCard.style';

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: 'coral' | 'mint' | 'blue';
};

function StatCard({ icon: Icon, label, value, detail, tone }: StatCardProps) {
  return (
    <article className="rounded-[15px] border border-line bg-white p-3 sm:flex sm:items-center sm:gap-3.5 sm:p-[19px]">
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
    </article>
  );
}

export default StatCard;
