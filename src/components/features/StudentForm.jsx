import { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/helpers';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import TagInput from '../common/TagInput';
import Textarea from '../common/Textarea';
import './StudentForm.css';

const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
  'React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Flask',
  'Machine Learning', 'Data Science', 'AI', 'Deep Learning',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Product Design',
  'iOS Development', 'Android Development', 'Flutter', 'React Native',
  'DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'GraphQL'
];

const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Data Science',
  'Cybersecurity',
  'Computer Engineering',
  'Artificial Intelligence'
];

function StudentForm({ isOpen, onClose, student = null }) {
  const { addStudent, updateStudent } = useData();
  const isEditing = !!student;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    department: '',
    graduationYear: new Date().getFullYear(),
    gpa: '',
    skills: [],
    github: '',
    linkedin: '',
    portfolio: '',
    featured: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        avatar: student.avatar || '',
        bio: student.bio || '',
        department: student.department || '',
        graduationYear: student.graduationYear || new Date().getFullYear(),
        gpa: student.gpa || '',
        skills: student.skills || [],
        github: student.github || '',
        linkedin: student.linkedin || '',
        portfolio: student.portfolio || '',
        featured: student.featured || false
      });
    } else {
      resetForm();
    }
  }, [student, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      avatar: '',
      bio: '',
      department: '',
      graduationYear: new Date().getFullYear(),
      gpa: '',
      skills: [],
      github: '',
      linkedin: '',
      portfolio: '',
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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.department) newErrors.department = 'Department is required';
    if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    const studentData = {
      ...formData,
      avatar: formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.replace(/\s/g, '')}`,
      gpa: formData.gpa ? parseFloat(formData.gpa) : null
    };

    if (isEditing) {
      updateStudent(student.id, studentData);
    } else {
      addStudent({
        ...studentData,
        id: generateId('s')
      });
    }

    onClose();
    resetForm();
  };

  const departmentOptions = DEPARTMENTS.map(d => ({ value: d, label: d }));
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + 2 - i;
    return { value: year, label: String(year) };
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Student' : 'Add New Student'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-grid">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter full name"
            error={errors.name}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="student@university.edu"
            error={errors.email}
            required
          />
        </div>

        <Input
          label="Avatar URL"
          value={formData.avatar}
          onChange={(e) => handleChange('avatar', e.target.value)}
          placeholder="https://example.com/avatar.jpg (optional - auto-generated if empty)"
        />

        <Textarea
          label="Bio"
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          placeholder="Brief biography of the student..."
          rows={3}
        />

        <div className="form-grid form-grid-3">
          <Select
            label="Department"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            options={departmentOptions}
            error={errors.department}
            required
          />

          <Select
            label="Graduation Year"
            value={formData.graduationYear}
            onChange={(e) => handleChange('graduationYear', parseInt(e.target.value))}
            options={yearOptions}
          />

          <Input
            label="GPA"
            type="number"
            step="0.01"
            min="0"
            max="4"
            value={formData.gpa}
            onChange={(e) => handleChange('gpa', e.target.value)}
            placeholder="3.85"
          />
        </div>

        <TagInput
          label="Skills"
          value={formData.skills}
          onChange={(tags) => handleChange('skills', tags)}
          placeholder="Add skills..."
          suggestions={SKILL_SUGGESTIONS}
          error={errors.skills}
          hint="Press Enter to add"
          maxTags={15}
          required
        />

        <div className="form-grid form-grid-3">
          <Input
            label="GitHub URL"
            value={formData.github}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="https://github.com/username"
          />
          <Input
            label="LinkedIn URL"
            value={formData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
          <Input
            label="Portfolio URL"
            value={formData.portfolio}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="https://portfolio.com"
          />
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => handleChange('featured', e.target.checked)}
          />
          <span>Feature this student on homepage</span>
        </label>

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Changes' : 'Add Student'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default StudentForm;
