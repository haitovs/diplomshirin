import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { studentsAPI } from '../../services/api';
import './ManageProjects.css'; // Reuse same styles

function ManageStudents() {
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function getSortValue(s, key) {
    switch (key) {
      case 'name': return (s.name || '').toLowerCase();
      case 'email': return (s.email || '').toLowerCase();
      case 'department': return (s.department || '').toLowerCase();
      case 'year': return Number(s.graduation_year) || 0;
      case 'skills': return s.skills?.length || 0;
      default: return 0;
    }
  }

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(s =>
      (s.name || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.department || '').toLowerCase().includes(q)
    );
  }, [students, search]);

  const sortedStudents = useMemo(() => {
    if (!sortKey) return filteredStudents;
    const copy = [...filteredStudents];
    copy.sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filteredStudents, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedStudents = sortedStudents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, sortKey, sortDir]);

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
        <div className="page-heading">
          <h1>{t('admin.students.title')}</h1>
          <p className="page-subtitle">Manage student profiles, departments, and skills.</p>
        </div>
        <button className="add-btn" onClick={() => { setEditingStudent(null); setShowForm(true); }}>
          <Plus size={18} /> {t('admin.students.addStudent')}
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        {search && (
          <button className="clear-filters-btn" onClick={() => setSearch('')} title="Clear filters">
            <X size={14} /> Clear filters
          </button>
        )}
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
                <SortableTh label={t('admin.students.name')} sortKey="name" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.students.email')} sortKey="email" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.students.department')} sortKey="department" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.students.year')} sortKey="year" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.students.skills')} sortKey="skills" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <th>{t('admin.students.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {pagedStudents.map(student => (
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
                    <div className="skill-tags">
                      {student.skills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="skill-tag">{s}</span>
                      ))}
                      {student.skills?.length > 3 && <span className="skill-tag more">+{student.skills.length - 3}</span>}
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button className="action-btn edit" onClick={() => { setEditingStudent(student); setShowForm(true); }} title={t('admin.students.editTitle')}>
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(student.id)} title={t('admin.students.confirmDelete')}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedStudents.length === 0 && <div className="no-data">{t('admin.students.noData')}</div>}
          {sortedStudents.length > PAGE_SIZE && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span className="pagination-info">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                <span className="pagination-count"> · {sortedStudents.length} results</span>
              </span>
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
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

function SortableTh({ label, sortKey, activeKey, dir, onSort }) {
  const isActive = activeKey === sortKey;
  return (
    <th
      className={`sortable-th ${isActive ? 'active' : ''}`}
      onClick={() => onSort(sortKey)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSort(sortKey); } }}
    >
      <span className="th-label">{label}</span>
      <span className="th-sort-icon">
        {isActive ? (dir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ArrowUpDown size={13} />}
      </span>
    </th>
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
