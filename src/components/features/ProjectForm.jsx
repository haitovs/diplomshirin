import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { generateId, generateSlug } from '../../utils/helpers';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import TagInput from '../common/TagInput';
import Textarea from '../common/Textarea';
import './ProjectForm.css';

const TECH_SUGGESTIONS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 
  'Python', 'Django', 'Flask', 'FastAPI', 'TensorFlow', 'PyTorch',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Redis',
  'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API'
];

function ProjectForm({ isOpen, onClose, project = null }) {
  const { categories, students, addProject, updateProject } = useData();
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    categoryId: '',
    studentId: '',
    year: new Date().getFullYear(),
    technologies: [],
    screenshots: [''],
    demoUrl: '',
    githubUrl: '',
    documentationUrl: '',
    featured: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        fullDescription: project.fullDescription || '',
        categoryId: project.categoryId || '',
        studentId: project.studentId || '',
        year: project.year || new Date().getFullYear(),
        technologies: project.technologies || [],
        screenshots: project.screenshots?.length ? project.screenshots : [''],
        demoUrl: project.demoUrl || '',
        githubUrl: project.githubUrl || '',
        documentationUrl: project.documentationUrl || '',
        featured: project.featured || false
      });
    } else {
      resetForm();
    }
  }, [project, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      categoryId: '',
      studentId: '',
      year: new Date().getFullYear(),
      technologies: [],
      screenshots: [''],
      demoUrl: '',
      githubUrl: '',
      documentationUrl: '',
      featured: false
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleScreenshotChange = (index, value) => {
    const newScreenshots = [...formData.screenshots];
    newScreenshots[index] = value;
    setFormData(prev => ({ ...prev, screenshots: newScreenshots }));
  };

  const addScreenshot = () => {
    if (formData.screenshots.length < 5) {
      setFormData(prev => ({ 
        ...prev, 
        screenshots: [...prev.screenshots, ''] 
      }));
    }
  };

  const removeScreenshot = (index) => {
    if (formData.screenshots.length > 1) {
      setFormData(prev => ({
        ...prev,
        screenshots: prev.screenshots.filter((_, i) => i !== index)
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.studentId) newErrors.studentId = 'Student is required';
    if (formData.technologies.length === 0) newErrors.technologies = 'At least one technology is required';
    if (!formData.screenshots[0]) newErrors.screenshots = 'At least one screenshot URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const projectData = {
      ...formData,
      slug: generateSlug(formData.title),
      screenshots: formData.screenshots.filter(s => s.trim()),
      createdAt: project?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: project?.rating || (4 + Math.random()).toFixed(1),
      views: project?.views || Math.floor(Math.random() * 500) + 100
    };

    if (isEditing) {
      updateProject(project.id, projectData);
    } else {
      addProject({
        ...projectData,
        id: generateId('proj')
      });
    }

    onClose();
    resetForm();
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
  const studentOptions = students.map(s => ({ value: s.id, label: s.name }));
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: String(year) };
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Add New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-grid">
          <Input
            label="Project Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter project title"
            error={errors.title}
            required
          />
          
          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            options={categoryOptions}
            error={errors.categoryId}
            required
          />
        </div>

        <Textarea
          label="Short Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description (shown in project cards)"
          rows={2}
          error={errors.description}
          required
        />

        <Textarea
          label="Full Description"
          value={formData.fullDescription}
          onChange={(e) => handleChange('fullDescription', e.target.value)}
          placeholder="Detailed project description (shown on detail page)"
          rows={4}
          hint="Separate paragraphs with line breaks"
        />

        <div className="form-grid">
          <Select
            label="Student/Author"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            options={studentOptions}
            error={errors.studentId}
            required
          />

          <Select
            label="Year"
            value={formData.year}
            onChange={(e) => handleChange('year', parseInt(e.target.value))}
            options={yearOptions}
          />
        </div>

        <TagInput
          label="Technologies"
          value={formData.technologies}
          onChange={(tags) => handleChange('technologies', tags)}
          placeholder="Add technologies..."
          suggestions={TECH_SUGGESTIONS}
          error={errors.technologies}
          hint="Press Enter to add"
          maxTags={10}
          required
        />

        <div className="screenshots-section">
          <label className="section-label">
            Screenshot URLs <span className="required">*</span>
          </label>
          {formData.screenshots.map((url, index) => (
            <div key={index} className="screenshot-row">
              <Input
                value={url}
                onChange={(e) => handleScreenshotChange(index, e.target.value)}
                placeholder="https://example.com/screenshot.png"
              />
              {formData.screenshots.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeScreenshot(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          {errors.screenshots && <span className="error-text">{errors.screenshots}</span>}
          {formData.screenshots.length < 5 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addScreenshot}
            >
              + Add Screenshot
            </Button>
          )}
        </div>

        <div className="form-grid form-grid-3">
          <Input
            label="Demo URL"
            value={formData.demoUrl}
            onChange={(e) => handleChange('demoUrl', e.target.value)}
            placeholder="https://demo.example.com"
          />
          <Input
            label="GitHub URL"
            value={formData.githubUrl}
            onChange={(e) => handleChange('githubUrl', e.target.value)}
            placeholder="https://github.com/..."
          />
          <Input
            label="Docs URL"
            value={formData.documentationUrl}
            onChange={(e) => handleChange('documentationUrl', e.target.value)}
            placeholder="https://docs.example.com"
          />
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => handleChange('featured', e.checked)}
          />
          <span>Feature this project on homepage</span>
        </label>

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default ProjectForm;
