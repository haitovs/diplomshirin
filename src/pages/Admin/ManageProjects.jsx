import { ArrowUpDown, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit, Plus, Search, Trash2, X, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { diplomaWorksAPI, studentsAPI } from '../../services/api';
import './ManageProjects.css';

function ManageProjects() {
  const { t } = useTranslation();
  const [works, setWorks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [editingWork, setEditingWork] = useState(null);
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

  function getSortValue(work, key) {
    switch (key) {
      case 'title': return (work.title || '').toLowerCase();
      case 'student': return (work.student_name || getStudentName(work.student_id) || '').toLowerCase();
      case 'category': return (work.category || '').toLowerCase();
      case 'year': return Number(work.year) || 0;
      case 'status': return (work.status || '').toLowerCase();
      case 'views': return Number(work.views) || 0;
      default: return 0;
    }
  }

  const filteredWorks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return works;
    return works.filter(w => {
      const studentName = w.student_name || getStudentName(w.student_id) || '';
      return (
        (w.title || '').toLowerCase().includes(q) ||
        (w.category || '').toLowerCase().includes(q) ||
        studentName.toLowerCase().includes(q)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works, search, students]);

  const sortedWorks = useMemo(() => {
    if (!sortKey) return filteredWorks;
    const copy = [...filteredWorks];
    copy.sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredWorks, sortKey, sortDir, students]);

  const totalPages = Math.max(1, Math.ceil(sortedWorks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedWorks = sortedWorks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [filter, search, sortKey, sortDir]);

  const filtersActive = filter !== 'all' || search.trim().length > 0;
  function clearFilters() { setFilter('all'); setSearch(''); }

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : { status: 'all' };
      const [worksData, studentsData] = await Promise.all([
        diplomaWorksAPI.getAll(params),
        studentsAPI.getAll()
      ]);
      setWorks(worksData);
      setStudents(studentsData);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      await diplomaWorksAPI.update(id, { status: 'approved' });
      loadData();
    } catch (err) {
      console.error('Failed to approve', err);
    }
  }

  async function handleReject(id) {
    try {
      await diplomaWorksAPI.update(id, { status: 'rejected' });
      loadData();
    } catch (err) {
      console.error('Failed to reject', err);
    }
  }

  async function handleDelete(id) {
    if (!confirm(t('admin.projects.confirmDelete'))) return;
    try {
      await diplomaWorksAPI.delete(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  }

  async function handleSave(formData) {
    try {
      if (editingWork) {
        await diplomaWorksAPI.update(editingWork.id, formData);
      } else {
        await diplomaWorksAPI.create(formData);
      }
      setShowForm(false);
      setEditingWork(null);
      loadData();
    } catch (err) {
      console.error('Failed to save', err);
    }
  }

  function getStudentName(id) {
    const student = students.find(s => s.id === id);
    return student ? student.name : 'Unknown';
  }

  return (
    <div className="manage-projects">
      <div className="page-header">
        <div className="page-heading">
          <h1>{t('admin.projects.title')}</h1>
          <p className="page-subtitle">Review, approve, and manage diploma submissions.</p>
        </div>
        <button className="add-btn" onClick={() => { setEditingWork(null); setShowForm(true); }}>
          <Plus size={18} /> {t('admin.projects.addNew')}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, student, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('admin.projects.all')}
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            {t('admin.projects.pending')}
          </button>
          <button
            className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            {t('admin.projects.approved')}
          </button>
        </div>
        {filtersActive && (
          <button className="clear-filters-btn" onClick={clearFilters} title="Clear filters">
            <X size={14} /> Clear filters
          </button>
        )}
      </div>

      {/* Works Table */}
      {loading ? (
        <div className="loading">{t('admin.projects.loading')}</div>
      ) : (
        <div className="works-table">
          <table>
            <thead>
              <tr>
                <SortableTh label={t('admin.projects.tableTitle')} sortKey="title" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.projects.tableStudent')} sortKey="student" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.projects.tableCategory')} sortKey="category" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.projects.tableYear')} sortKey="year" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.projects.tableStatus')} sortKey="status" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableTh label={t('admin.projects.tableViews')} sortKey="views" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
                <th>{t('admin.projects.tableActions')}</th>
              </tr>
            </thead>
            <tbody>
              {pagedWorks.map(work => (
                <tr key={work.id}>
                  <td className="title-cell">{work.title}</td>
                  <td>{work.student_name || getStudentName(work.student_id)}</td>
                  <td>{work.category}</td>
                  <td>{work.year}</td>
                  <td>
                    <span className={`status-badge ${work.status}`}>
                      <span className="status-dot" /> {work.status}
                    </span>
                  </td>
                  <td>{work.views}</td>
                  <td className="actions-cell">
                    {work.status === 'pending' && (
                      <>
                        <button className="action-btn approve" onClick={() => handleApprove(work.id)} title="Approve">
                          <CheckCircle size={18} />
                        </button>
                        <button className="action-btn reject" onClick={() => handleReject(work.id)} title="Reject">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button className="action-btn edit" onClick={() => { setEditingWork(work); setShowForm(true); }} title="Edit">
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(work.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedWorks.length === 0 && <div className="no-data">{t('admin.projects.noData')}</div>}
          {sortedWorks.length > PAGE_SIZE && (
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
                <span className="pagination-count"> · {sortedWorks.length} results</span>
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
        <WorkForm
          work={editingWork}
          students={students}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingWork(null); }}
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

function WorkForm({ work, students, onSave, onCancel }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: work?.title || '',
    description: work?.description || '',
    full_description: work?.full_description || '',
    student_id: work?.student_id || '',
    category: work?.category || '',
    year: work?.year || new Date().getFullYear(),
    technologies: work?.technologies?.join(', ') || '',
    demo_url: work?.demo_url || '',
    github_url: work?.github_url || '',
    status: work?.status || 'pending'
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean)
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{work ? t('admin.projects.editTitle') : t('admin.projects.addTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('admin.projects.titleLabel')}</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('admin.projects.studentLabel')}</label>
            <select
              value={form.student_id}
              onChange={e => setForm({ ...form, student_id: e.target.value })}
              required
            >
              <option value="">{t('admin.projects.selectStudent')}</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.projects.categoryLabel')}</label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('admin.projects.yearLabel')}</label>
              <input
                type="number"
                value={form.year}
                onChange={e => setForm({ ...form, year: parseInt(e.target.value, 10) || '' })}
              />
            </div>
            <div className="form-group">
              <label>{t('admin.projects.statusLabel')}</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="pending">{t('admin.projects.pending')}</option>
                <option value="approved">{t('admin.projects.approved')}</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>{t('admin.projects.descriptionLabel')}</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('admin.projects.technologiesLabel')}</label>
            <input
              type="text"
              value={form.technologies}
              onChange={e => setForm({ ...form, technologies: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>{t('admin.projects.cancel')}</button>
            <button type="submit" className="save-btn">{t('admin.projects.save')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageProjects;
