import { cva } from 'class-variance-authority';

export const recordEmojiStyles = cva(
  'grid shrink-0 place-items-center rounded-[14px] text-[25px]',
  {
    variants: {
      accent: {
        mint: 'bg-mint-soft',
        pink: 'bg-pink-soft',
        blue: 'bg-blue-soft',
        gold: 'bg-gold-soft',
      },
      size: {
        md: 'size-[51px]',
        sm: 'size-[43px] text-[20px]',
      },
    },
    defaultVariants: {
      accent: 'gold',
      size: 'md',
    },
  }
);
