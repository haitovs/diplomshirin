import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';
import './Textarea.css';

const Textarea = forwardRef(({ 
  label,
  error,
  hint,
  className = '',
  required = false,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className={cn('textarea-group', error && 'has-error', className)}>
      {label && (
        <label className="textarea-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className="textarea-field"
        rows={rows}
        {...props}
      />
      {error && <span className="textarea-error">{error}</span>}
      {hint && !error && <span className="textarea-hint">{hint}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
