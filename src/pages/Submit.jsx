import { motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  GraduationCap,
  Link as LinkIcon,
  Loader2,
  Lock,
  Send,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { diplomaWorksAPI, searchAPI } from '../services/api';
import './Submit.css';

const STEP_CONFIG = [
  { num: 1, label: 'Basic Info', icon: FileText },
  { num: 2, label: 'Academic Details', icon: BookOpen },
  { num: 3, label: 'Media & Links', icon: LinkIcon },
  { num: 4, label: 'Review', icon: CheckCircle },
];

const FALLBACK_CATEGORIES = [
  'Web Development', 'Mobile Development', 'Machine Learning',
  'IoT', 'Game Development', 'Cybersecurity', 'Data Analytics',
  'Artificial Intelligence', 'Cloud Computing', 'Other'
];

function Submit() {
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, user } = useAuth();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [similarityCheck, setSimilarityCheck] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    year: new Date().getFullYear(),
    // Academic
    supervisor: '',
    abstract: '',
    full_description: '',
    methodology: '',
    key_findings: '',
    defense_date: '',
    // Technical
    technologies: '',
    screenshots: '',
    demo_url: '',
    github_url: '',
    documentation_url: '',
  });

  useEffect(() => {
    searchAPI.getCategories()
      .then(cats => setCategories(cats))
      .catch(() => {});
  }, []);

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  }

  async function checkSimilarity() {
    if (!form.title.trim()) return;
    setChecking(true);
    try {
      const result = await searchAPI.checkIdea(form.title, form.description);
      setSimilarityCheck(result);
    } catch {
      // silent
    } finally {
      setChecking(false);
    }
  }

  function validateStep(stepNum) {
    const newErrors = {};
    if (stepNum === 1) {
      if (!form.title.trim()) newErrors.title = 'Title is required';
      if (!form.description.trim()) newErrors.description = 'Description is required';
      if (!form.category) newErrors.category = 'Category is required';
    }
    if (stepNum === 2) {
      if (!form.supervisor.trim()) newErrors.supervisor = 'Supervisor name is required';
      if (!form.abstract.trim()) newErrors.abstract = 'Abstract is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (validateStep(step)) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goBack() {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...form,
        student_id: user.id,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        screenshots: form.screenshots.split(',').map(s => s.trim()).filter(Boolean),
      };
      await diplomaWorksAPI.create(data);
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  // Auth gate
  if (!isAuthenticated || !isStudent) {
    return (
      <div className="submit-page">
        <motion.div
          className="submit-auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="auth-icon-wrap">
            <Lock size={32} />
          </div>
          <h1>Student Login Required</h1>
          <p>You must be signed in with your student account to submit a diploma work.</p>
          <Link to="/student-login">
            <Button variant="primary" size="lg" icon={GraduationCap}>
              Student Login
            </Button>
          </Link>
          <Link to="/" className="auth-home-link">Back to Home</Link>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="submit-page">
        <motion.div
          className="submit-success-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-icon-wrap">
            <Check size={48} />
          </div>
          <h1>Submission Received!</h1>
          <p>Your diploma work has been submitted and is awaiting administrator review. You will be notified once it is approved.</p>
          <div className="success-actions">
            <Link to="/archive">
              <Button variant="primary">Browse Archive</Button>
            </Link>
            <Button variant="outline" onClick={() => {
              setSubmitted(false);
              setStep(1);
              setForm({
                title: '', description: '', category: '', year: new Date().getFullYear(),
                supervisor: '', abstract: '', full_description: '', methodology: '',
                key_findings: '', defense_date: '', technologies: '', screenshots: '',
                demo_url: '', github_url: '', documentation_url: '',
              });
              setSimilarityCheck(null);
              setErrors({});
            }}>
              Submit Another
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const categoryList = categories.length > 0
    ? categories.map(c => c.category)
    : FALLBACK_CATEGORIES;

  return (
    <div className="submit-page">
      <div className="submit-container">
        <motion.div
          className="submit-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="submit-header">
            <div className="submit-header-icon">
              <GraduationCap size={28} />
            </div>
            <h1>Submit Diploma Work</h1>
            <p className="submit-user-info">
              <User size={14} />
              <span>Submitting as <strong>{user.name}</strong> ({user.email})</span>
            </p>
          </div>

          {/* Step Indicator */}
          <div className="step-indicator">
            {STEP_CONFIG.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = step >= s.num;
              const isCurrent = step === s.num;
              return (
                <div key={s.num} className="step-indicator-item">
                  {i > 0 && <div className={`step-line ${step > i ? 'active' : ''}`} />}
                  <div
                    className={`step-dot ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                    onClick={() => { if (s.num < step) setStep(s.num); }}
                  >
                    {step > s.num ? <Check size={14} /> : <StepIcon size={14} />}
                  </div>
                  <span className={`step-label ${isActive ? 'active' : ''}`}>{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Error banner */}
          {errors.submit && (
            <div className="submit-error-banner">
              <AlertCircle size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="section-heading"><FileText size={18} /> Basic Information</h2>

                <div className="field">
                  <label>Title <span className="req">*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => updateForm('title', e.target.value)}
                    onBlur={checkSimilarity}
                    placeholder="e.g. Smart Campus Navigation System Using IoT"
                    className={errors.title ? 'has-error' : ''}
                  />
                  {errors.title && <span className="field-error">{errors.title}</span>}
                </div>

                <div className="field">
                  <label>Short Description <span className="req">*</span></label>
                  <textarea
                    value={form.description}
                    onChange={e => updateForm('description', e.target.value)}
                    onBlur={checkSimilarity}
                    placeholder="A concise summary of what your diploma work is about (1-3 sentences)"
                    rows={3}
                    className={errors.description ? 'has-error' : ''}
                  />
                  <div className="field-footer">
                    {errors.description && <span className="field-error">{errors.description}</span>}
                    <span className="char-count">{form.description.length} / 500</span>
                  </div>
                </div>

                {/* Similarity alert */}
                {checking && (
                  <div className="similarity-alert checking">
                    <Loader2 size={16} className="spin" /> Checking for similar works...
                  </div>
                )}
                {similarityCheck && !checking && (
                  <div className={`similarity-alert ${similarityCheck.ideaExists ? 'danger' : similarityCheck.warning ? 'warning' : 'success'}`}>
                    <AlertCircle size={16} />
                    <div>
                      <strong>{similarityCheck.message}</strong>
                      {similarityCheck.matches?.length > 0 && (
                        <ul>
                          {similarityCheck.matches.slice(0, 3).map(m => (
                            <li key={m.id}>{m.title} — {m.similarity}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                <div className="field-row two-col">
                  <div className="field">
                    <label>Category <span className="req">*</span></label>
                    <select
                      value={form.category}
                      onChange={e => updateForm('category', e.target.value)}
                      className={errors.category ? 'has-error' : ''}
                    >
                      <option value="">Select category</option>
                      {categoryList.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && <span className="field-error">{errors.category}</span>}
                  </div>
                  <div className="field">
                    <label>Year <span className="req">*</span></label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={e => updateForm('year', e.target.value)}
                      min={2018} max={2030}
                    />
                  </div>
                </div>

                <div className="form-nav">
                  <div />
                  <Button type="button" variant="primary" icon={ChevronRight} iconPosition="right" onClick={goNext}>
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Academic Details */}
            {step === 2 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="section-heading"><BookOpen size={18} /> Academic Details</h2>

                <div className="field-row two-col">
                  <div className="field">
                    <label>Supervisor / Advisor <span className="req">*</span></label>
                    <input
                      type="text"
                      value={form.supervisor}
                      onChange={e => updateForm('supervisor', e.target.value)}
                      placeholder="Prof. Dr. Name Surname"
                      className={errors.supervisor ? 'has-error' : ''}
                    />
                    {errors.supervisor && <span className="field-error">{errors.supervisor}</span>}
                  </div>
                  <div className="field">
                    <label><Calendar size={13} /> Defense Date</label>
                    <input
                      type="date"
                      value={form.defense_date}
                      onChange={e => updateForm('defense_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Abstract <span className="req">*</span></label>
                  <textarea
                    value={form.abstract}
                    onChange={e => updateForm('abstract', e.target.value)}
                    placeholder="Provide a formal abstract summarizing the problem, approach, and results of your diploma work..."
                    rows={5}
                    className={errors.abstract ? 'has-error' : ''}
                  />
                  <div className="field-footer">
                    {errors.abstract && <span className="field-error">{errors.abstract}</span>}
                    <span className="char-count">{form.abstract.length} / 2000</span>
                  </div>
                </div>

                <div className="field">
                  <label>Full Description</label>
                  <textarea
                    value={form.full_description}
                    onChange={e => updateForm('full_description', e.target.value)}
                    placeholder="A detailed description of your project — features, architecture, implementation details..."
                    rows={5}
                  />
                  <div className="field-footer">
                    <span className="field-hint">Optional but recommended for a thorough review</span>
                    <span className="char-count">{form.full_description.length}</span>
                  </div>
                </div>

                <div className="field">
                  <label>Methodology</label>
                  <textarea
                    value={form.methodology}
                    onChange={e => updateForm('methodology', e.target.value)}
                    placeholder="Describe the research methodology, tools, frameworks, and approach used..."
                    rows={3}
                  />
                </div>

                <div className="field">
                  <label>Key Findings / Results</label>
                  <textarea
                    value={form.key_findings}
                    onChange={e => updateForm('key_findings', e.target.value)}
                    placeholder="Summarize the main results, metrics, and outcomes of your work..."
                    rows={3}
                  />
                </div>

                <div className="form-nav">
                  <Button type="button" variant="secondary" icon={ChevronLeft} onClick={goBack}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" icon={ChevronRight} iconPosition="right" onClick={goNext}>
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Media & Links */}
            {step === 3 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="section-heading"><Code size={18} /> Technical & Media</h2>

                <div className="field">
                  <label>Technologies Used</label>
                  <input
                    type="text"
                    value={form.technologies}
                    onChange={e => updateForm('technologies', e.target.value)}
                    placeholder="React, Node.js, Python, TensorFlow, MongoDB..."
                  />
                  <span className="field-hint">Separate multiple technologies with commas</span>
                </div>

                <div className="field">
                  <label>Screenshot URLs</label>
                  <input
                    type="text"
                    value={form.screenshots}
                    onChange={e => updateForm('screenshots', e.target.value)}
                    placeholder="https://example.com/image1.jpg, https://..."
                  />
                  <span className="field-hint">Separate multiple URLs with commas</span>
                </div>

                <div className="field-row two-col">
                  <div className="field">
                    <label><LinkIcon size={13} /> Demo URL</label>
                    <input
                      type="url"
                      value={form.demo_url}
                      onChange={e => updateForm('demo_url', e.target.value)}
                      placeholder="https://your-demo.com"
                    />
                  </div>
                  <div className="field">
                    <label><Code size={13} /> GitHub URL</label>
                    <input
                      type="url"
                      value={form.github_url}
                      onChange={e => updateForm('github_url', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className="field">
                  <label><FileText size={13} /> Documentation URL</label>
                  <input
                    type="url"
                    value={form.documentation_url}
                    onChange={e => updateForm('documentation_url', e.target.value)}
                    placeholder="https://docs.google.com/... or link to uploaded PDF"
                  />
                </div>

                <div className="form-nav">
                  <Button type="button" variant="secondary" icon={ChevronLeft} onClick={goBack}>
                    Back
                  </Button>
                  <Button type="button" variant="primary" icon={ChevronRight} iconPosition="right" onClick={() => { setStep(4); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    Review
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="section-heading"><CheckCircle size={18} /> Review & Submit</h2>

                <div className="review-grid">
                  <ReviewCard label="Student" value={`${user.name} (${user.email})`} />
                  <ReviewCard label="Title" value={form.title} />
                  <ReviewCard label="Category" value={`${form.category} (${form.year})`} />
                  <ReviewCard label="Supervisor" value={form.supervisor} />
                  {form.defense_date && <ReviewCard label="Defense Date" value={form.defense_date} />}
                  <ReviewCard label="Description" value={form.description} full />
                  {form.abstract && <ReviewCard label="Abstract" value={form.abstract} full />}
                  {form.methodology && <ReviewCard label="Methodology" value={form.methodology} full />}
                  {form.key_findings && <ReviewCard label="Key Findings" value={form.key_findings} full />}
                  {form.technologies && <ReviewCard label="Technologies" value={form.technologies} />}
                  {form.demo_url && <ReviewCard label="Demo URL" value={form.demo_url} />}
                  {form.github_url && <ReviewCard label="GitHub" value={form.github_url} />}
                  {form.documentation_url && <ReviewCard label="Documentation" value={form.documentation_url} />}
                </div>

                <div className="review-notice">
                  <AlertCircle size={16} />
                  <span>Your submission will enter a <strong>Pending</strong> state and must be approved by an administrator before appearing in the public archive.</span>
                </div>

                <div className="form-nav">
                  <Button type="button" variant="secondary" icon={ChevronLeft} onClick={goBack}>
                    Back
                  </Button>
                  <Button type="submit" variant="primary" icon={Send} iconPosition="right" loading={submitting}>
                    Submit for Review
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

function ReviewCard({ label, value, full }) {
  if (!value) return null;
  return (
    <div className={`review-card ${full ? 'full' : ''}`}>
      <span className="review-label">{label}</span>
      <span className="review-value">{value}</span>
    </div>
  );
}

export default Submit;
