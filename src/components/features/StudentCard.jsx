import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Badge from '../common/Badge';
import './StudentCard.css';

function StudentCard({ student }) {
  const { getProjectsByStudent } = useData();
  const projectCount = getProjectsByStudent(student.id).length;

  return (
    <article className="student-card">
      {/* Avatar */}
      <Link to={`/students/${student.id}`} className="student-card-avatar">
        <img src={student.avatar} alt={student.name} />
        {student.featured && (
          <span className="featured-indicator" title="Featured Student" />
        )}
      </Link>

      {/* Info */}
      <div className="student-card-info">
        <Link to={`/students/${student.id}`}>
          <h3 className="student-card-name">{student.name}</h3>
        </Link>
        <p className="student-card-department">{student.department}</p>
        <p className="student-card-year">Class of {student.graduationYear}</p>
      </div>

      {/* Skills */}
      <div className="student-card-skills">
        {student.skills.slice(0, 4).map(skill => (
          <Badge key={skill} variant="neutral" size="sm">
            {skill}
          </Badge>
        ))}
        {student.skills.length > 4 && (
          <Badge variant="neutral" size="sm">
            +{student.skills.length - 4}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="student-card-stats">
        <div className="stat-item">
          <span className="stat-value">{projectCount}</span>
          <span className="stat-label">Projects</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{student.gpa}</span>
          <span className="stat-label">GPA</span>
        </div>
      </div>

      {/* Social Links */}
      <div className="student-card-social">
        {student.github && (
          <a 
            href={student.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn"
            title="GitHub"
          >
            <Github size={18} />
          </a>
        )}
        {student.linkedin && (
          <a 
            href={student.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn"
            title="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
        )}
        {student.portfolio && (
          <a 
            href={student.portfolio} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-btn"
            title="Portfolio"
          >
            <ExternalLink size={18} />
          </a>
        )}
        <a 
          href={`mailto:${student.email}`}
          className="social-btn"
          title="Email"
        >
          <Mail size={18} />
        </a>
      </div>

      {/* CTA */}
      <Link to={`/students/${student.id}`} className="student-card-cta">
        View Portfolio
      </Link>
    </article>
  );
}

export default StudentCard;
