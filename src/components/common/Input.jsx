import { forwardRef, useId } from 'react';
import { cn } from '../../utils/helpers';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  required = false,
  id: idProp,
  ...props
}, ref) => {
  const autoId = useId();
  const inputId = idProp || `input-${autoId}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={cn('input-group', error && 'has-error', className)}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('input-field', Icon && 'has-icon')}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          {...props}
        />
      </div>
      {error && <span id={errorId} className="input-error" role="alert">{error}</span>}
      {hint && !error && <span id={hintId} className="input-hint">{hint}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
