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
import { searchAPI } from '../../services/api';
import './SimilarityChecker.css';

function SimilarityChecker() {
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
      setError('Failed to read file');
    }
  }

  async function handleCheck() {
    if (!title && !description && !fullText) {
      setError('Please enter at least a title, description, or full text');
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
        return { color: 'red', label: 'High Similarity Detected', icon: AlertTriangle };
      case 'MEDIUM_SIMILARITY':
        return { color: 'amber', label: 'Moderate Similarity Found', icon: AlertTriangle };
      case 'LOW_SIMILARITY':
        return { color: 'blue', label: 'Low Similarity Found', icon: Search };
      case 'UNIQUE':
        return { color: 'green', label: 'Appears Unique', icon: CheckCircle };
      case 'NO_DATA':
        return { color: 'blue', label: 'No Works to Compare', icon: Search };
      default:
        return { color: 'blue', label: 'Unknown', icon: Search };
    }
  }

  function getSimilarityColor(score) {
    if (score >= 60) return 'high';
    if (score >= 35) return 'medium';
    return 'low';
  }

  return (
    <div className="similarity-checker">
      <div className="sc-header">
        <h1><Shield size={28} /> Similarity Checker</h1>
        <p>Check diploma works for similarity against the entire database</p>
      </div>

      {/* Input Section */}
      <div className="sc-card">
        <div className="sc-card-header">
          <h2><FileText size={20} /> Input Work</h2>
          <div className="sc-mode-toggle">
            <button
              className={`sc-mode-btn ${mode === 'text' ? 'active' : ''}`}
              onClick={() => setMode('text')}
            >
              Text Input
            </button>
            <button
              className={`sc-mode-btn ${mode === 'file' ? 'active' : ''}`}
              onClick={() => setMode('file')}
            >
              <Upload size={14} /> File Upload
            </button>
          </div>
        </div>

        {mode === 'file' && (
          <div className="sc-file-upload">
            <label className="sc-file-label">
              <Upload size={20} />
              <span>Choose a .txt file</span>
              <input type="file" accept=".txt" onChange={handleFileUpload} />
            </label>
            {fullText && <span className="sc-file-loaded">File loaded ({fullText.length} characters)</span>}
          </div>
        )}

        <div className="sc-fields">
          <div className="sc-field">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter diploma work title..."
            />
          </div>
          <div className="sc-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description or abstract..."
              rows={3}
            />
          </div>
          {mode === 'text' && (
            <div className="sc-field">
              <label>Full Text</label>
              <textarea
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
                placeholder="Paste the full text of the diploma work..."
                rows={6}
              />
            </div>
          )}
          <div className="sc-field">
            <label>Compare Against</label>
            <select value={compareAgainst} onChange={(e) => setCompareAgainst(e.target.value)}>
              <option value="all">All Works</option>
              <option value="approved">Approved Only</option>
              <option value="default">Approved + Pending</option>
            </select>
          </div>
        </div>

        <div className="sc-actions">
          <button className="sc-btn primary" onClick={handleCheck} disabled={loading}>
            {loading ? <><Loader2 size={16} className="sc-spinner" /> Checking...</> : <><Search size={16} /> Check Similarity</>}
          </button>
          <button className="sc-btn secondary" onClick={handleClear} disabled={loading}>
            <X size={16} /> Clear
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
                    <span className="sc-verdict-max">Max similarity: <strong>{results.summary.maxSimilarity}%</strong></span>
                    <span>Compared against: <strong>{results.summary.totalCompared}</strong> works</span>
                  </div>
                  <div className="sc-risk-counts">
                    {results.summary.highRiskCount > 0 && (
                      <span className="sc-risk high">{results.summary.highRiskCount} high risk</span>
                    )}
                    {results.summary.mediumRiskCount > 0 && (
                      <span className="sc-risk medium">{results.summary.mediumRiskCount} medium risk</span>
                    )}
                    {results.summary.lowRiskCount > 0 && (
                      <span className="sc-risk low">{results.summary.lowRiskCount} low risk</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Results List */}
          {results.results.length > 0 && (
            <div className="sc-results-list">
              <h3>Matching Works ({results.results.length})</h3>
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
                              <span className="sc-field-name">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
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
              <p>No matches found above 10% threshold. This work appears to be unique!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SimilarityChecker;
