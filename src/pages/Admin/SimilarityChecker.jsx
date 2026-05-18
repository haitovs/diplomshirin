import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Search,
  Shield,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { searchAPI } from '../../services/api';
import './SimilarityChecker.css';

function SimilarityChecker() {
  const { t } = useTranslation();
  const [mode, setMode] = useState('text'); // 'text' | 'file'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullText, setFullText] = useState('');
  const [compareAgainst, setCompareAgainst] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      setFullText(text);
    } catch {
      setError(t('admin.similarityChecker.fileReadError'));
    }
  }

  async function handleCheck() {
    if (!title && !description && !fullText) {
      setError(t('admin.similarityChecker.noInput'));
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await searchAPI.deepCheck({ title, description, fullText, compareAgainst });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setTitle('');
    setDescription('');
    setFullText('');
    setResults(null);
    setError(null);
    setExpandedId(null);
  }

  function getVerdictConfig(verdict) {
    switch (verdict) {
      case 'HIGH_SIMILARITY':
        return { color: 'red', label: t('admin.similarityChecker.verdicts.highSimilarity'), icon: AlertTriangle };
      case 'MEDIUM_SIMILARITY':
        return { color: 'amber', label: t('admin.similarityChecker.verdicts.mediumSimilarity'), icon: AlertTriangle };
      case 'LOW_SIMILARITY':
        return { color: 'blue', label: t('admin.similarityChecker.verdicts.lowSimilarity'), icon: Search };
      case 'UNIQUE':
        return { color: 'green', label: t('admin.similarityChecker.verdicts.unique'), icon: CheckCircle };
      case 'NO_DATA':
        return { color: 'blue', label: t('admin.similarityChecker.verdicts.noData'), icon: Search };
      default:
        return { color: 'blue', label: verdict, icon: Search };
    }
  }

  function getSimilarityColor(score) {
    if (score >= 60) return 'high';
    if (score >= 35) return 'medium';
    return 'low';
  }

  const fieldLabelMap = {
    title: t('admin.similarityChecker.fieldTitle'),
    description: t('admin.similarityChecker.fieldDescription'),
    combined: t('admin.similarityChecker.fieldCombined'),
  };

  return (
    <div className="similarity-checker">
      <div className="sc-header">
        <div className="sc-heading">
          <h1><Shield size={28} /> {t('admin.similarityChecker.title')}</h1>
          <p>{t('admin.similarityChecker.subtitle')}</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="sc-card">
        <div className="sc-card-header">
          <h2><FileText size={20} /> {t('admin.similarityChecker.inputSection')}</h2>
          <div className="sc-mode-toggle">
            <button
              className={`sc-mode-btn ${mode === 'text' ? 'active' : ''}`}
              onClick={() => setMode('text')}
            >
              {t('admin.similarityChecker.textInput')}
            </button>
            <button
              className={`sc-mode-btn ${mode === 'file' ? 'active' : ''}`}
              onClick={() => setMode('file')}
            >
              <Upload size={14} /> {t('admin.similarityChecker.fileUpload')}
            </button>
          </div>
        </div>

        {mode === 'file' && (
          <div className="sc-file-upload">
            <label className="sc-file-label">
              <Upload size={20} />
              <span>{t('admin.similarityChecker.chooseFile')}</span>
              <input type="file" accept=".txt" onChange={handleFileUpload} />
            </label>
            {fullText && <span className="sc-file-loaded">{t('admin.similarityChecker.fileLoaded', { length: fullText.length })}</span>}
          </div>
        )}

        <div className="sc-fields">
          <div className="sc-field">
            <label>{t('admin.similarityChecker.titleLabel')}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('admin.similarityChecker.titlePlaceholder')}
            />
            <span className="sc-hint">Short title of the project to fingerprint against existing works.</span>
          </div>
          <div className="sc-field">
            <label>{t('admin.similarityChecker.descriptionLabel')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('admin.similarityChecker.descriptionPlaceholder')}
              rows={3}
            />
            <span className="sc-hint">Abstract or summary — used for semantic similarity scoring.</span>
          </div>
          {mode === 'text' && (
            <div className="sc-field">
              <label>{t('admin.similarityChecker.fullTextLabel')}</label>
              <textarea
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
                placeholder={t('admin.similarityChecker.fullTextPlaceholder')}
                rows={6}
              />
              <span className="sc-hint">Full paper text catches verbatim copying and paraphrasing.</span>
            </div>
          )}
          <div className="sc-field">
            <label>{t('admin.similarityChecker.compareAgainst')}</label>
            <select value={compareAgainst} onChange={(e) => setCompareAgainst(e.target.value)}>
              <option value="all">{t('admin.similarityChecker.allWorks')}</option>
              <option value="approved">{t('admin.similarityChecker.approvedOnly')}</option>
              <option value="default">{t('admin.similarityChecker.approvedPending')}</option>
            </select>
            <span className="sc-hint">Pick the corpus the submission is compared against.</span>
          </div>
        </div>

        <div className="sc-actions">
          <button className="sc-btn primary" onClick={handleCheck} disabled={loading}>
            {loading ? <><Loader2 size={16} className="sc-spinner" /> {t('admin.similarityChecker.checking')}</> : <><Search size={16} /> {t('admin.similarityChecker.checkButton')}</>}
          </button>
          <button className="sc-btn secondary" onClick={handleClear} disabled={loading}>
            <X size={16} /> {t('admin.similarityChecker.clearButton')}
          </button>
        </div>

        {error && <div className="sc-error">{error}</div>}
      </div>

      {/* Results Section */}
      {results && (
        <div className="sc-results">
          {/* Verdict Card */}
          {(() => {
            const vc = getVerdictConfig(results.summary.verdict);
            const VerdictIcon = vc.icon;
            return (
              <div className={`sc-verdict ${vc.color}`}>
                <div className="sc-verdict-icon">
                  <VerdictIcon size={32} />
                </div>
                <div className="sc-verdict-content">
                  <h3>{vc.label}</h3>
                  <div className="sc-verdict-stats">
                    <span className="sc-verdict-max">{t('admin.similarityChecker.maxSimilarity', { value: results.summary.maxSimilarity })}</span>
                    <span>{t('admin.similarityChecker.comparedAgainst', { count: results.summary.totalCompared })}</span>
                  </div>
                  <div className="sc-risk-counts">
                    {results.summary.highRiskCount > 0 && (
                      <span className="sc-risk high">{t('admin.similarityChecker.highRisk', { count: results.summary.highRiskCount })}</span>
                    )}
                    {results.summary.mediumRiskCount > 0 && (
                      <span className="sc-risk medium">{t('admin.similarityChecker.mediumRisk', { count: results.summary.mediumRiskCount })}</span>
                    )}
                    {results.summary.lowRiskCount > 0 && (
                      <span className="sc-risk low">{t('admin.similarityChecker.lowRisk', { count: results.summary.lowRiskCount })}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Results List */}
          {results.results.length > 0 && (
            <div className="sc-results-list">
              <h3>{t('admin.similarityChecker.matchingWorks', { count: results.results.length })}</h3>
              {results.results.map((r) => (
                <div key={r.id} className="sc-result-card">
                  <div
                    className="sc-result-header"
                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  >
                    <div className={`sc-similarity-badge ${getSimilarityColor(r.overallSimilarity)}`}>
                      {r.overallSimilarity}%
                    </div>
                    <div className="sc-result-info">
                      <span className="sc-result-title">{r.title}</span>
                      <span className="sc-result-meta">
                        {r.studentName} &middot; {r.category} &middot; {r.year}
                      </span>
                    </div>
                    {expandedId === r.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>

                  {expandedId === r.id && (
                    <div className="sc-result-details">
                      {/* Field breakdown */}
                      {['title', 'description', 'combined'].map((field) => {
                        const fb = r.fieldBreakdown[field];
                        if (!fb) return null;
                        return (
                          <div key={field} className="sc-field-breakdown">
                            <div className="sc-field-header">
                              <span className="sc-field-name">{fieldLabelMap[field] || field}</span>
                              <span className={`sc-field-score ${getSimilarityColor(fb.score)}`}>{fb.score}%</span>
                            </div>
                            <div className="sc-methods">
                              {Object.entries(fb.methods).map(([method, score]) => (
                                <div key={method} className="sc-method-row">
                                  <span className="sc-method-name">{method}</span>
                                  <div className="sc-method-bar-container">
                                    <div
                                      className={`sc-method-bar ${getSimilarityColor(score)}`}
                                      style={{ width: `${score}%` }}
                                    />
                                  </div>
                                  <span className="sc-method-value">{score}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Technologies */}
                      {r.technologies && r.technologies.length > 0 && (
                        <div className="sc-tech-tags">
                          {r.technologies.map((tech, i) => (
                            <span key={i} className="sc-tech-tag">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {results.results.length === 0 && results.summary.verdict !== 'NO_DATA' && (
            <div className="sc-no-matches">
              <CheckCircle size={32} />
              <p>{t('admin.similarityChecker.noMatches')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SimilarityChecker;
