import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { diplomaWorksAPI, searchAPI } from '../services/api';
import './Archive.css';

function Archive() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({ category: '', year: '' });

  // Load initial data
  useEffect(() => {
    loadData();
    loadFilters();
  }, []);

  // Apply filters
  useEffect(() => {
    if (!searchQuery) {
      loadData();
    }
  }, [filters]);

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

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      loadData();
      return;
    }

    try {
      setLoading(true);
      const results = await searchAPI.search(searchQuery, filters);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setSearchQuery('');
    setSearchResults(null);
    loadData();
  }

  const displayWorks = searchResults ? searchResults.results : works;

  return (
    <div className="archive-page">
      <header className="archive-header">
        <h1>📚 Diploma Work Archive</h1>
        <p>Browse and discover diploma projects from students</p>
      </header>

      {/* Search Bar */}
      <section className="archive-search">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title, description, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍 Search</button>
          {searchQuery && (
            <button type="button" onClick={clearSearch} className="clear-btn">✕</button>
          )}
        </form>

        <div className="filters">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All Categories</option>
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
            <option value="">All Years</option>
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
          Found <strong>{searchResults.count}</strong> results for "<em>{searchResults.query}</em>"
        </div>
      )}

      {/* Loading/Error States */}
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      {/* Works Grid */}
      {!loading && !error && (
        <div className="works-grid">
          {displayWorks.length === 0 ? (
            <div className="no-results">No diploma works found</div>
          ) : (
            displayWorks.map(work => (
              <Link to={`/archive/${work.id}`} key={work.id} className="work-card">
                <div className="work-image">
                  {work.screenshots?.[0] ? (
                    <img src={work.screenshots[0]} alt={work.title} />
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
                      <span className="relevance">{work.relevance}% match</span>
                    )}
                  </div>
                  <div className="work-author">
                    {work.student_avatar && (
                      <img src={work.student_avatar} alt="" className="author-avatar" />
                    )}
                    <span>{work.student_name}</span>
                  </div>
                  <div className="work-stats">
                    <span>👁 {work.views}</span>
                    {work.rating > 0 && <span>⭐ {work.rating}</span>}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Submit CTA */}
      <section className="submit-cta">
        <h2>Have a diploma work to share?</h2>
        <Link to="/submit" className="submit-btn">📝 Submit Your Work</Link>
      </section>
    </div>
  );
}

export default Archive;
