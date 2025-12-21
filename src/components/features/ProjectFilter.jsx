import { Filter, Grid, List, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../common/Button';
import './ProjectFilter.css';

function ProjectFilter({ viewMode, onViewModeChange }) {
  const { 
    searchQuery, 
    setSearchQuery, 
    filters, 
    setFilters,
    clearFilters,
    categories,
    allYears,
    allTechnologies
  } = useData();

  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filters.category || filters.year || filters.technology;

  return (
    <div className="project-filter">
      {/* Search Bar */}
      <div className="filter-search">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button 
            className="search-clear"
            onClick={() => setSearchQuery('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          size="sm"
          icon={Filter}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
          {hasActiveFilters && <span className="filter-count">!</span>}
        </Button>

        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel animate-fade-in-down">
          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                category: e.target.value || null 
              }))}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="filter-group">
            <label className="filter-label">Year</label>
            <select
              value={filters.year || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                year: e.target.value ? parseInt(e.target.value) : null 
              }))}
              className="filter-select"
            >
              <option value="">All Years</option>
              {allYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Technology Filter */}
          <div className="filter-group">
            <label className="filter-label">Technology</label>
            <select
              value={filters.technology || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                technology: e.target.value || null 
              }))}
              className="filter-select"
            >
              <option value="">All Technologies</option>
              {allTechnologies.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectFilter;
