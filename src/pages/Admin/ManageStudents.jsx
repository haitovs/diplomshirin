import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { studentsAPI } from '../../services/api';
import './ManageProjects.css'; // Reuse same styles

function ManageStudents() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);
      const data = await studentsAPI.getAll();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm(t('admin.students.confirmDelete'))) return;
    try {
      await studentsAPI.delete(id);
      loadStudents();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  }

  async function handleSave(formData) {
    try {
      if (editingStudent) {
        await studentsAPI.update(editingStudent.id, formData);
      } else {
        await studentsAPI.create(formData);
      }
      setShowForm(false);
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      console.error('Failed to save', err);
      alert(err.message);
    }
  }

  return (
    <div className="manage-projects">
      <div className="page-header">
        <h1>{t('admin.students.title')}</h1>
        <button className="add-btn" onClick={() => { setEditingStudent(null); setShowForm(true); }}>
          <Plus size={20} /> {t('admin.students.addStudent')}
        </button>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="loading">{t('admin.students.loading')}</div>
      ) : (
        <div className="works-table">
          <table>
            <thead>
              <tr>
                <th>{t('admin.students.avatar')}</th>
                <th>{t('admin.students.name')}</th>
                <th>{t('admin.students.email')}</th>
                <th>{t('admin.students.department')}</th>
                <th>{t('admin.students.year')}</th>
                <th>{t('admin.students.skills')}</th>
                <th>{t('admin.students.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>
                    <img
                      src={student.avatar}
                      alt={student.name}
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                  </td>
                  <td className="title-cell">{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.department || '-'}</td>
                  <td>{student.graduation_year || '-'}</td>
                  <td>
                    {student.skills?.slice(0, 3).map((s, i) => (
                      <span key={i} className="status-badge approved" style={{ marginRight: 4 }}>{s}</span>
                    ))}
                    {student.skills?.length > 3 && <span>+{student.skills.length - 3}</span>}
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => { setEditingStudent(student); setShowForm(true); }} title={t('admin.students.editTitle')}>
                      <Edit size={24} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(student.id)} title={t('admin.students.confirmDelete')}>
                      <Trash2 size={24} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <div className="no-data">{t('admin.students.noData')}</div>}
        </div>
      )}

      {/* Edit/Add Form Modal */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingStudent(null); }}
        />
      )}
    </div>
  );
}

function StudentForm({ student, onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: student?.name || '',
    email: student?.email || '',
    department: student?.department || '',
    graduation_year: student?.graduation_year || new Date().getFullYear(),
    bio: student?.bio || '',
    skills: student?.skills?.join(', ') || '',
    linkedin: student?.linkedin || '',
    github: student?.github || '',
    portfolio: student?.portfolio || ''
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{student ? t('admin.students.editTitle') : t('admin.students.addTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.students.nameLabel')}</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('admin.students.emailLabel')}</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.students.departmentLabel')}</label>
              <input
                type="text"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.students.graduationYearLabel')}</label>
              <input
                type="number"
                value={form.graduation_year}
                onChange={e => setForm({ ...form, graduation_year: parseInt(e.target.value, 10) || '' })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('admin.students.bioLabel')}</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>{t('admin.students.skillsLabel')}</label>
            <input
              type="text"
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
              placeholder={t('admin.students.skillsPlaceholder')}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.students.linkedinLabel')}</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={e => setForm({ ...form, linkedin: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.students.githubLabel')}</label>
              <input
                type="url"
                value={form.github}
                onChange={e => setForm({ ...form, github: e.target.value })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>{t('admin.students.cancel')}</button>
            <button type="submit" className="save-btn">{t('admin.students.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageStudents;
