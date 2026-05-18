import { ChevronDown } from 'lucide-react';
import { forwardRef, useId } from 'react';
import { cn } from '../../utils/helpers';
import './Select.css';

const Select = forwardRef(({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Select an option',
  className = '',
  required = false,
  id: idProp,
  ...props
}, ref) => {
  const autoId = useId();
  const selectId = idProp || `select-${autoId}`;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={cn('select-group', error && 'has-error', className)}>
      {label && (
        <label className="select-label" htmlFor={selectId}>
          {label}
          {required && <span className="required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          ref={ref}
          id={selectId}
          className="select-field"
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="select-chevron" aria-hidden="true" />
      </div>
      {error && <span id={errorId} className="select-error" role="alert">{error}</span>}
      {hint && !error && <span id={hintId} className="select-hint">{hint}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
