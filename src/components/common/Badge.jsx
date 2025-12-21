import { cn } from '../../utils/helpers';
import './Badge.css';

function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  removable = false,
  onRemove,
  ...props 
}) {
  return (
    <span 
      className={cn('badge', `badge-${variant}`, `badge-${size}`, className)}
      {...props}
    >
      {children}
      {removable && (
        <button 
          className="badge-remove"
          onClick={onRemove}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}

export default Badge;
