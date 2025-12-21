import { Edit2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ImageUpload from '../common/ImageUpload';
import Input from '../common/Input';
import Modal from '../common/Modal';
import TagInput from '../common/TagInput';
import Textarea from '../common/Textarea';
import './EditorStyles.css';

const TECH_SUGGESTIONS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 
  'Python', 'Django', 'Flask', 'FastAPI', 'TensorFlow', 'PyTorch',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'TypeScript'
];

function ProjectsEditor() {
  const { portfolio, addItem, updateItem, removeItem } = usePortfolio();
  const { projects } = portfolio;
  const [editModal, setEditModal] = useState({ open: false, project: null });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: [],
    url: '',
    image: ''
  });

  const openAddModal = () => {
    setFormData({ title: '', description: '', technologies: [], url: '', image: '' });
    setEditModal({ open: true, project: null });
  };

  const openEditModal = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies || [],
      url: project.url || '',
      image: project.image || ''
    });
    setEditModal({ open: true, project });
  };

  const closeModal = () => {
    setEditModal({ open: false, project: null });
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    
    if (editModal.project) {
      updateItem('projects', editModal.project.id, formData);
    } else {
      addItem('projects', formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this project?')) {
      removeItem('projects', id);
    }
  };

  return (
    <div className="editor-form">
      {projects.length > 0 ? (
        <div className="items-list">
          {projects.map((project) => (
            <div key={project.id} className="item-card">
              {project.image && (
                <img src={project.image} alt={project.title} className="project-image" />
              )}
              <div className="item-header">
                <div>
                  <h3 className="item-title">{project.title}</h3>
                  {project.url && (
                    <a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="item-subtitle"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ExternalLink size={12} />
                      View Project
                    </a>
                  )}
                </div>
                <div className="item-actions">
                  <button className="item-action-btn" onClick={() => openEditModal(project)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="item-action-btn delete" onClick={() => handleDelete(project.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="item-description">{project.description}</p>
              {project.technologies?.length > 0 && (
                <div className="project-techs">
                  {project.technologies.map(tech => (
                    <Badge key={tech} variant="neutral" size="sm">{tech}</Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No projects added yet</p>
        </div>
      )}

      <button className="add-item-btn" onClick={openAddModal}>
        <Plus size={20} />
        Add Project
      </button>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={closeModal}
        title={editModal.project ? 'Edit Project' : 'Add Project'}
        size="md"
      >
        <div className="editor-form">
          <Input
            label="Project Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="My Awesome Project"
            required
          />
          
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what this project does..."
            rows={3}
          />

          <TagInput
            label="Technologies Used"
            value={formData.technologies}
            onChange={(tags) => setFormData(prev => ({ ...prev, technologies: tags }))}
            placeholder="Add technologies..."
            suggestions={TECH_SUGGESTIONS}
            maxTags={10}
          />

          <Input
            label="Project URL"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://github.com/..."
          />

          <ImageUpload
            label="Project Screenshot"
            value={formData.image}
            onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
            hint="Upload a screenshot of your project"
          />
        </div>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editModal.project ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProjectsEditor;
