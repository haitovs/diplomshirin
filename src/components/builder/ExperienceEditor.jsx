import { Briefcase, Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Textarea from '../common/Textarea';
import './EditorStyles.css';

function ExperienceEditor() {
  const { portfolio, addItem, updateItem, removeItem } = usePortfolio();
  const { experience } = portfolio;
  const [editModal, setEditModal] = useState({ open: false, exp: null });
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  const openAddModal = () => {
    setFormData({ company: '', role: '', startDate: '', endDate: '', current: false, description: '' });
    setEditModal({ open: true, exp: null });
  };

  const openEditModal = (exp) => {
    setFormData({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description || ''
    });
    setEditModal({ open: true, exp });
  };

  const closeModal = () => {
    setEditModal({ open: false, exp: null });
  };

  const handleSave = () => {
    if (!formData.company.trim() || !formData.role.trim()) return;
    
    if (editModal.exp) {
      updateItem('experience', editModal.exp.id, formData);
    } else {
      addItem('experience', formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this experience?')) {
      removeItem('experience', id);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="editor-form">
      {experience.length > 0 ? (
        <div className="items-list">
          {experience.map((exp) => (
            <div key={exp.id} className="item-card">
              <div className="item-header">
                <div>
                  <h3 className="item-title">{exp.role}</h3>
                  <p className="item-subtitle">{exp.company}</p>
                  <span className="item-meta">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                <div className="item-actions">
                  <button className="item-action-btn" onClick={() => openEditModal(exp)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="item-action-btn delete" onClick={() => handleDelete(exp.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {exp.description && (
                <p className="item-description">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Briefcase size={40} />
          <p>No experience added yet</p>
        </div>
      )}

      <button className="add-item-btn" onClick={openAddModal}>
        <Plus size={20} />
        Add Experience
      </button>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={closeModal}
        title={editModal.exp ? 'Edit Experience' : 'Add Experience'}
        size="md"
      >
        <div className="editor-form">
          <div className="form-row">
            <Input
              label="Company / Organization"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Google"
              required
            />
            <Input
              label="Job Title / Role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="Software Engineer"
              required
            />
          </div>

          <div className="form-row">
            <Input
              label="Start Date"
              type="month"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            />
            <Input
              label="End Date"
              type="month"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              disabled={formData.current}
            />
          </div>

          <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={formData.current}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                current: e.target.checked,
                endDate: e.target.checked ? '' : prev.endDate
              }))}
            />
            <span>I currently work here</span>
          </label>

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your responsibilities and achievements..."
            rows={4}
          />
        </div>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editModal.exp ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExperienceEditor;
