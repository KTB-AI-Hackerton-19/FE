import type { VariantProps } from 'class-variance-authority';

import { buttonStyles } from './button.style';

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonStyles>;

function Button({ variant, size, full, className, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonStyles({ variant, size, full, className })} {...props} />
  );
}

export default Button;
