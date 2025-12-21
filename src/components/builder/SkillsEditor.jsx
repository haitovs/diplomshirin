import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import './EditorStyles.css';

function SkillsEditor() {
  const { portfolio, addItem, updateItem, removeItem } = usePortfolio();
  const { skills } = portfolio;
  const [editModal, setEditModal] = useState({ open: false, skill: null });
  const [formData, setFormData] = useState({ name: '', level: 80 });

  const openAddModal = () => {
    setFormData({ name: '', level: 80 });
    setEditModal({ open: true, skill: null });
  };

  const openEditModal = (skill) => {
    setFormData({ name: skill.name, level: skill.level });
    setEditModal({ open: true, skill });
  };

  const closeModal = () => {
    setEditModal({ open: false, skill: null });
    setFormData({ name: '', level: 80 });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    if (editModal.skill) {
      updateItem('skills', editModal.skill.id, formData);
    } else {
      addItem('skills', formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this skill?')) {
      removeItem('skills', id);
    }
  };

  return (
    <div className="editor-form">
      {skills.length > 0 ? (
        <div className="items-list">
          {skills.map((skill) => (
            <div key={skill.id} className="item-card">
              <div className="skill-bar">
                <span className="skill-name">{skill.name}</span>
                <div className="skill-level">
                  <div 
                    className="skill-level-fill" 
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <span className="skill-percentage">{skill.level}%</span>
                <div className="item-actions">
                  <button 
                    className="item-action-btn"
                    onClick={() => openEditModal(skill)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="item-action-btn delete"
                    onClick={() => handleDelete(skill.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No skills added yet</p>
        </div>
      )}

      <button className="add-item-btn" onClick={openAddModal}>
        <Plus size={20} />
        Add Skill
      </button>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={closeModal}
        title={editModal.skill ? 'Edit Skill' : 'Add Skill'}
        size="sm"
      >
        <div className="editor-form">
          <Input
            label="Skill Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., React, Python, Project Management"
            required
          />
          
          <div className="input-group">
            <label className="input-label">Proficiency Level: {formData.level}%</label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editModal.skill ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SkillsEditor;
