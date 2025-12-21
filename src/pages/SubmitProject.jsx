import { motion } from 'framer-motion';
import { ArrowLeft, Check, Rocket } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import TagInput from '../components/common/TagInput';
import Textarea from '../components/common/Textarea';
import { useData } from '../context/DataContext';
import { generateId, generateSlug } from '../utils/helpers';
import './SubmitProject.css';

const TECH_SUGGESTIONS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 
  'Python', 'Django', 'Flask', 'FastAPI', 'TensorFlow', 'PyTorch',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Redis',
  'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API'
];

function SubmitProject() {
  const navigate = useNavigate();
  const { categories, students, addProject, addStudent } = useData();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isNewStudent, setIsNewStudent] = useState(false);
  
  const [formData, setFormData] = useState({
    // Project Info
    title: '',
    description: '',
    fullDescription: '',
    categoryId: '',
    year: new Date().getFullYear(),
    technologies: [],
    screenshots: [''],
    demoUrl: '',
    githubUrl: '',
    // Student Info (for new students)
    studentId: '',
    studentName: '',
    studentEmail: '',
    studentDepartment: '',
    studentSkills: []
  });

  const [errors, setErrors] = useState({});

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

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (formData.technologies.length === 0) newErrors.technologies = 'At least one technology is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (isNewStudent) {
      if (!formData.studentName.trim()) newErrors.studentName = 'Name is required';
      if (!formData.studentEmail.trim()) newErrors.studentEmail = 'Email is required';
      if (!formData.studentDepartment) newErrors.studentDepartment = 'Department is required';
    } else {
      if (!formData.studentId) newErrors.studentId = 'Please select a student or create new';
    }
    
    if (!formData.screenshots[0]) newErrors.screenshots = 'At least one screenshot is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    let studentId = formData.studentId;

    // Create new student if needed
    if (isNewStudent) {
      const newStudent = addStudent({
        name: formData.studentName,
        email: formData.studentEmail,
        department: formData.studentDepartment,
        skills: formData.studentSkills,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.studentName.replace(/\s/g, '')}`,
        graduationYear: formData.year,
        featured: false
      });
      studentId = newStudent.id;
    }

    // Create project
    addProject({
      id: generateId('proj'),
      title: formData.title,
      slug: generateSlug(formData.title),
      description: formData.description,
      fullDescription: formData.fullDescription || formData.description,
      categoryId: formData.categoryId,
      studentId: studentId,
      year: formData.year,
      technologies: formData.technologies,
      screenshots: formData.screenshots.filter(s => s.trim()),
      demoUrl: formData.demoUrl,
      githubUrl: formData.githubUrl,
      documentationUrl: '',
      featured: false,
      createdAt: new Date().toISOString(),
      rating: (4 + Math.random()).toFixed(1),
      views: Math.floor(Math.random() * 100) + 10
    });

    setSubmitted(true);
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
  const studentOptions = students.map(s => ({ value: s.id, label: `${s.name} (${s.department})` }));
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: String(year) };
  });

  const DEPARTMENTS = [
    'Computer Science', 'Software Engineering', 'Information Technology',
    'Data Science', 'Cybersecurity', 'Computer Engineering', 'Artificial Intelligence'
  ];
  const departmentOptions = DEPARTMENTS.map(d => ({ value: d, label: d }));

  if (submitted) {
    return (
      <div className="submit-project-page">
        <motion.div 
          className="success-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-icon">
            <Check size={48} />
          </div>
          <h1>Project Submitted!</h1>
          <p>Your project has been added to the portfolio showcase.</p>
          <div className="success-actions">
            <Link to="/projects">
              <Button variant="primary">View All Projects</Button>
            </Link>
            <Button variant="outline" onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                title: '', description: '', fullDescription: '', categoryId: '',
                year: new Date().getFullYear(), technologies: [], screenshots: [''],
                demoUrl: '', githubUrl: '', studentId: '', studentName: '',
                studentEmail: '', studentDepartment: '', studentSkills: []
              });
            }}>
              Submit Another
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="submit-project-page">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <motion.div 
          className="submit-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="submit-header">
            <div className="submit-icon">
              <Rocket size={28} />
            </div>
            <h1>Submit Your Project</h1>
            <p>Share your diploma project with the community</p>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Project Details</span>
            </div>
            <div className="step-line" />
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Author & Media</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div 
                className="form-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Input
                  label="Project Title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="My Amazing Project"
                  error={errors.title}
                  required
                />

                <div className="form-row">
                  <Select
                    label="Category"
                    value={formData.categoryId}
                    onChange={(e) => handleChange('categoryId', e.target.value)}
                    options={categoryOptions}
                    error={errors.categoryId}
                    required
                  />
                  <Select
                    label="Year"
                    value={formData.year}
                    onChange={(e) => handleChange('year', parseInt(e.target.value))}
                    options={yearOptions}
                  />
                </div>

                <Textarea
                  label="Short Description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of your project (shown in cards)"
                  rows={2}
                  error={errors.description}
                  required
                />

                <Textarea
                  label="Full Description"
                  value={formData.fullDescription}
                  onChange={(e) => handleChange('fullDescription', e.target.value)}
                  placeholder="Detailed description of your project, features, and implementation..."
                  rows={5}
                />

                <TagInput
                  label="Technologies Used"
                  value={formData.technologies}
                  onChange={(tags) => handleChange('technologies', tags)}
                  placeholder="Add technologies..."
                  suggestions={TECH_SUGGESTIONS}
                  error={errors.technologies}
                  hint="Press Enter to add"
                  maxTags={10}
                  required
                />

                <div className="form-actions">
                  <Button type="button" variant="primary" onClick={nextStep}>
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                className="form-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* Student Selection */}
                <div className="student-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${!isNewStudent ? 'active' : ''}`}
                    onClick={() => setIsNewStudent(false)}
                  >
                    Existing Student
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${isNewStudent ? 'active' : ''}`}
                    onClick={() => setIsNewStudent(true)}
                  >
                    New Student
                  </button>
                </div>

                {!isNewStudent ? (
                  <Select
                    label="Select Student"
                    value={formData.studentId}
                    onChange={(e) => handleChange('studentId', e.target.value)}
                    options={studentOptions}
                    error={errors.studentId}
                    required
                  />
                ) : (
                  <div className="new-student-fields">
                    <div className="form-row">
                      <Input
                        label="Your Name"
                        value={formData.studentName}
                        onChange={(e) => handleChange('studentName', e.target.value)}
                        placeholder="Full name"
                        error={errors.studentName}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={formData.studentEmail}
                        onChange={(e) => handleChange('studentEmail', e.target.value)}
                        placeholder="your@email.edu"
                        error={errors.studentEmail}
                        required
                      />
                    </div>
                    <Select
                      label="Department"
                      value={formData.studentDepartment}
                      onChange={(e) => handleChange('studentDepartment', e.target.value)}
                      options={departmentOptions}
                      error={errors.studentDepartment}
                      required
                    />
                    <TagInput
                      label="Your Skills"
                      value={formData.studentSkills}
                      onChange={(tags) => handleChange('studentSkills', tags)}
                      placeholder="Add your skills..."
                      suggestions={TECH_SUGGESTIONS}
                      maxTags={10}
                    />
                  </div>
                )}

                {/* Screenshots */}
                <div className="screenshots-section">
                  <label className="section-label">
                    Screenshot URLs <span className="required">*</span>
                  </label>
                  {formData.screenshots.map((url, index) => (
                    <Input
                      key={index}
                      value={url}
                      onChange={(e) => handleScreenshotChange(index, e.target.value)}
                      placeholder="https://example.com/screenshot.png"
                    />
                  ))}
                  {errors.screenshots && <span className="error-text">{errors.screenshots}</span>}
                  {formData.screenshots.length < 5 && (
                    <Button type="button" variant="outline" size="sm" onClick={addScreenshot}>
                      + Add Another Screenshot
                    </Button>
                  )}
                </div>

                {/* Links */}
                <div className="form-row">
                  <Input
                    label="Demo URL"
                    value={formData.demoUrl}
                    onChange={(e) => handleChange('demoUrl', e.target.value)}
                    placeholder="https://your-demo.com"
                  />
                  <Input
                    label="GitHub URL"
                    value={formData.githubUrl}
                    onChange={(e) => handleChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>

                <div className="form-actions">
                  <Button type="button" variant="secondary" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" icon={Rocket}>
                    Submit Project
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default SubmitProject;
