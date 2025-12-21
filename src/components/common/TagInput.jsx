import { Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '../../utils/helpers';
import './TagInput.css';

function TagInput({ 
  label,
  value = [],
  onChange,
  placeholder = 'Type and press Enter',
  error,
  hint,
  className = '',
  required = false,
  maxTags = 10,
  suggestions = []
}) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
      onChange([...value, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  );

  return (
    <div className={cn('tag-input-group', error && 'has-error', className)}>
      {label && (
        <label className="tag-input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div 
        className="tag-input-wrapper"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="tags-container">
          {value.map(tag => (
            <span key={tag} className="tag">
              {tag}
              <button 
                type="button"
                className="tag-remove"
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="tag-input-field"
            disabled={value.length >= maxTags}
          />
        </div>
        
        {inputValue && (
          <button 
            type="button"
            className="add-tag-btn"
            onClick={() => addTag(inputValue)}
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {filteredSuggestions.slice(0, 5).map(suggestion => (
            <button
              key={suggestion}
              type="button"
              className="suggestion-item"
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {error && <span className="tag-input-error">{error}</span>}
      {hint && !error && (
        <span className="tag-input-hint">
          {hint} ({value.length}/{maxTags})
        </span>
      )}
    </div>
  );
}

export default TagInput;
