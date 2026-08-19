import { cva } from 'class-variance-authority';

export const statIconStyles = cva('grid place-items-center rounded-[13px]', {
  variants: {
    tone: {
      coral: 'bg-coral-soft text-[#db6c5b]',
      mint: 'bg-mint-soft text-[#658672]',
      blue: 'bg-blue-soft text-[#66809f]',
    },
    size: {
      md: 'size-11',
      sm: 'size-[34px]',
    },
  },
  defaultVariants: {
    tone: 'coral',
    size: 'md',
  },
});
