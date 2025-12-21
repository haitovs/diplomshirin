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

function SettingsEditor() {
  const { portfolio, updateSettings } = usePortfolio();
  const { settings } = portfolio;

  const handleTemplateChange = (templateId) => {
    updateSettings({ template: templateId });
  };

  const handleColorChange = (color) => {
    updateSettings({ primaryColor: color });
  };

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
              className={`template-option ${settings.template === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateChange(template.id)}
            >
              <div 
                className="template-preview"
                style={{ 
                  background: settings.template === template.id 
                    ? `linear-gradient(135deg, ${settings.primaryColor}20, ${settings.primaryColor}10)`
                    : undefined
                }}
              />
              <span className="template-name">{template.name}</span>
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
          {COLORS.map((color) => (
            <button
              key={color.value}
              className={`color-option ${settings.primaryColor === color.value ? 'selected' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
            />
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
