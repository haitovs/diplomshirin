import { CheckCircle, Edit, Plus, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { diplomaWorksAPI, studentsAPI } from '../../services/api';
import './ManageProjects.css';

function ManageProjects() {
  const [works, setWorks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [editingWork, setEditingWork] = useState(null);
  const [showForm, setShowForm] = useState(false);

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
    if (!confirm('Are you sure you want to delete this work?')) return;
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
        <h1>📁 Manage Diploma Works</h1>
        <button className="add-btn" onClick={() => { setEditingWork(null); setShowForm(true); }}>
          <Plus size={20} /> Add New
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
      </div>

      {/* Works Table */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="works-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Student</th>
                <th>Category</th>
                <th>Year</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {works.map(work => (
                <tr key={work.id}>
                  <td className="title-cell">{work.title}</td>
                  <td>{work.student_name || getStudentName(work.student_id)}</td>
                  <td>{work.category}</td>
                  <td>{work.year}</td>
                  <td>
                    <span className={`status-badge ${work.status}`}>{work.status}</span>
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
          {works.length === 0 && <div className="no-data">No diploma works found</div>}
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

function WorkForm({ work, students, onSave, onCancel }) {
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
        <h2>{work ? 'Edit Work' : 'Add New Work'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Student *</label>
            <select
              value={form.student_id}
              onChange={e => setForm({ ...form, student_id: e.target.value })}
              required
            >
              <option value="">Select student</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              required
            />
          </div>
          <div className="form-group">
            <label>Technologies (comma-separated)</label>
            <input
              type="text"
              value={form.technologies}
              onChange={e => setForm({ ...form, technologies: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="save-btn">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManageProjects;
