import { cn } from '../../utils/helpers';
import './Card.css';

function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  padding = 'md',
  onClick,
  ...props 
}) {
  const cardClass = cn(
    'card-component',
    `card-${variant}`,
    `card-padding-${padding}`,
    hover && 'card-hover',
    onClick && 'card-clickable',
    className
  );

  return (
    <div 
      className={cardClass} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('card-header', className)}>
      {children}
    </div>
  );
}

function CardBody({ children, className = '' }) {
  return (
    <div className={cn('card-body', className)}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('card-footer', className)}>
      {children}
    </div>
  );
}

function CardImage({ src, alt, className = '' }) {
  return (
    <div className={cn('card-image', className)}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
