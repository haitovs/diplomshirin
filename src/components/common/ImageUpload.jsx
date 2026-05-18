import { Image as ImageIcon, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '../../utils/helpers';
import './ImageUpload.css';

function ImageUpload({ 
  label,
  value,
  onChange,
  className = '',
  required = false,
  hint = 'PNG, JPG up to 5MB'
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError('');

    // Convert to base64 data URL for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn('image-upload-group', className)}>
      {label && (
        <label className="image-upload-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      {value ? (
        <div className="image-preview">
          <img src={value} alt="Preview" />
          <button
            type="button"
            className="remove-btn"
            onClick={handleRemove}
            aria-label="Remove image"
            title="Remove image"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          className={cn('upload-zone', dragActive && 'drag-active', error && 'has-error')}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={label ? `${label} upload area` : 'Image upload area'}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="file-input"
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="upload-content">
            <div className="upload-icon" aria-hidden="true">
              <ImageIcon size={24} />
            </div>
            <p className="upload-text">
              <span className="upload-link">Click to upload</span> or drag and drop
            </p>
            <p className="upload-hint">{hint}</p>
          </div>
        </div>
      )}

      {error && <span className="upload-error" role="alert">{error}</span>}
    </div>
  );
}

export default ImageUpload;
