import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { diplomaWorksAPI, searchAPI, studentsAPI } from '../services/api';
import './Submit.css';

function Submit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [similarityCheck, setSimilarityCheck] = useState(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    full_description: '',
    student_id: '',
    category: '',
    year: new Date().getFullYear(),
    technologies: '',
    screenshots: '',
    demo_url: '',
    github_url: '',
    documentation_url: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [studs, cats] = await Promise.all([
        studentsAPI.getAll(),
        searchAPI.getCategories()
      ]);
      setStudents(studs);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load data', err);
    }
  }

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // Check similarity when title/description changes
  async function checkSimilarity() {
    if (!form.title.trim()) return;

    setChecking(true);
    try {
      const result = await searchAPI.checkIdea(form.title, form.description);
      setSimilarityCheck(result);
    } catch (err) {
      console.error('Similarity check failed', err);
    } finally {
      setChecking(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const data = {
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
        screenshots: form.screenshots.split(',').map(s => s.trim()).filter(Boolean)
      };

      await diplomaWorksAPI.create(data);
      navigate('/archive', { state: { success: 'Work submitted for review!' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="submit-page">
      <h1>📝 Submit Diploma Work</h1>
      <p className="subtitle">Share your diploma project with the community</p>

      {/* Progress Steps */}
      <div className="steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Basic Info</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Details</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Review</div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="form-step">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm('title', e.target.value)}
                onBlur={checkSimilarity}
                placeholder="Your diploma work title"
                required
              />
            </div>

            <div className="form-group">
              <label>Short Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                onBlur={checkSimilarity}
                placeholder="Brief description (1-2 sentences)"
                rows={3}
                required
              />
            </div>

            {/* Similarity Check Result */}
            {checking && <div className="checking">🔍 Checking for similar works...</div>}
            {similarityCheck && (
              <div className={`similarity-result ${similarityCheck.ideaExists ? 'danger' : similarityCheck.warning ? 'warning' : 'success'}`}>
                <strong>{similarityCheck.message}</strong>
                {similarityCheck.matches?.length > 0 && (
                  <ul>
                    {similarityCheck.matches.slice(0, 3).map(m => (
                      <li key={m.id}>{m.title} - {m.similarity}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Student *</label>
                <select
                  value={form.student_id}
                  onChange={(e) => updateForm('student_id', e.target.value)}
                  required
                >
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm('category', e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.length > 0 ? (
                    categories.map(c => (
                      <option key={c.category} value={c.category}>{c.category}</option>
                    ))
                  ) : (
                    <>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="IoT">IoT</option>
                      <option value="Game Development">Game Development</option>
                      <option value="Security">Security</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Year *</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => updateForm('year', e.target.value)}
                  min={2020}
                  max={2030}
                  required
                />
              </div>
            </div>

            <button type="button" className="next-btn" onClick={() => {
              if (!form.title.trim() || !form.description.trim() || !form.student_id || !form.category) {
                setError('Please fill in all required fields (Title, Description, Student, Category)');
                return;
              }
              setError(null);
              setStep(2);
            }}>
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label>Full Description</label>
              <textarea
                value={form.full_description}
                onChange={(e) => updateForm('full_description', e.target.value)}
                placeholder="Detailed description of your project..."
                rows={6}
              />
            </div>

            <div className="form-group">
              <label>Technologies (comma-separated)</label>
              <input
                type="text"
                value={form.technologies}
                onChange={(e) => updateForm('technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB..."
              />
            </div>

            <div className="form-group">
              <label>Screenshot URLs (comma-separated)</label>
              <input
                type="text"
                value={form.screenshots}
                onChange={(e) => updateForm('screenshots', e.target.value)}
                placeholder="https://example.com/image1.jpg, https://..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Demo URL</label>
                <input
                  type="url"
                  value={form.demo_url}
                  onChange={(e) => updateForm('demo_url', e.target.value)}
                  placeholder="https://demo.example.com"
                />
              </div>

              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={form.github_url}
                  onChange={(e) => updateForm('github_url', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="btn-group">
              <button type="button" className="back-btn" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="button" className="next-btn" onClick={() => setStep(3)}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="form-step review">
            <h2>Review Your Submission</h2>

            <div className="review-item">
              <strong>Title:</strong> {form.title}
            </div>
            <div className="review-item">
              <strong>Category:</strong> {form.category} ({form.year})
            </div>
            <div className="review-item">
              <strong>Description:</strong> {form.description}
            </div>
            <div className="review-item">
              <strong>Technologies:</strong> {form.technologies || 'Not specified'}
            </div>

            <div className="btn-group">
              <button type="button" className="back-btn" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : '✓ Submit for Review'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default Submit;
