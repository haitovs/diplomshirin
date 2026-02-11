import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    ChevronLeft, ChevronRight,
    ExternalLink,
    Eye,
    FileText,
    Github,
    Star,
    User
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ProjectCard from '../components/features/ProjectCard';
import { useData } from '../context/DataContext';
import { formatDate } from '../utils/helpers';
import './ProjectDetail.css';

function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProjectBySlug, getStudentById, getCategoryById, getProjectsByCategory } = useData();
  
  const project = getProjectBySlug(slug);
  const [activeImage, setActiveImage] = useState(0);

  if (!project) {
    return (
      <div className="not-found-container">
        <h2>Project not found</h2>
        <p>The project you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const student = getStudentById(project.studentId);
  const category = getCategoryById(project.categoryId);
  const relatedProjects = getProjectsByCategory(project.categoryId)
    .filter(p => p.id !== project.id)
    .slice(0, 3);

  const nextImage = () => {
    setActiveImage((prev) => 
      prev === project.screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImage((prev) => 
      prev === 0 ? project.screenshots.length - 1 : prev - 1
    );
  };

  return (
    <div className="project-detail-page">
      <div className="container">
        {/* Back Button */}
        <Link to="/projects" className="back-link">
          <ArrowLeft size={18} />
          Back to Projects
        </Link>

        {/* Header */}
        <motion.div 
          className="project-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="project-meta-badges">
            {category && (
              <Badge variant="primary" size="lg">
                {category.name}
              </Badge>
            )}
            {project.featured && (
              <Badge variant="warning" size="lg">
                <Star size={12} />
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="project-title">{project.title}</h1>
          
          <p className="project-short-desc">{project.description}</p>

          <div className="project-stats">
            <span className="stat">
              <Star size={18} />
              {project.rating} Rating
            </span>
            <span className="stat">
              <Eye size={18} />
              {project.views.toLocaleString()} Views
            </span>
            <span className="stat">
              <Calendar size={18} />
              {formatDate(project.createdAt)}
            </span>
          </div>
        </motion.div>

        <div className="project-layout">
          {/* Main Content */}
          <div className="project-main">
            {/* Image Gallery */}
            {project.screenshots?.length > 0 && (
            <motion.div 
              className="project-gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="gallery-main">
                <img 
                  src={project.screenshots[activeImage]} 
                  alt={`${project.title} screenshot ${activeImage + 1}`}
                />
                {project.screenshots.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={prevImage}>
                      <ChevronLeft size={24} />
                    </button>
                    <button className="gallery-nav next" onClick={nextImage}>
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>
              {project.screenshots.length > 1 && (
                <div className="gallery-thumbs">
                  {project.screenshots.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumb ${activeImage === idx ? 'active' : ''}`}
                      onClick={() => setActiveImage(idx)}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            )}

            {/* Description */}
            <motion.div 
              className="project-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2>About This Project</h2>
              <div className="description-content">
                {project.fullDescription.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            {/* Technologies */}
            <motion.div 
              className="project-technologies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2>Technologies Used</h2>
              <div className="tech-list">
                {project.technologies.map(tech => (
                  <Badge key={tech} variant="secondary" size="lg">
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="project-sidebar">
            {/* Action Buttons */}
            <motion.div 
              className="sidebar-card actions-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>Project Links</h3>
              <div className="action-buttons">
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" icon={ExternalLink} className="full-width">
                      Live Demo
                    </Button>
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" icon={Github} className="full-width">
                      Source Code
                    </Button>
                  </a>
                )}
                {project.documentationUrl && (
                  <a 
                    href={project.documentationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" icon={FileText} className="full-width">
                      Documentation
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>

            {/* Author Card */}
            {student && (
              <motion.div 
                className="sidebar-card author-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h3>Created By</h3>
                <Link to={`/students/${student.id}`} className="author-info">
                  <img 
                    src={student.avatar} 
                    alt={student.name} 
                    className="author-avatar"
                  />
                  <div className="author-details">
                    <span className="author-name">{student.name}</span>
                    <span className="author-dept">{student.department}</span>
                    <span className="author-year">Class of {student.graduationYear}</span>
                  </div>
                </Link>
                <Link to={`/students/${student.id}`}>
                  <Button variant="ghost" icon={User} className="full-width">
                    View Portfolio
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div 
            className="related-projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2>Related Projects</h2>
            <div className="related-grid">
              {relatedProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetail;
