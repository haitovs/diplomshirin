import { motion } from 'framer-motion';
import { Inbox, Users } from 'lucide-react';
import StudentCard from '../components/features/StudentCard';
import { useData } from '../context/DataContext';
import './Students.css';

function Students() {
  const { students } = useData();

  return (
    <motion.div
      className="students-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="page-icon">
            <Users size={32} />
          </div>
          <div>
            <h1 className="page-title">Student Profiles</h1>
            <p className="page-subtitle">
              Meet the talented students behind these amazing projects
            </p>
          </div>
        </div>

        {/* Students Grid */}
        {students.length > 0 ? (
          <div className="students-grid">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <StudentCard student={student} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox size={48} />
            </div>
            <h3>No students yet</h3>
            <p>Check back soon as new student profiles are added.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Students;
