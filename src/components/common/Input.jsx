import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';
import './Input.css';

const Input = forwardRef(({ 
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  required = false,
  ...props 
}, ref) => {
  return (
    <div className={cn('input-group', error && 'has-error', className)}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon">
            <Icon size={18} />
          </span>
        )}
        <input
          ref={ref}
          className={cn('input-field', Icon && 'has-icon')}
          {...props}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
      {hint && !error && <span className="input-hint">{hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
