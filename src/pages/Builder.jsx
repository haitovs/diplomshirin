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
    Loader2,
    Menu,
    RotateCcw,
    Settings,
    Upload,
    User,
    X
} from 'lucide-react';
import { useRef, useState } from 'react';
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
    exportJSON,
    importJSON
  } = usePortfolio();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  const ActiveEditor = sectionComponents[activeSection];
  const activeLabel = sections.find(s => s.id === activeSection)?.label;

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const success = importJSON(ev.target.result);
      if (!success) alert('Invalid JSON file');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDownloadPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Build a temporary preview element
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '800px';
      container.style.background = 'white';
      container.style.color = '#1f2937';
      container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      document.body.appendChild(container);

      const { basics, skills, projects, experience, education, certifications, languages: langs, socialLinks, settings } = portfolio;
      const accent = settings.primaryColor || '#4F46E5';

      container.innerHTML = `
        <div style="background: linear-gradient(135deg, ${accent} 0%, #3730a3 100%); padding: 40px; color: white;">
          <div style="display: flex; align-items: center; gap: 24px;">
            ${settings.showPhoto && basics.avatar ? `<img src="${basics.avatar}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.3);" />` : ''}
            <div>
              <h1 style="margin:0 0 4px;font-size:28px;font-weight:300;">${basics.name || 'Your Name'}</h1>
              <p style="margin:0 0 8px;font-size:16px;opacity:0.9;">${basics.title || ''}</p>
              <div style="display:flex;gap:16px;font-size:13px;opacity:0.85;flex-wrap:wrap;">
                ${basics.email ? `<span>${basics.email}</span>` : ''}
                ${basics.phone ? `<span>${basics.phone}</span>` : ''}
                ${basics.location ? `<span>${basics.location}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
        ${basics.summary ? `<div style="padding:24px 32px;border-bottom:1px solid #e5e7eb;"><h2 style="color:${accent};font-size:18px;margin:0 0 8px;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">About Me</h2><p style="color:#4b5563;line-height:1.6;margin:0;">${basics.summary}</p></div>` : ''}
        ${skills.length ? `<div style="padding:24px 32px;border-bottom:1px solid #e5e7eb;"><h2 style="color:${accent};font-size:18px;margin:0 0 12px;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Skills</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">${skills.map(s => `<div style="background:#f9fafb;padding:8px 12px;border-radius:6px;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="font-weight:500;">${s.name}</span><span style="font-size:13px;color:#6b7280;">${s.level}%</span></div><div style="height:5px;background:#e5e7eb;border-radius:99px;overflow:hidden;"><div style="height:100%;width:${s.level}%;background:${accent};border-radius:99px;"></div></div></div>`).join('')}</div></div>` : ''}
        ${experience.length ? `<div style="padding:24px 32px;border-bottom:1px solid #e5e7eb;"><h2 style="color:${accent};font-size:18px;margin:0 0 12px;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Experience</h2>${experience.map(e => `<div style="padding-left:16px;border-left:2px solid #e5e7eb;margin-bottom:16px;"><div style="display:flex;justify-content:space-between;"><div><strong style="font-size:16px;">${e.role}</strong><p style="color:#6b7280;margin:2px 0 0;">${e.company}</p></div><span style="font-size:13px;color:#9ca3af;white-space:nowrap;">${e.startDate || ''} - ${e.current ? 'Present' : e.endDate || ''}</span></div>${e.description ? `<p style="color:#4b5563;margin:8px 0 0;line-height:1.6;">${e.description}</p>` : ''}</div>`).join('')}</div>` : ''}
        ${projects.length ? `<div style="padding:24px 32px;border-bottom:1px solid #e5e7eb;"><h2 style="color:${accent};font-size:18px;margin:0 0 12px;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Projects</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">${projects.map(p => `<div style="background:#f9fafb;border-radius:8px;overflow:hidden;">${p.image ? `<img src="${p.image}" style="width:100%;height:120px;object-fit:cover;" />` : ''}<div style="padding:12px;"><strong>${p.title}</strong><p style="font-size:13px;color:#6b7280;margin:4px 0 8px;line-height:1.5;">${p.description || ''}</p><div style="display:flex;flex-wrap:wrap;gap:4px;">${(p.technologies || []).map(t => `<span style="background:#e5e7eb;padding:2px 8px;border-radius:99px;font-size:11px;color:#4b5563;">${t}</span>`).join('')}</div></div></div>`).join('')}</div></div>` : ''}
        ${education.length ? `<div style="padding:24px 32px;border-bottom:1px solid #e5e7eb;"><h2 style="color:${accent};font-size:18px;margin:0 0 12px;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Education</h2>${education.map(e => `<div style="margin-bottom:12px;"><strong style="font-size:16px;">${e.school}</strong><p style="color:#6b7280;margin:2px 0 0;">${e.degree}${e.field ? ' in ' + e.field : ''}</p><span style="font-size:13px;color:#9ca3af;">${e.year || ''}${e.gpa ? ' • GPA: ' + e.gpa : ''}</span></div>`).join('')}</div>` : ''}
        ${certifications.length ? `<div style="padding:24px 32px;border-bottom:1px solid #e5e7eb;"><h2 style="color:${accent};font-size:18px;margin:0 0 12px;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Certifications</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">${certifications.map(c => `<div style="background:#f9fafb;padding:12px;border-radius:6px;"><strong>${c.name}</strong><p style="font-size:13px;color:#6b7280;margin:2px 0 0;">${c.issuer}${c.year ? ' • ' + c.year : ''}</p></div>`).join('')}</div></div>` : ''}
        ${langs.length ? `<div style="padding:24px 32px;"><h2 style="color:${accent};font-size:18px;margin:0 0 12px;border-bottom:2px solid ${accent};display:inline-block;padding-bottom:4px;">Languages</h2><div style="display:flex;flex-wrap:wrap;gap:8px;">${langs.map(l => `<span style="background:#f9fafb;padding:6px 16px;border-radius:99px;font-weight:500;">${l.name} <small style="color:#6b7280;font-weight:normal;">(${l.level})</small></span>`).join('')}</div></div>` : ''}
      `;

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 800,
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = pdfWidth / canvas.width;
      const scaledHeight = canvas.height * ratio;
      let heightLeft = scaledHeight;
      let position = 0;
      let page = 0;

      while (heightLeft > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
        heightLeft -= pdfHeight;
        position -= pdfHeight;
        page++;
      }

      pdf.save(`${basics.name || 'portfolio'}_resume.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Error generating PDF: ' + error.message);
    } finally {
      setIsExporting(false);
    }
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
        {/* Top Toolbar */}
        <div className="builder-toolbar">
          <div className="toolbar-left">
            <h2 className="toolbar-title">{activeLabel}</h2>
          </div>
          <div className="toolbar-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              style={{ display: 'none' }}
            />
            <button className="toolbar-btn" onClick={() => fileInputRef.current?.click()} title="Import JSON">
              <Upload size={16} />
              <span>Import</span>
            </button>
            <button className="toolbar-btn" onClick={exportJSON} title="Export JSON">
              <FileJson size={16} />
              <span>Export JSON</span>
            </button>
            <button
              className="toolbar-btn toolbar-btn-primary"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              title="Download PDF"
            >
              {isExporting ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
              <span>{isExporting ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

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
