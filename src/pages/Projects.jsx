import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { FolderOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/common/Button';
import ProjectCard from '../components/features/ProjectCard';
import ProjectFilter from '../components/features/ProjectFilter';
import { useData } from '../context/DataContext';
import './Projects.css';

function Projects() {
  const { filteredProjects, setFilters, setSearchQuery, clearFilters, searchQuery, filters } = useData();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');

  // Apply URL params to filters
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams, setFilters, setSearchQuery]);

  const hasActiveFilters = Boolean(
    searchQuery ||
    (filters && (filters.category || filters.year || filters.technology))
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    if (typeof clearFilters === 'function') clearFilters();
  };

  return (
    <motion.div
      className="projects-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="page-icon">
            <FolderOpen size={32} />
          </div>
          <div>
            <h1 className="page-title">All Projects</h1>
            <p className="page-subtitle">
              Explore {filteredProjects.length} amazing final year projects
            </p>
          </div>
        </div>

        {/* Filter */}
        <ProjectFilter
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className={`projects-container ${viewMode}`}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <SearchX size={48} />
            </div>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria.</p>
            {hasActiveFilters && (
              <div className="empty-state-action">
                <Button variant="primary" size="sm" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Projects;
