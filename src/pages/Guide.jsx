import { motion } from 'framer-motion';
import {
  Archive,
  BarChart3,
  BookOpen,
  Compass,
  Eye,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Palette,
  Search,
  Send,
  Shield,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Guide.css';

const publicPages = [
  { key: 'home', icon: Compass, color: '#6366f1' },
  { key: 'archive', icon: Archive, color: '#0891b2' },
  { key: 'submit', icon: Send, color: '#8b5cf6' },
  { key: 'builder', icon: Palette, color: '#f59e0b' },
  { key: 'preview', icon: Eye, color: '#10b981' },
];

const adminPages = [
  { key: 'dashboard', icon: BarChart3, color: '#6366f1' },
  { key: 'projects', icon: FolderOpen, color: '#0891b2' },
  { key: 'students', icon: Users, color: '#8b5cf6' },
  { key: 'similarity', icon: Shield, color: '#ef4444' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function Guide() {
  const { t } = useTranslation();

  return (
    <div className="guide-page">
      {/* Hero */}
      <section className="guide-hero">
        <motion.div
          className="guide-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="guide-hero-badge">
            <BookOpen size={14} />
            <span>{t('guide.badge')}</span>
          </div>
          <h1>{t('guide.title')}</h1>
          <p>{t('guide.subtitle')}</p>
        </motion.div>
      </section>

      <div className="guide-container">
        {/* Public Pages Section */}
        <section className="guide-section">
          <motion.div
            className="guide-section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="section-number">01</span>
            <div>
              <h2>{t('guide.publicPages.title')}</h2>
              <p>{t('guide.publicPages.subtitle')}</p>
            </div>
          </motion.div>

          <div className="guide-cards">
            {publicPages.map((page, i) => (
              <motion.article
                key={page.key}
                className="guide-card"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
              >
                <div className="guide-card-icon" style={{ '--card-accent': page.color }}>
                  <page.icon size={24} />
                </div>
                <div className="guide-card-body">
                  <h3>{t(`guide.pages.${page.key}.title`)}</h3>
                  <p className="guide-card-what">
                    <strong>{t('guide.whatItDoes')}</strong>
                    {t(`guide.pages.${page.key}.what`)}
                  </p>
                  <p className="guide-card-why">
                    <strong>{t('guide.whyNeeded')}</strong>
                    {t(`guide.pages.${page.key}.why`)}
                  </p>
                </div>
                <div className="guide-card-number" style={{ color: page.color }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="guide-divider">
          <div className="guide-divider-line" />
          <div className="guide-divider-badge">
            <LayoutDashboard size={16} />
            <span>{t('guide.adminSection')}</span>
          </div>
          <div className="guide-divider-line" />
        </div>

        {/* Admin Pages Section */}
        <section className="guide-section">
          <motion.div
            className="guide-section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="section-number">02</span>
            <div>
              <h2>{t('guide.adminPages.title')}</h2>
              <p>{t('guide.adminPages.subtitle')}</p>
            </div>
          </motion.div>

          <div className="guide-cards">
            {adminPages.map((page, i) => (
              <motion.article
                key={page.key}
                className="guide-card"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
              >
                <div className="guide-card-icon" style={{ '--card-accent': page.color }}>
                  <page.icon size={24} />
                </div>
                <div className="guide-card-body">
                  <h3>{t(`guide.admin.${page.key}.title`)}</h3>
                  <p className="guide-card-what">
                    <strong>{t('guide.whatItDoes')}</strong>
                    {t(`guide.admin.${page.key}.what`)}
                  </p>
                  <p className="guide-card-why">
                    <strong>{t('guide.whyNeeded')}</strong>
                    {t(`guide.admin.${page.key}.why`)}
                  </p>
                </div>
                <div className="guide-card-number" style={{ color: page.color }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Footer Note */}
        <motion.div
          className="guide-footer-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <GraduationCap size={20} />
          <p>{t('guide.footerNote')}</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Guide;
