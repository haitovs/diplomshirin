import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Award,
    Calendar,
    ExternalLink,
    FolderOpen,
    Github,
    GraduationCap,
    Linkedin,
    Mail
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ProjectCard from '../components/features/ProjectCard';
import { useData } from '../context/DataContext';
import './StudentPortfolio.css';

function StudentPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, getProjectsByStudent } = useData();
  
  const student = getStudentById(id);
  const projects = getProjectsByStudent(id);

  if (!student) {
    return (
      <div className="not-found-container">
        <h2>Student not found</h2>
        <p>The student you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/students')}>
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="student-portfolio-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        {/* Back Link */}
        <Link to="/students" className="back-link">
          <ArrowLeft size={18} />
          Back to Students
        </Link>

        {/* Profile Header */}
        <motion.div 
          className="profile-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-avatar-container">
            <img
              src={student.avatar}
              alt={student.name}
              className="profile-avatar"
              loading="lazy"
            />
            {student.featured && (
              <div className="featured-badge">
                <Award size={16} />
              </div>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{student.name}</h1>
            <div className="profile-meta">
              <span className="meta-item">
                <GraduationCap size={18} />
                {student.department}
              </span>
              <span className="meta-item">
                <Calendar size={18} />
                Class of {student.graduationYear}
              </span>
              <span className="meta-item">
                <FolderOpen size={18} />
                {projects.length} Projects
              </span>
            </div>
            <p className="profile-bio">{student.bio}</p>
            
            {/* Social Links */}
            <div className="profile-social">
              {student.github && (
                <a 
                  href={student.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" icon={Github} size="sm">
                    GitHub
                  </Button>
                </a>
              )}
              {student.linkedin && (
                <a 
                  href={student.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" icon={Linkedin} size="sm">
                    LinkedIn
                  </Button>
                </a>
              )}
              {student.portfolio && (
                <a 
                  href={student.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" icon={ExternalLink} size="sm">
                    Portfolio
                  </Button>
                </a>
              )}
              <a href={`mailto:${student.email}`}>
                <Button variant="primary" icon={Mail} size="sm">
                  Contact
                </Button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="skills-list">
            {student.skills.map(skill => (
              <Badge key={skill} variant="primary" size="lg">
                {skill}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div 
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="section-title">Projects ({projects.length})</h2>
          {projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-projects">
              <p>No projects yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default StudentPortfolio;
