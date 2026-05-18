import { Award, Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import './EditorStyles.css';

function CertificationsEditor() {
  const { portfolio, addItem, updateItem, removeItem } = usePortfolio();
  const { certifications } = portfolio;
  const [editModal, setEditModal] = useState({ open: false, cert: null });
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    year: '',
    url: ''
  });

  const openAddModal = () => {
    setFormData({ name: '', issuer: '', year: '', url: '' });
    setEditModal({ open: true, cert: null });
  };

  const openEditModal = (cert) => {
    setFormData({
      name: cert.name,
      issuer: cert.issuer || '',
      year: cert.year || '',
      url: cert.url || ''
    });
    setEditModal({ open: true, cert });
  };

  const closeModal = () => {
    setEditModal({ open: false, cert: null });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    
    if (editModal.cert) {
      updateItem('certifications', editModal.cert.id, formData);
    } else {
      addItem('certifications', formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this certification?')) {
      removeItem('certifications', id);
    }
  };

  return (
    <div className="editor-form">
      {certifications.length > 0 ? (
        <div className="items-list items-list-2col">
          {certifications.map((cert) => (
            <div key={cert.id} className="item-card">
              <div className="item-header">
                <div>
                  <h3 className="item-title">{cert.name}</h3>
                  <p className="item-subtitle">{cert.issuer}</p>
                  {cert.year && <span className="item-meta">{cert.year}</span>}
                </div>
                <div className="item-actions">
                  <button className="item-action-btn" onClick={() => openEditModal(cert)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="item-action-btn delete" onClick={() => handleDelete(cert.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Award size={40} />
          <p>No certifications added yet</p>
        </div>
      )}

      <button className="add-item-btn" onClick={openAddModal}>
        <Plus size={20} />
        Add Certification
      </button>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={closeModal}
        title={editModal.cert ? 'Edit Certification' : 'Add Certification'}
        size="sm"
      >
        <div className="editor-form">
          <Input
            label="Certification Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="AWS Solutions Architect"
            required
          />

          <Input
            label="Issuing Organization"
            value={formData.issuer}
            onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
            placeholder="Amazon Web Services"
          />

          <Input
            label="Year Obtained"
            value={formData.year}
            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
            placeholder="2023"
          />

          <Input
            label="Certificate URL (optional)"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder="https://credential.example.com/..."
          />
        </div>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editModal.cert ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CertificationsEditor;
