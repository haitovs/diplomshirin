import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';
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
  ...props 
}, ref) => {
  return (
    <div className={cn('select-group', error && 'has-error', className)}>
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          ref={ref}
          className="select-field"
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="select-chevron" />
      </div>
      {error && <span className="select-error">{error}</span>}
      {hint && !error && <span className="select-hint">{hint}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
