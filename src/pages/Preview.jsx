import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Edit,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Twitter
} from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { usePortfolio } from '../context/PortfolioContext';
import './Preview.css';

function Preview() {
  const { portfolio, exportJSON } = usePortfolio();
  const { basics, skills, projects, experience, education, certifications, languages, socialLinks, settings } = portfolio;
  const previewRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    const element = previewRef.current;
    if (!element || isExporting) return;

    setIsExporting(true);

    try {
      // Dynamic import for PDF libraries
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Clone the element to apply inline styles
      const clone = element.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.width = element.offsetWidth + 'px';
      document.body.appendChild(clone);

      // Get accent color value
      const accentColor = settings.primaryColor || '#4F46E5';
      
      // Apply inline styles to clone for PDF rendering
      const header = clone.querySelector('.portfolio-header');
      if (header) {
        header.style.background = `linear-gradient(135deg, ${accentColor} 0%, #3730a3 100%)`;
        header.style.padding = '40px';
        header.style.color = 'white';
      }

      // Fix header content flexbox
      const headerContent = clone.querySelector('.header-content');
      if (headerContent) {
        headerContent.style.display = 'flex';
        headerContent.style.alignItems = 'center';
        headerContent.style.gap = '32px';
      }

      // Fix avatar image
      const avatar = clone.querySelector('.portfolio-avatar');
      if (avatar) {
        avatar.style.width = '120px';
        avatar.style.height = '120px';
        avatar.style.borderRadius = '50%';
        avatar.style.objectFit = 'cover';
        avatar.style.border = '4px solid rgba(255, 255, 255, 0.3)';
        avatar.style.flexShrink = '0';
        avatar.style.display = 'block';
      }

      // Apply skill bar colors
      const skillFills = clone.querySelectorAll('.skill-fill');
      skillFills.forEach(fill => {
        fill.style.backgroundColor = accentColor;
        fill.style.height = '6px';
        fill.style.borderRadius = '9999px';
      });

      // Fix skill items
      const skillItems = clone.querySelectorAll('.skill-item');
      skillItems.forEach(item => {
        item.style.padding = '12px';
        item.style.background = '#f9fafb';
        item.style.borderRadius = '8px';
      });

      // Apply section header colors
      const sectionHeaders = clone.querySelectorAll('.portfolio-section h2');
      sectionHeaders.forEach(h2 => {
        h2.style.color = accentColor;
        h2.style.borderBottom = `2px solid ${accentColor}`;
        h2.style.paddingBottom = '12px';
        h2.style.marginBottom = '20px';
        h2.style.display = 'inline-block';
      });

      // Fix badges - center text
      const badges = clone.querySelectorAll('.badge');
      badges.forEach(badge => {
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.padding = '4px 12px';
        badge.style.borderRadius = '9999px';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = '500';
        badge.style.background = '#f3f4f6';
        badge.style.color = '#4b5563';
        badge.style.lineHeight = '1.5';
      });

      // Fix tech tags container
      const techTags = clone.querySelectorAll('.tech-tags');
      techTags.forEach(container => {
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '8px';
      });

      // Apply timeline dot colors
      const timelineItems = clone.querySelectorAll('.timeline-item');
      timelineItems.forEach(item => {
        item.style.position = 'relative';
        item.style.paddingLeft = '24px';
        item.style.borderLeft = '2px solid #e5e7eb';
      });

      // Fix social links
      const socialLinks = clone.querySelectorAll('.social-links-preview a');
      socialLinks.forEach(link => {
        link.style.display = 'flex';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
        link.style.width = '36px';
        link.style.height = '36px';
        link.style.background = 'rgba(255, 255, 255, 0.2)';
        link.style.borderRadius = '50%';
      });

      // Capture the clone as canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.offsetWidth,
        height: element.scrollHeight
      });

      // Remove clone
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate dimensions to fit page width
      const ratio = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      // Handle multi-page PDFs
      let heightLeft = scaledHeight;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(
          imgData, 
          'PNG', 
          0, 
          position, 
          pdfWidth, 
          scaledHeight
        );
        
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        page++;
      }

      pdf.save(`${basics.name || 'portfolio'}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    } finally {
      setIsExporting(false);
    }
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
          <Button 
            variant="primary" 
            icon={isExporting ? Loader2 : Download} 
            onClick={handleExportPDF}
            disabled={isExporting}
          >
            {isExporting ? 'Generating...' : 'Download PDF'}
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
                          {project.technologies.map((tech, idx) => (
                            <Badge key={`${tech}-${idx}`} variant="neutral" size="sm">{tech}</Badge>
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
