import { cva } from 'class-variance-authority';

export const navItemStyles = cva('flex cursor-pointer items-center transition', {
  variants: {
    layout: {
      side: 'w-full gap-[13px] rounded-xl px-[13px] py-3 text-left text-sm font-semibold',
      bottom: 'flex-col gap-[3px] px-0.5 py-1.5 text-center text-[9px] font-semibold',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { layout: 'side', active: true, class: 'bg-coral-soft text-[#d96858]' },
    { layout: 'side', active: false, class: 'text-[#77736d] hover:bg-[#f8f5f0] hover:text-ink' },
    { layout: 'bottom', active: true, class: 'text-coral-deep' },
    { layout: 'bottom', active: false, class: 'text-[#77736d]' },
  ],
  defaultVariants: {
    layout: 'side',
    active: false,
  },
});
