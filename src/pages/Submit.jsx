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
  Image,
  Link as LinkIcon,
  Loader2,
  Lock,
  Send,
  Upload,
  User,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { diplomaWorksAPI, searchAPI, uploadAPI } from '../services/api';
import './Submit.css';

const STEP_CONFIG = [
  { num: 1, key: 'basicInfo', icon: FileText },
  { num: 2, key: 'academicDetails', icon: BookOpen },
  { num: 3, key: 'mediaLinks', icon: LinkIcon },
  { num: 4, key: 'review', icon: CheckCircle },
];

const FALLBACK_CATEGORIES = [
  'Web Development', 'Mobile Development', 'Machine Learning',
  'IoT', 'Game Development', 'Cybersecurity', 'Data Analytics',
  'Artificial Intelligence', 'Cloud Computing', 'Other'
];

function Submit() {
  const { t } = useTranslation();
  const { isAuthenticated, isStudent, user } = useAuth();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [similarityCheck, setSimilarityCheck] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [screenshotFiles, setScreenshotFiles] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState([]);
  const [docFile, setDocFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const screenshotInputRef = useRef(null);
  const docInputRef = useRef(null);

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
      if (!form.title.trim()) newErrors.title = t('submit.step1.titleRequired');
      if (!form.description.trim()) newErrors.description = t('submit.step1.descriptionRequired');
      if (!form.category) newErrors.category = t('submit.step1.categoryRequired');
    }
    if (stepNum === 2) {
      if (!form.supervisor.trim()) newErrors.supervisor = t('submit.step2.supervisorRequired');
      if (!form.abstract.trim()) newErrors.abstract = t('submit.step2.abstractRequired');
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

  function handleScreenshotFiles(e) {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    setScreenshotFiles(prev => [...prev, ...validFiles]);

    // Generate previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setScreenshotPreviews(prev => [...prev, { name: file.name, url: ev.target.result }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  function removeScreenshot(index) {
    setScreenshotFiles(prev => prev.filter((_, i) => i !== index));
    setScreenshotPreviews(prev => prev.filter((_, i) => i !== index));
  }

  function handleDocFile(e) {
    const file = e.target.files[0];
    if (file) setDocFile(file);
    e.target.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      let screenshotUrls = form.screenshots ? form.screenshots.split(',').map(s => s.trim()).filter(Boolean) : [];
      let docUrl = form.documentation_url || '';

      // Upload screenshot files if any
      if (screenshotFiles.length > 0) {
        setUploading(true);
        const uploadResult = await uploadAPI.screenshots(screenshotFiles);
        screenshotUrls = [...screenshotUrls, ...uploadResult.urls];
      }

      // Upload document file if any
      if (docFile) {
        setUploading(true);
        const uploadResult = await uploadAPI.document(docFile);
        docUrl = uploadResult.url;
      }
      setUploading(false);

      const data = {
        ...form,
        student_id: user.id,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        screenshots: screenshotUrls,
        documentation_url: docUrl,
      };
      await diplomaWorksAPI.create(data);
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
      setUploading(false);
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
          <h1>{t('submit.authRequired')}</h1>
          <p>{t('submit.authMessage')}</p>
          <Link to="/student-login">
            <Button variant="primary" size="lg" icon={GraduationCap}>
              {t('submit.authButton')}
            </Button>
          </Link>
          <Link to="/" className="auth-home-link">{t('submit.backHome')}</Link>
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
          <h1>{t('submit.step4.successTitle')}</h1>
          <p>{t('submit.step4.successMessage')}</p>
          <div className="success-actions">
            <Link to="/archive">
              <Button variant="primary">{t('submit.step4.browseArchive')}</Button>
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
              setScreenshotFiles([]);
              setScreenshotPreviews([]);
              setDocFile(null);
              setSimilarityCheck(null);
              setErrors({});
            }}>
              {t('submit.step4.submitAnother')}
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
            <h1>{t('submit.title')}</h1>
            <p className="submit-user-info">
              <User size={14} />
              <span>{t('submit.submittingAs', { name: user.name, email: user.email })}</span>
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
                  <span className={`step-label ${isActive ? 'active' : ''}`}>{t('submit.steps.' + s.key)}</span>
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
                <h2 className="section-heading"><FileText size={18} /> {t('submit.step1.heading')}</h2>

                <div className="field">
                  <label>{t('submit.step1.titleLabel')} <span className="req">*</span></label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => updateForm('title', e.target.value)}
                    onBlur={checkSimilarity}
                    placeholder={t('submit.step1.titlePlaceholder')}
                    className={errors.title ? 'has-error' : ''}
                  />
                  {errors.title && <span className="field-error">{errors.title}</span>}
                </div>

                <div className="field">
                  <label>{t('submit.step1.descriptionLabel')} <span className="req">*</span></label>
                  <textarea
                    value={form.description}
                    onChange={e => updateForm('description', e.target.value)}
                    onBlur={checkSimilarity}
                    placeholder={t('submit.step1.descriptionPlaceholder')}
                    rows={3}
                    className={errors.description ? 'has-error' : ''}
                  />
                  <div className="field-footer">
                    {errors.description && <span className="field-error">{errors.description}</span>}
                    <span className="char-count">{t('submit.charCount', { current: form.description.length, max: 500 })}</span>
                  </div>
                </div>

                {/* Similarity alert */}
                {checking && (
                  <div className="similarity-alert checking">
                    <Loader2 size={16} className="spin" /> {t('submit.step1.checking')}
                  </div>
                )}
                {similarityCheck && !checking && (
                  <div className={`similarity-alert ${similarityCheck.ideaExists ? 'danger' : similarityCheck.warning ? 'warning' : 'success'}`}>
                    <AlertCircle size={16} />
                    <div>
                      <strong>
                        {similarityCheck.ideaExists
                          ? t('submit.similarity.dangerTitle')
                          : similarityCheck.warning
                            ? t('submit.similarity.warningTitle')
                            : t('submit.similarity.unique')}
                      </strong>
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
                    <label>{t('submit.step1.categoryLabel')} <span className="req">*</span></label>
                    <select
                      value={form.category}
                      onChange={e => updateForm('category', e.target.value)}
                      className={errors.category ? 'has-error' : ''}
                    >
                      <option value="">{t('submit.step1.categoryPlaceholder')}</option>
                      {categoryList.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && <span className="field-error">{errors.category}</span>}
                  </div>
                  <div className="field">
                    <label>{t('submit.step1.yearLabel')} <span className="req">*</span></label>
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
                    {t('submit.nav.next')}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Academic Details */}
            {step === 2 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="section-heading"><BookOpen size={18} /> {t('submit.step2.heading')}</h2>

                <div className="field-row two-col">
                  <div className="field">
                    <label>{t('submit.step2.supervisorLabel')} <span className="req">*</span></label>
                    <input
                      type="text"
                      value={form.supervisor}
                      onChange={e => updateForm('supervisor', e.target.value)}
                      placeholder={t('submit.step2.supervisorPlaceholder')}
                      className={errors.supervisor ? 'has-error' : ''}
                    />
                    {errors.supervisor && <span className="field-error">{errors.supervisor}</span>}
                  </div>
                  <div className="field">
                    <label><Calendar size={13} /> {t('submit.step2.defenseDateLabel')}</label>
                    <input
                      type="date"
                      value={form.defense_date}
                      onChange={e => updateForm('defense_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>{t('submit.step2.abstractLabel')} <span className="req">*</span></label>
                  <textarea
                    value={form.abstract}
                    onChange={e => updateForm('abstract', e.target.value)}
                    placeholder={t('submit.step2.abstractPlaceholder')}
                    rows={5}
                    className={errors.abstract ? 'has-error' : ''}
                  />
                  <div className="field-footer">
                    {errors.abstract && <span className="field-error">{errors.abstract}</span>}
                    <span className="char-count">{t('submit.charCount', { current: form.abstract.length, max: 2000 })}</span>
                  </div>
                </div>

                <div className="field">
                  <label>{t('submit.step2.fullDescriptionLabel')}</label>
                  <textarea
                    value={form.full_description}
                    onChange={e => updateForm('full_description', e.target.value)}
                    placeholder={t('submit.step2.fullDescriptionPlaceholder')}
                    rows={5}
                  />
                  <div className="field-footer">
                    <span className="field-hint">{t('submit.step2.fullDescriptionHint')}</span>
                    <span className="char-count">{form.full_description.length}</span>
                  </div>
                </div>

                <div className="field">
                  <label>{t('submit.step2.methodologyLabel')}</label>
                  <textarea
                    value={form.methodology}
                    onChange={e => updateForm('methodology', e.target.value)}
                    placeholder={t('submit.step2.methodologyPlaceholder')}
                    rows={3}
                  />
                </div>

                <div className="field">
                  <label>{t('submit.step2.keyFindingsLabel')}</label>
                  <textarea
                    value={form.key_findings}
                    onChange={e => updateForm('key_findings', e.target.value)}
                    placeholder={t('submit.step2.keyFindingsPlaceholder')}
                    rows={3}
                  />
                </div>

                <div className="form-nav">
                  <Button type="button" variant="secondary" icon={ChevronLeft} onClick={goBack}>
                    {t('submit.nav.back')}
                  </Button>
                  <Button type="button" variant="primary" icon={ChevronRight} iconPosition="right" onClick={goNext}>
                    {t('submit.nav.next')}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Media & Links */}
            {step === 3 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="section-heading"><Code size={18} /> {t('submit.step3.heading')}</h2>

                <div className="field">
                  <label>{t('submit.step3.technologiesLabel')}</label>
                  <input
                    type="text"
                    value={form.technologies}
                    onChange={e => updateForm('technologies', e.target.value)}
                    placeholder={t('submit.step3.technologiesPlaceholder')}
                  />
                  <span className="field-hint">{t('submit.step3.technologiesHint')}</span>
                </div>

                <div className="field">
                  <label><Image size={13} /> {t('submit.step3.screenshotsLabel')}</label>
                  <input
                    ref={screenshotInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleScreenshotFiles}
                    style={{ display: 'none' }}
                  />
                  <div
                    className="upload-zone"
                    onClick={() => screenshotInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                    onDragLeave={e => e.currentTarget.classList.remove('dragover')}
                    onDrop={e => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('dragover');
                      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                      if (files.length > 0) {
                        setScreenshotFiles(prev => [...prev, ...files]);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setScreenshotPreviews(prev => [...prev, { name: file.name, url: ev.target.result }]);
                          };
                          reader.readAsDataURL(file);
                        });
                      }
                    }}
                  >
                    <Upload size={20} />
                    <span>{t('submit.step3.uploadScreenshots')}</span>
                    <small>{t('submit.step3.uploadHint')}</small>
                  </div>
                  {screenshotPreviews.length > 0 && (
                    <div className="upload-previews">
                      {screenshotPreviews.map((preview, i) => (
                        <div key={i} className="upload-preview-item">
                          <img src={preview.url} alt={preview.name} />
                          <button type="button" className="remove-preview" onClick={() => removeScreenshot(i)}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="field-row two-col">
                  <div className="field">
                    <label><LinkIcon size={13} /> {t('submit.step3.demoUrlLabel')}</label>
                    <input
                      type="url"
                      value={form.demo_url}
                      onChange={e => updateForm('demo_url', e.target.value)}
                      placeholder={t('submit.step3.demoPlaceholder')}
                    />
                  </div>
                  <div className="field">
                    <label><Code size={13} /> {t('submit.step3.githubUrlLabel')}</label>
                    <input
                      type="url"
                      value={form.github_url}
                      onChange={e => updateForm('github_url', e.target.value)}
                      placeholder={t('submit.step3.githubPlaceholder')}
                    />
                  </div>
                </div>

                <div className="field">
                  <label><FileText size={13} /> {t('submit.step3.documentationUrlLabel')}</label>
                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleDocFile}
                    style={{ display: 'none' }}
                  />
                  <div
                    className="upload-zone upload-zone-sm"
                    onClick={() => docInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('dragover'); }}
                    onDragLeave={e => e.currentTarget.classList.remove('dragover')}
                    onDrop={e => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('dragover');
                      const file = e.dataTransfer.files[0];
                      if (file) setDocFile(file);
                    }}
                  >
                    <Upload size={18} />
                    <span>{docFile ? docFile.name : t('submit.step3.uploadDocument')}</span>
                    <small>{t('submit.step3.uploadDocHint')}</small>
                  </div>
                  {docFile && (
                    <div className="uploaded-file-info">
                      <FileText size={14} />
                      <span>{docFile.name}</span>
                      <button type="button" className="remove-file" onClick={() => setDocFile(null)}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-nav">
                  <Button type="button" variant="secondary" icon={ChevronLeft} onClick={goBack}>
                    {t('submit.nav.back')}
                  </Button>
                  <Button type="button" variant="primary" icon={ChevronRight} iconPosition="right" onClick={() => { setStep(4); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    {t('submit.nav.review')}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="section-heading"><CheckCircle size={18} /> {t('submit.step4.heading')}</h2>

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
                  {screenshotFiles.length > 0 && <ReviewCard label="Screenshots" value={`${screenshotFiles.length} file(s) to upload`} />}
                  {docFile && <ReviewCard label="Document" value={docFile.name} />}
                </div>

                <div className="review-notice">
                  <AlertCircle size={16} />
                  <span>{t('submit.step4.reviewNotice')}</span>
                </div>

                <div className="form-nav">
                  <Button type="button" variant="secondary" icon={ChevronLeft} onClick={goBack}>
                    {t('submit.nav.back')}
                  </Button>
                  <Button type="submit" variant="primary" icon={Send} iconPosition="right" loading={submitting || uploading}>
                    {uploading ? t('submit.step4.uploading') : submitting ? t('submit.step4.submitting') : t('submit.step4.submitButton')}
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
