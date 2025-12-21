import { motion } from 'framer-motion';
import { Edit2, Eye, Plus, Search, Star, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StudentForm from '../../components/features/StudentForm';
import { useData } from '../../context/DataContext';
import './ManageProjects.css';

function ManageStudents() {
  const { students, deleteStudent, getProjectsByStudent, updateStudent } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, student: null });
  const [formModal, setFormModal] = useState({ open: false, student: null });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteModal.student) {
      deleteStudent(deleteModal.student.id);
      setDeleteModal({ open: false, student: null });
    }
  };

  const toggleFeatured = (student) => {
    updateStudent(student.id, { featured: !student.featured });
  };

  const openAddForm = () => {
    setFormModal({ open: true, student: null });
  };

  const openEditForm = (student) => {
    setFormModal({ open: true, student });
  };

  const closeFormModal = () => {
    setFormModal({ open: false, student: null });
  };

  return (
    <div className="manage-students">
      <div className="page-header">
        <div>
          <h1>Manage Students</h1>
          <p>{students.length} students total</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddForm}>
          Add Student
        </Button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Department</th>
              <th>Year</th>
              <th>Projects</th>
              <th>GPA</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => {
              const projectCount = getProjectsByStudent(student.id).length;
              
              return (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td>
                    <div className="student-cell">
                      <img src={student.avatar} alt={student.name} />
                      <div>
                        <span className="student-name">{student.name}</span>
                        <span className="student-dept">{student.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant="secondary" size="sm">
                      {student.department}
                    </Badge>
                  </td>
                  <td>{student.graduationYear}</td>
                  <td>{projectCount}</td>
                  <td>{student.gpa || 'N/A'}</td>
                  <td>
                    <button 
                      className={`feature-toggle ${student.featured ? 'active' : ''}`}
                      onClick={() => toggleFeatured(student)}
                    >
                      <Star size={16} />
                    </button>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Link 
                        to={`/students/${student.id}`} 
                        className="action-btn view" 
                        title="View"
                        target="_blank"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        className="action-btn edit" 
                        title="Edit"
                        onClick={() => openEditForm(student)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Delete"
                        onClick={() => setDeleteModal({ open: true, student })}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredStudents.length === 0 && (
          <div className="empty-table">
            <p>No students found</p>
          </div>
        )}
      </div>

      {/* Student Form Modal */}
      <StudentForm
        isOpen={formModal.open}
        onClose={closeFormModal}
        student={formModal.student}
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, student: null })}
        title="Delete Student"
        size="sm"
      >
        <p>Are you sure you want to delete "<strong>{deleteModal.student?.name}</strong>"?</p>
        <p className="text-secondary" style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-tertiary)' }}>
          This will also remove all their projects.
        </p>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setDeleteModal({ open: false, student: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageStudents;
