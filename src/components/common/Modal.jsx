import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/helpers';
import './Modal.css';

function Modal({ 
  isOpen, 
  onClose, 
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className = ''
}) {
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className="modal-overlay animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className={cn('modal-container', `modal-${size}`, 'animate-scale-in', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 id="modal-title" className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button 
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

function ModalFooter({ children, className = '' }) {
  return (
    <div className={cn('modal-footer', className)}>
      {children}
    </div>
  );
}

Modal.Footer = ModalFooter;

export default Modal;
