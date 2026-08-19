import { cva } from 'class-variance-authority';

export const profileAvatarStyles = cva(
  'grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#e8d2c2] font-bold text-[#795642] uppercase',
  {
    variants: {
      size: {
        sm: 'size-[34px] text-xs',
        md: 'size-10 text-sm',
        lg: 'size-14 font-serif text-xl',
        xl: 'size-20 font-serif text-[28px]',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
);