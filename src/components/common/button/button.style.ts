import { cva } from 'class-variance-authority';

export const buttonStyles = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-bold transition disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-coral text-white shadow-[0_7px_15px_#ed7b6925] hover:bg-coral-dark',
        ghost: 'border border-line bg-white text-[#55514b] hover:bg-cream',
        onDark: 'border border-white/20 bg-transparent text-white hover:bg-white/10',
        text: 'gap-0.5 text-muted hover:text-ink',
      },
      size: {
        md: 'px-[18px] py-3 text-[13px]',
        sm: 'px-[15px] py-2.5 text-[13px]',
        xs: 'text-[11px]',
      },
      full: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
