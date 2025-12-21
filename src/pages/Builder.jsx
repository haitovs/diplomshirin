import { AnimatePresence, motion } from 'framer-motion';
import {
    Award,
    Briefcase,
    ChevronLeft,
    Code,
    Download,
    Eye,
    FileJson,
    FolderOpen,
    GraduationCap,
    Languages,
    Link as LinkIcon,
    Menu,
    RotateCcw,
    Settings,
    User,
    X
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BasicInfoEditor from '../components/builder/BasicInfoEditor';
import CertificationsEditor from '../components/builder/CertificationsEditor';
import EducationEditor from '../components/builder/EducationEditor';
import ExperienceEditor from '../components/builder/ExperienceEditor';
import LanguagesEditor from '../components/builder/LanguagesEditor';
import ProjectsEditor from '../components/builder/ProjectsEditor';
import SettingsEditor from '../components/builder/SettingsEditor';
import SkillsEditor from '../components/builder/SkillsEditor';
import SocialLinksEditor from '../components/builder/SocialLinksEditor';
import { usePortfolio } from '../context/PortfolioContext';
import './Builder.css';

const sections = [
  { id: 'basics', label: 'Basic Info', icon: User },
  { id: 'skills', label: 'Skills', icon: Code },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'socialLinks', label: 'Social Links', icon: LinkIcon },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const sectionComponents = {
  basics: BasicInfoEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  certifications: CertificationsEditor,
  languages: LanguagesEditor,
  socialLinks: SocialLinksEditor,
  settings: SettingsEditor
};

function Builder() {
  const { 
    activeSection, 
    setActiveSection, 
    portfolio,
    resetPortfolio,
    loadSamplePortfolio,
    exportJSON
  } = usePortfolio();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const ActiveEditor = sectionComponents[activeSection];
  const activeLabel = sections.find(s => s.id === activeSection)?.label;

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="builder-page">
      {/* Mobile Header */}
      <div className="builder-mobile-header">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="mobile-section-title">{activeLabel}</span>
        <Link to="/preview" className="mobile-preview-btn">
          <Eye size={20} />
        </Link>
      </div>

      {/* Sidebar */}
      <aside className={`builder-sidebar ${sidebarOpen ? 'open' : 'collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <FolderOpen size={24} />
            <span>Portfolio Builder</span>
          </Link>
          <button 
            className="sidebar-toggle desktop-only"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="sidebar-sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`section-btn ${activeSection === id ? 'active' : ''}`}
              onClick={() => handleSectionChange(id)}
            >
              <Icon size={20} />
              <span className="section-label">{label}</span>
              {id === 'basics' && portfolio.basics.name && (
                <span className="section-check">✓</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-actions">
          <Link to="/preview" className="action-btn preview-btn">
            <Eye size={18} />
            <span>Preview</span>
          </Link>
          <button className="action-btn" onClick={exportJSON}>
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <button 
            className="footer-btn" 
            onClick={loadSamplePortfolio}
            title="Load sample portfolio"
          >
            <FileJson size={16} />
            <span>Load Sample</span>
          </button>
          <button 
            className="footer-btn danger" 
            onClick={() => {
              if (confirm('Reset portfolio to empty? This cannot be undone.')) {
                resetPortfolio();
              }
            }}
            title="Reset to empty"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="builder-main">
        <div className="builder-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="editor-wrapper"
            >
              <div className="editor-header">
                <h1>{activeLabel}</h1>
                <p className="editor-description">
                  {getEditorDescription(activeSection)}
                </p>
              </div>
              
              <ActiveEditor />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function getEditorDescription(section) {
  const descriptions = {
    basics: 'Add your personal information and professional summary',
    skills: 'List your technical and soft skills with proficiency levels',
    projects: 'Showcase your best projects with descriptions and links',
    experience: 'Add your work history and professional experience',
    education: 'Include your educational background and achievements',
    certifications: 'Add professional certifications and courses',
    languages: 'List languages you speak and your proficiency',
    socialLinks: 'Connect your social media and professional profiles',
    settings: 'Customize your portfolio appearance and template'
  };
  return descriptions[section] || '';
}

export default Builder;
