import { motion } from 'framer-motion';
import { Edit2, Eye, Plus, Search, Star, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ProjectForm from '../../components/features/ProjectForm';
import { useData } from '../../context/DataContext';
import './ManageProjects.css';

function ManageProjects() {
  const { projects, deleteProject, getCategoryById, getStudentById, updateProject } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, project: null });
  const [formModal, setFormModal] = useState({ open: false, project: null });

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteModal.project) {
      deleteProject(deleteModal.project.id);
      setDeleteModal({ open: false, project: null });
    }
  };

  const toggleFeatured = (project) => {
    updateProject(project.id, { featured: !project.featured });
  };

  const openAddForm = () => {
    setFormModal({ open: true, project: null });
  };

  const openEditForm = (project) => {
    setFormModal({ open: true, project });
  };

  const closeFormModal = () => {
    setFormModal({ open: false, project: null });
  };

  return (
    <div className="manage-projects">
      <div className="page-header">
        <div>
          <h1>Manage Projects</h1>
          <p>{projects.length} projects total</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddForm}>
          Add Project
        </Button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Projects Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Student</th>
              <th>Year</th>
              <th>Rating</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => {
              const category = getCategoryById(project.categoryId);
              const student = getStudentById(project.studentId);
              
              return (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td>
                    <div className="project-cell">
                      <img src={project.screenshots[0]} alt={project.title} />
                      <div>
                        <span className="project-title">{project.title}</span>
                        <span className="project-views">{project.views} views</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant="primary" size="sm">
                      {category?.name || 'N/A'}
                    </Badge>
                  </td>
                  <td>{student?.name || 'N/A'}</td>
                  <td>{project.year}</td>
                  <td>
                    <div className="rating-cell">
                      <Star size={14} />
                      {project.rating}
                    </div>
                  </td>
                  <td>
                    <button 
                      className={`feature-toggle ${project.featured ? 'active' : ''}`}
                      onClick={() => toggleFeatured(project)}
                    >
                      <Star size={16} />
                    </button>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Link 
                        to={`/projects/${project.slug}`} 
                        className="action-btn view" 
                        title="View"
                        target="_blank"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        className="action-btn edit" 
                        title="Edit"
                        onClick={() => openEditForm(project)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Delete"
                        onClick={() => setDeleteModal({ open: true, project })}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredProjects.length === 0 && (
          <div className="empty-table">
            <p>No projects found</p>
          </div>
        )}
      </div>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={formModal.open}
        onClose={closeFormModal}
        project={formModal.project}
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, project: null })}
        title="Delete Project"
        size="sm"
      >
        <p>Are you sure you want to delete "<strong>{deleteModal.project?.title}</strong>"?</p>
        <p className="text-secondary" style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-tertiary)' }}>
          This action cannot be undone.
        </p>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setDeleteModal({ open: false, project: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageProjects;
