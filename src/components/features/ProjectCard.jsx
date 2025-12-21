import { ExternalLink, Eye, Github, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { truncateText } from '../../utils/helpers';
import Badge from '../common/Badge';
import './ProjectCard.css';

function ProjectCard({ project, featured = false }) {
  const { getStudentById, getCategoryById } = useData();
  
  const student = getStudentById(project.studentId);
  const category = getCategoryById(project.categoryId);

  return (
    <article className={`project-card ${featured ? 'project-card-featured' : ''}`}>
      {/* Image */}
      <Link to={`/projects/${project.slug}`} className="project-card-image">
        <img 
          src={project.screenshots[0]} 
          alt={project.title}
          loading="lazy"
        />
        {project.featured && (
          <span className="featured-badge">
            <Star size={12} />
            Featured
          </span>
        )}
        <div className="project-card-overlay">
          <span className="view-project">View Project</span>
        </div>
      </Link>

      {/* Content */}
      <div className="project-card-content">
        {/* Category Badge */}
        {category && (
          <Badge 
            variant="primary" 
            size="sm"
            style={{ '--badge-color': category.color }}
            className="category-badge"
          >
            {category.name}
          </Badge>
        )}

        {/* Title */}
        <Link to={`/projects/${project.slug}`}>
          <h3 className="project-card-title">{project.title}</h3>
        </Link>

        {/* Description */}
        <p className="project-card-description">
          {truncateText(project.description, 120)}
        </p>

        {/* Technologies */}
        <div className="project-card-techs">
          {project.technologies.slice(0, 4).map(tech => (
            <Badge key={tech} variant="neutral" size="sm">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="neutral" size="sm">
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>

        {/* Author & Meta */}
        <div className="project-card-footer">
          {student && (
            <Link to={`/students/${student.id}`} className="project-card-author">
              <img src={student.avatar} alt={student.name} />
              <span>{student.name}</span>
            </Link>
          )}
          
          <div className="project-card-meta">
            <span className="meta-item">
              <Star size={14} />
              {project.rating}
            </span>
            <span className="meta-item">
              <Eye size={14} />
              {project.views}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="project-card-links">
        {project.demoUrl && (
          <a 
            href={project.demoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="quick-link"
            title="Live Demo"
          >
            <ExternalLink size={16} />
          </a>
        )}
        {project.githubUrl && (
          <a 
            href={project.githubUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="quick-link"
            title="GitHub"
          >
            <Github size={16} />
          </a>
        )}
      </div>
    </article>
  );
}

export default ProjectCard;
