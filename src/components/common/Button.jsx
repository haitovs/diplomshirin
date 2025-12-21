import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';
import './Button.css';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  ...props 
}, ref) => {
  const buttonClass = cn(
    'button',
    `button-${variant}`,
    `button-${size}`,
    loading && 'button-loading',
    className
  );

  return (
    <button 
      ref={ref}
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="button-spinner" />
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
