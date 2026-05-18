import { Check } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import './EditorStyles.css';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary' },
  { id: 'classic', name: 'Classic', description: 'Traditional and professional' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' }
];

const COLORS = [
  { value: '#4F46E5', name: 'Indigo' },
  { value: '#0EA5E9', name: 'Sky Blue' },
  { value: '#10B981', name: 'Emerald' },
  { value: '#F59E0B', name: 'Amber' },
  { value: '#EF4444', name: 'Red' },
  { value: '#8B5CF6', name: 'Purple' },
  { value: '#EC4899', name: 'Pink' },
  { value: '#14B8A6', name: 'Teal' },
  { value: '#1F2937', name: 'Slate' }
];

const FONT_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
];

const DENSITIES = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' }
];

// Mock template preview — pure CSS skeleton lines mimicking layout
function TemplateMock({ variant, accent }) {
  if (variant === 'modern') {
    return (
      <div className="tpl-mock tpl-mock-modern" style={{ '--mock-accent': accent }}>
        <div className="tm-header" />
        <div className="tm-body">
          <div className="tm-line tm-line-w70" />
          <div className="tm-line tm-line-w90" />
          <div className="tm-line tm-line-w50" />
        </div>
      </div>
    );
  }
  if (variant === 'classic') {
    return (
      <div className="tpl-mock tpl-mock-classic" style={{ '--mock-accent': accent }}>
        <div className="tm-row">
          <div className="tm-sidebar">
            <div className="tm-avatar" />
            <div className="tm-line tm-line-w80" />
            <div className="tm-line tm-line-w60" />
          </div>
          <div className="tm-content">
            <div className="tm-line tm-line-w90" />
            <div className="tm-line tm-line-w70" />
            <div className="tm-line tm-line-w80" />
          </div>
        </div>
      </div>
    );
  }
  // minimal
  return (
    <div className="tpl-mock tpl-mock-minimal" style={{ '--mock-accent': accent }}>
      <div className="tm-title" />
      <div className="tm-rule" />
      <div className="tm-body">
        <div className="tm-line tm-line-w60" />
        <div className="tm-line tm-line-w80" />
      </div>
    </div>
  );
}

function SettingsEditor() {
  const { portfolio, updateSettings } = usePortfolio();
  const { settings } = portfolio;

  const handleTemplateChange = (templateId) => {
    updateSettings({ template: templateId });
  };

  const handleColorChange = (color) => {
    updateSettings({ primaryColor: color });
  };

  const accent = settings.primaryColor || '#4F46E5';
  const fontSize = settings.fontSize || 'medium';
  const density = settings.density || 'comfortable';

  return (
    <div className="editor-form">
      {/* Template Selection */}
      <div>
        <label className="input-label" style={{ marginBottom: '12px', display: 'block' }}>
          Portfolio Template
        </label>
        <div className="template-options">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              className={`template-option ${settings.template === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateChange(template.id)}
            >
              <div className="template-preview">
                <TemplateMock variant={template.id} accent={accent} />
              </div>
              <span className="template-name">{template.name}</span>
              <span className="template-desc">{template.description}</span>
              {settings.template === template.id && (
                <span className="template-check">
                  <Check size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="input-label" style={{ marginBottom: '12px', display: 'block' }}>
          Accent Color
        </label>
        <div className="color-options">
          {COLORS.map((color) => {
            const selected = settings.primaryColor === color.value;
            return (
              <button
                key={color.value}
                type="button"
                className={`color-swatch ${selected ? 'selected' : ''}`}
                onClick={() => handleColorChange(color.value)}
                title={color.name}
                aria-label={color.name}
              >
                <span
                  className="color-swatch-circle"
                  style={{ backgroundColor: color.value }}
                >
                  {selected && <Check size={14} strokeWidth={3} />}
                </span>
                <span className="color-swatch-label">{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="input-label" style={{ marginBottom: '12px', display: 'block' }}>
          Font Size
        </label>
        <div className="segmented-control">
          {FONT_SIZES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`segmented-btn ${fontSize === opt.value ? 'selected' : ''}`}
              onClick={() => updateSettings({ fontSize: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing Density */}
      <div>
        <label className="input-label" style={{ marginBottom: '12px', display: 'block' }}>
          Spacing Density
        </label>
        <div className="segmented-control">
          {DENSITIES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`segmented-btn ${density === opt.value ? 'selected' : ''}`}
              onClick={() => updateSettings({ density: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Show Photo Toggle */}
      <div>
        <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="checkbox"
            checked={settings.showPhoto}
            onChange={(e) => updateSettings({ showPhoto: e.target.checked })}
          />
          <div>
            <span style={{ fontWeight: 500 }}>Show Profile Photo</span>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', margin: 0 }}>
              Display your avatar in the portfolio
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

export default SettingsEditor;
