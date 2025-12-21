import { Edit2, Languages, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import './EditorStyles.css';

const LEVEL_OPTIONS = [
  { value: 'Native', label: 'Native' },
  { value: 'Fluent', label: 'Fluent' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Basic', label: 'Basic' }
];

function LanguagesEditor() {
  const { portfolio, addItem, updateItem, removeItem } = usePortfolio();
  const { languages } = portfolio;
  const [editModal, setEditModal] = useState({ open: false, lang: null });
  const [formData, setFormData] = useState({
    name: '',
    level: 'Intermediate'
  });

  const openAddModal = () => {
    setFormData({ name: '', level: 'Intermediate' });
    setEditModal({ open: true, lang: null });
  };

  const openEditModal = (lang) => {
    setFormData({
      name: lang.name,
      level: lang.level || 'Intermediate'
    });
    setEditModal({ open: true, lang });
  };

  const closeModal = () => {
    setEditModal({ open: false, lang: null });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    if (editModal.lang) {
      updateItem('languages', editModal.lang.id, formData);
    } else {
      addItem('languages', formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this language?')) {
      removeItem('languages', id);
    }
  };

  return (
    <div className="editor-form">
      {languages.length > 0 ? (
        <div className="items-list">
          {languages.map((lang) => (
            <div key={lang.id} className="item-card">
              <div className="item-header">
                <div>
                  <h3 className="item-title">{lang.name}</h3>
                  <p className="item-subtitle">{lang.level}</p>
                </div>
                <div className="item-actions">
                  <button className="item-action-btn" onClick={() => openEditModal(lang)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="item-action-btn delete" onClick={() => handleDelete(lang.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Languages size={40} />
          <p>No languages added yet</p>
        </div>
      )}

      <button className="add-item-btn" onClick={openAddModal}>
        <Plus size={20} />
        Add Language
      </button>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={closeModal}
        title={editModal.lang ? 'Edit Language' : 'Add Language'}
        size="sm"
      >
        <div className="editor-form">
          <Input
            label="Language"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="English, Spanish, etc."
            required
          />

          <Select
            label="Proficiency Level"
            value={formData.level}
            onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
            options={LEVEL_OPTIONS}
          />
        </div>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editModal.lang ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LanguagesEditor;
