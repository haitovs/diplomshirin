import { Edit2, GraduationCap, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import './EditorStyles.css';

function EducationEditor() {
  const { portfolio, addItem, updateItem, removeItem } = usePortfolio();
  const { education } = portfolio;
  const [editModal, setEditModal] = useState({ open: false, edu: null });
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    field: '',
    year: '',
    gpa: ''
  });

  const openAddModal = () => {
    setFormData({ school: '', degree: '', field: '', year: '', gpa: '' });
    setEditModal({ open: true, edu: null });
  };

  const openEditModal = (edu) => {
    setFormData({
      school: edu.school,
      degree: edu.degree || '',
      field: edu.field || '',
      year: edu.year || '',
      gpa: edu.gpa || ''
    });
    setEditModal({ open: true, edu });
  };

  const closeModal = () => {
    setEditModal({ open: false, edu: null });
  };

  const handleSave = () => {
    if (!formData.school.trim()) return;
    
    if (editModal.edu) {
      updateItem('education', editModal.edu.id, formData);
    } else {
      addItem('education', formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this education entry?')) {
      removeItem('education', id);
    }
  };

  return (
    <div className="editor-form">
      {education.length > 0 ? (
        <div className="items-list">
          {education.map((edu) => (
            <div key={edu.id} className="item-card">
              <div className="item-header">
                <div>
                  <h3 className="item-title">{edu.school}</h3>
                  <p className="item-subtitle">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  <span className="item-meta">
                    {edu.year}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                  </span>
                </div>
                <div className="item-actions">
                  <button className="item-action-btn" onClick={() => openEditModal(edu)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="item-action-btn delete" onClick={() => handleDelete(edu.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <GraduationCap size={40} />
          <p>No education added yet</p>
        </div>
      )}

      <button className="add-item-btn" onClick={openAddModal}>
        <Plus size={20} />
        Add Education
      </button>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={closeModal}
        title={editModal.edu ? 'Edit Education' : 'Add Education'}
        size="md"
      >
        <div className="editor-form">
          <Input
            label="School / University"
            value={formData.school}
            onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
            placeholder="MIT"
            required
          />

          <div className="form-row">
            <Input
              label="Degree"
              value={formData.degree}
              onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
              placeholder="Bachelor of Science"
            />
            <Input
              label="Field of Study"
              value={formData.field}
              onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
              placeholder="Computer Science"
            />
          </div>

          <div className="form-row">
            <Input
              label="Graduation Year"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              placeholder="2024"
            />
            <Input
              label="GPA (optional)"
              value={formData.gpa}
              onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
              placeholder="3.8"
            />
          </div>
        </div>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editModal.edu ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EducationEditor;
