import { forwardRef, useId } from 'react';
import { cn } from '../../utils/helpers';
import './Textarea.css';

const Textarea = forwardRef(({
  label,
  error,
  hint,
  className = '',
  required = false,
  rows = 4,
  id: idProp,
  ...props
}, ref) => {
  const autoId = useId();
  const taId = idProp || `textarea-${autoId}`;
  const errorId = `${taId}-error`;
  const hintId = `${taId}-hint`;
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={cn('textarea-group', error && 'has-error', className)}>
      {label && (
        <label className="textarea-label" htmlFor={taId}>
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={taId}
        className="textarea-field"
        rows={rows}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {error && <span id={errorId} className="textarea-error" role="alert">{error}</span>}
      {hint && !error && <span id={hintId} className="textarea-hint">{hint}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
