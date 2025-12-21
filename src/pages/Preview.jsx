import { motion } from 'framer-motion';
import {
    ArrowLeft, Download, Edit,
    ExternalLink,
    Github,
    Globe,
    Linkedin,
    Mail,
    MapPin,
    Phone,
    Twitter
} from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { usePortfolio } from '../context/PortfolioContext';
import './Preview.css';

function Preview() {
  const { portfolio, exportJSON } = usePortfolio();
  const { basics, skills, projects, experience, education, certifications, languages, socialLinks, settings } = portfolio;
  const previewRef = useRef(null);

  const handleExportPDF = () => {
    // Use browser's print functionality which can save as PDF
    // This works without additional dependencies
    const printContent = previewRef.current;
    if (!printContent) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    // Get all stylesheets
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${basics.name || 'Portfolio'} - Resume</title>
          <style>
            ${styles}
            @media print {
              body { margin: 0; padding: 20px; }
              .portfolio-preview { box-shadow: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSocialIcon = (platform) => {
    const icons = { GitHub: Github, LinkedIn: Linkedin, Twitter: Twitter, Portfolio: Globe };
    return icons[platform] || Globe;
  };

  return (
    <div className="preview-page">
      {/* Header Actions */}
      <div className="preview-actions">
        <Link to="/builder" className="back-link">
          <ArrowLeft size={20} />
          Back to Editor
        </Link>
        <div className="action-buttons">
          <Button variant="outline" icon={Edit} onClick={() => window.location.href = '/builder'}>
            Edit
          </Button>
          <Button variant="outline" onClick={exportJSON}>
            Export JSON
          </Button>
          <Button variant="primary" icon={Download} onClick={handleExportPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <motion.div 
        className="preview-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          ref={previewRef} 
          className={`portfolio-preview template-${settings.template}`}
          style={{ '--accent-color': settings.primaryColor }}
        >
          {/* Header / Hero */}
          <header className="portfolio-header">
            <div className="header-content">
              {settings.showPhoto && basics.avatar && (
                <img 
                  src={basics.avatar} 
                  alt={basics.name}
                  className="portfolio-avatar"
                />
              )}
              <div className="header-info">
                <h1 className="portfolio-name">{basics.name || 'Your Name'}</h1>
                <p className="portfolio-title">{basics.title || 'Your Professional Title'}</p>
                
                <div className="contact-info">
                  {basics.email && (
                    <span><Mail size={14} /> {basics.email}</span>
                  )}
                  {basics.phone && (
                    <span><Phone size={14} /> {basics.phone}</span>
                  )}
                  {basics.location && (
                    <span><MapPin size={14} /> {basics.location}</span>
                  )}
                </div>

                {socialLinks.length > 0 && (
                  <div className="social-links-preview">
                    {socialLinks.map(link => {
                      const Icon = getSocialIcon(link.platform);
                      return (
                        <a 
                          key={link.id} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title={link.platform}
                        >
                          <Icon size={18} />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Summary */}
          {basics.summary && (
            <section className="portfolio-section">
              <h2>About Me</h2>
              <p className="summary-text">{basics.summary}</p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="portfolio-section">
              <h2>Skills</h2>
              <div className="skills-grid">
                {skills.map(skill => (
                  <div key={skill.id} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-fill" 
                        style={{ width: `${skill.level}%`, backgroundColor: settings.primaryColor }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="portfolio-section">
              <h2>Experience</h2>
              <div className="timeline">
                {experience.map(exp => (
                  <div key={exp.id} className="timeline-item">
                    <div className="timeline-header">
                      <div>
                        <h3>{exp.role}</h3>
                        <p className="company">{exp.company}</p>
                      </div>
                      <span className="date">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.description && <p className="description">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="portfolio-section">
              <h2>Projects</h2>
              <div className="projects-grid">
                {projects.map(project => (
                  <div key={project.id} className="project-item">
                    {project.image && (
                      <img src={project.image} alt={project.title} className="project-image" />
                    )}
                    <div className="project-content">
                      <h3>
                        {project.title}
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </h3>
                      <p>{project.description}</p>
                      {project.technologies?.length > 0 && (
                        <div className="tech-tags">
                          {project.technologies.map(tech => (
                            <Badge key={tech} variant="neutral" size="sm">{tech}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="portfolio-section">
              <h2>Education</h2>
              <div className="education-list">
                {education.map(edu => (
                  <div key={edu.id} className="education-item">
                    <h3>{edu.school}</h3>
                    <p>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                    <span className="date">{edu.year}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="portfolio-section">
              <h2>Certifications</h2>
              <div className="certifications-list">
                {certifications.map(cert => (
                  <div key={cert.id} className="cert-item">
                    <h4>{cert.name}</h4>
                    <p>{cert.issuer}{cert.year ? ` • ${cert.year}` : ''}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="portfolio-section">
              <h2>Languages</h2>
              <div className="languages-list">
                {languages.map(lang => (
                  <span key={lang.id} className="language-item">
                    {lang.name} <small>({lang.level})</small>
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Preview;
