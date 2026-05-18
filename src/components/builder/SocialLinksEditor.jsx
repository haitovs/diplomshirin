import { Edit2, Github, Globe, Linkedin, Link as LinkIcon, Mail, Plus, Trash2, Twitter } from 'lucide-react';
import { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import './EditorStyles.css';

const PLATFORM_OPTIONS = [
  { value: 'GitHub', label: 'GitHub' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'Portfolio', label: 'Portfolio Website' },
  { value: 'Dribbble', label: 'Dribbble' },
  { value: 'Behance', label: 'Behance' },
  { value: 'CodePen', label: 'CodePen' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Dev.to', label: 'Dev.to' },
  { value: 'Email', label: 'Email' },
  { value: 'Other', label: 'Other' }
];

const platformIcons = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
  Portfolio: Globe,
  Email: Mail,
  Other: LinkIcon
};

function SocialLinksEditor() {
  const { portfolio, addItem, updateItem, removeItem } = usePortfolio();
  const { socialLinks } = portfolio;
  const [editModal, setEditModal] = useState({ open: false, link: null });
  const [formData, setFormData] = useState({
    platform: 'GitHub',
    url: ''
  });

  const openAddModal = () => {
    setFormData({ platform: 'GitHub', url: '' });
    setEditModal({ open: true, link: null });
  };

  const openEditModal = (link) => {
    setFormData({
      platform: link.platform,
      url: link.url || ''
    });
    setEditModal({ open: true, link });
  };

  const closeModal = () => {
    setEditModal({ open: false, link: null });
  };

  const handleSave = () => {
    if (!formData.url.trim()) return;
    
    if (editModal.link) {
      updateItem('socialLinks', editModal.link.id, formData);
    } else {
      addItem('socialLinks', formData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this link?')) {
      removeItem('socialLinks', id);
    }
  };

  const getIcon = (platform) => {
    return platformIcons[platform] || LinkIcon;
  };

  return (
    <div className="editor-form">
      {socialLinks.length > 0 ? (
        <div className="items-list items-list-2col">
          {socialLinks.map((link) => {
            const Icon = getIcon(link.platform);
            return (
              <div key={link.id} className="item-card social-item">
                <div className="social-icon">
                  <Icon size={20} />
                </div>
                <div className="social-info">
                  <span className="social-platform">{link.platform}</span>
                  <span className="social-url">{link.url}</span>
                </div>
                <div className="item-actions">
                  <button className="item-action-btn" onClick={() => openEditModal(link)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="item-action-btn delete" onClick={() => handleDelete(link.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <LinkIcon size={40} />
          <p>No social links added yet</p>
        </div>
      )}

      <button className="add-item-btn" onClick={openAddModal}>
        <Plus size={20} />
        Add Social Link
      </button>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={closeModal}
        title={editModal.link ? 'Edit Social Link' : 'Add Social Link'}
        size="sm"
      >
        <div className="editor-form">
          <Select
            label="Platform"
            value={formData.platform}
            onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
            options={PLATFORM_OPTIONS}
          />

          <Input
            label="URL"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder={formData.platform === 'Email' ? 'your@email.com' : 'https://...'}
            required
          />
        </div>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {editModal.link ? 'Save' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SocialLinksEditor;
