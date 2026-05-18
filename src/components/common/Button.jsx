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
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const buttonClass = cn(
    'button',
    `button-${variant}`,
    `button-${size}`,
    loading && 'button-loading',
    className
  );

  // Icon-only button: require an aria-label fallback.
  const isIconOnly = Icon && !children;
  const resolvedAriaLabel = ariaLabel || (isIconOnly && Icon?.displayName) || undefined;

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={resolvedAriaLabel}
      {...props}
    >
      {loading && (
        <span className="button-spinner" role="status" aria-label="Loading" />
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} aria-hidden="true" />
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} aria-hidden="true" />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
