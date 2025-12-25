import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { studentsAPI } from '../../services/api';
import './ManageProjects.css'; // Reuse same styles

function ManageStudents() {
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
    if (!confirm('Are you sure you want to delete this student?')) return;
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
        <h1>👥 Manage Students</h1>
        <button className="add-btn" onClick={() => { setEditingStudent(null); setShowForm(true); }}>
          <Plus size={20} /> Add Student
        </button>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="works-table">
          <table>
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>Skills</th>
                <th>Actions</th>
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
                    <button className="action-btn edit" onClick={() => { setEditingStudent(student); setShowForm(true); }} title="Edit">
                      <Edit size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(student.id)} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && <div className="no-data">No students found</div>}
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
        <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
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
              <label>Department</label>
              <input
                type="text"
                value={form.department}
                onChange={e => setForm({ ...form, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input
                type="number"
                value={form.graduation_year}
                onChange={e => setForm({ ...form, graduation_year: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Skills (comma-separated)</label>
            <input
              type="text"
              value={form.skills}
              onChange={e => setForm({ ...form, skills: e.target.value })}
              placeholder="React, Python, Machine Learning..."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                value={form.linkedin}
                onChange={e => setForm({ ...form, linkedin: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>GitHub</label>
              <input
                type="url"
                value={form.github}
                onChange={e => setForm({ ...form, github: e.target.value })}
              />
            </div>
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

export default ManageStudents;
