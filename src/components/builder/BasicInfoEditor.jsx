import { usePortfolio } from '../../context/PortfolioContext';
import ImageUpload from '../common/ImageUpload';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import './EditorStyles.css';

function BasicInfoEditor() {
  const { portfolio, updateBasics } = usePortfolio();
  const { basics } = portfolio;

  const handleChange = (field, value) => {
    updateBasics({ [field]: value });
  };

  return (
    <div className="editor-form">
      <div className="form-row">
        <Input
          label="Full Name"
          value={basics.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Doe"
          required
        />
        <Input
          label="Professional Title"
          value={basics.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Full-Stack Developer"
        />
      </div>

      <div className="form-row">
        <Input
          label="Email Address"
          type="email"
          value={basics.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
        />
        <Input
          label="Phone Number"
          value={basics.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <Input
        label="Location"
        value={basics.location}
        onChange={(e) => handleChange('location', e.target.value)}
        placeholder="San Francisco, CA"
      />

      <ImageUpload
        label="Profile Photo"
        value={basics.avatar}
        onChange={(value) => handleChange('avatar', value)}
        hint="Upload your profile photo (PNG, JPG up to 5MB)"
      />

      <Textarea
        label="Professional Summary"
        value={basics.summary}
        onChange={(e) => handleChange('summary', e.target.value)}
        placeholder="Write a brief professional summary about yourself, your experience, and what you're passionate about..."
        rows={5}
      />
    </div>
  );
}

export default BasicInfoEditor;
