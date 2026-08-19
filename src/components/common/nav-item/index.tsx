'use client';

import Link from 'next/link';

import type { NavItemT } from '@/consts/nav';

import { navItemStyles } from './navItem.style';

type NavItemProps = {
  item: NavItemT;
  active: boolean;
  layout?: 'side' | 'bottom';
  count?: number;
};

function NavItem({ item, active, layout = 'side', count }: NavItemProps) {
  const { href, label, shortLabel, icon: Icon } = item;

  return (
    <Link href={href} className={navItemStyles({ layout, active })}>
      <Icon size={layout === 'side' ? 20 : 19} />
      <span>{layout === 'side' ? label : shortLabel}</span>
      {layout === 'side' && count ? (
        <small className="ml-auto grid h-[21px] w-6 place-items-center rounded-[10px] bg-[#f2d6cf] text-[11px]">
          {count}
        </small>
      ) : null}
    </Link>
  );
}

export default NavItem;
