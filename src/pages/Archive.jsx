import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { diplomaWorksAPI, searchAPI } from '../services/api';
import './Archive.css';

function Archive() {
  const { t } = useTranslation();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({ category: '', year: '' });
  const initialMount = useRef(true);

  // Load initial data
  useEffect(() => {
    loadData();
    loadFilters();
  }, []);

  // Apply filters (skip on initial mount to avoid double load)
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    if (!searchQuery) {
      loadData();
    }
  }, [filters]);

  // Debounced live search
  useEffect(() => {
    const q = searchQuery.trim();
    const handle = setTimeout(async () => {
      if (!q) {
        setSearchResults(null);
        loadData();
        return;
      }
      try {
        setLoading(true);
        const results = await searchAPI.search(q, filters);
        setSearchResults(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters.category, filters.year]);

  async function loadData() {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.year) params.year = filters.year;
      const data = await diplomaWorksAPI.getAll(params);
      setWorks(data);
      setSearchResults(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadFilters() {
    try {
      const [cats, yrs] = await Promise.all([
        searchAPI.getCategories(),
        searchAPI.getYears()
      ]);
      setCategories(cats);
      setYears(yrs);
    } catch (err) {
      console.error('Failed to load filters', err);
    }
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchResults(null);
    loadData();
  }

  const displayWorks = searchResults ? searchResults.results : works;

  const hasActiveFilters = Boolean(searchQuery || filters.category || filters.year);

  function clearAllFilters() {
    setSearchQuery('');
    setSearchResults(null);
    setFilters({ category: '', year: '' });
  }

  return (
    <motion.div
      className="archive-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <header className="archive-header">
        <h1>{t('archive.title')}</h1>
        <p>{t('archive.subtitle')}</p>
      </header>

      {/* Search Bar */}
      <section className="archive-search">
        <div className="search-form">
          <div className="search-input-wrap">
            <input
              type="text"
              placeholder={t('archive.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button type="button" onClick={clearSearch} className="clear-btn" aria-label="Clear">×</button>
            )}
          </div>
        </div>

        <div className="filters">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">{t('archive.allCategories')}</option>
            {categories.map(c => (
              <option key={c.category} value={c.category}>
                {c.category} ({c.count})
              </option>
            ))}
          </select>

          <select
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="">{t('archive.allYears')}</option>
            {years.map(y => (
              <option key={y.year} value={y.year}>
                {y.year} ({y.count})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Results Info */}
      {searchResults && (
        <div className="search-info">
          Found <strong>{searchResults.count}</strong> results for &ldquo;<em>{searchResults.query}</em>&rdquo;
        </div>
      )}

      {/* Loading/Error States */}
      {loading && (
        <div className="works-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="work-card skeleton-card">
              <div className="work-image skeleton-shimmer" />
              <div className="work-info">
                <div className="skeleton-line skeleton-shimmer" style={{ width: '80%', height: 18 }} />
                <div className="skeleton-line skeleton-shimmer" style={{ width: '100%', height: 14, marginTop: 8 }} />
                <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', height: 14, marginTop: 4 }} />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 12 }}>
                  <div className="skeleton-badge skeleton-shimmer" />
                  <div className="skeleton-badge skeleton-shimmer" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 12 }}>
                  <div className="skeleton-avatar skeleton-shimmer" />
                  <div className="skeleton-line skeleton-shimmer" style={{ width: 100, height: 12 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <div className="error">{t('archive.error', { error })}</div>}

      {/* Works Grid */}
      {!loading && !error && displayWorks.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <SearchX size={48} />
          </div>
          <h3>{t('archive.noResults')}</h3>
          <p>Try adjusting your search or filters.</p>
          {hasActiveFilters && (
            <button type="button" className="empty-clear-btn" onClick={clearAllFilters}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {!loading && !error && displayWorks.length > 0 && (
        <div className="works-grid">
          {displayWorks.map(work => (
              <Link to={`/archive/${work.id}`} key={work.id} className="work-card">
                <div className="work-image">
                  {work.screenshots?.[0] ? (
                    <img src={work.screenshots[0]} alt={work.title} loading="lazy" />
                  ) : (
                    <div className="placeholder-image">📄</div>
                  )}
                </div>
                <div className="work-info">
                  <h3>{work.title}</h3>
                  <p className="work-description">{work.description}</p>
                  <div className="work-meta">
                    <span className="category">{work.category}</span>
                    <span className="year">{work.year}</span>
                    {work.relevance && (
                      <span className="relevance">{t('archive.match', { value: work.relevance })}</span>
                    )}
                  </div>
                  <div className="work-author">
                    {work.student_avatar && (
                      <img src={work.student_avatar} alt="" className="author-avatar" loading="lazy" />
                    )}
                    <span>{work.student_name}</span>
                  </div>
                  <div className="work-stats">
                    <span>👁 {work.views}</span>
                    {work.rating > 0 && <span>⭐ {work.rating}</span>}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}

      {/* Submit CTA */}
      <section className="submit-cta">
        <h2>{t('archive.ctaTitle')}</h2>
        <Link to="/submit" className="submit-btn">{t('archive.ctaButton')}</Link>
      </section>
    </motion.div>
  );
}

export default Archive;
