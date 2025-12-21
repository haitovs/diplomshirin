import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import StudentCard from '../components/features/StudentCard';
import { useData } from '../context/DataContext';
import './Students.css';

function Students() {
  const { students } = useData();

  return (
    <div className="students-page">
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
      </div>
    </div>
  );
}

export default Students;
