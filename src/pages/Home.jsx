import { motion } from 'framer-motion';
import {
    ArrowRight,
    BookOpen,
    CheckCircle,
    Database,
    FileSearch,
    GraduationCap,
    Layers,
    Palette,
    Search,
    Shield,
    Upload,
    Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './Home.css';

const featureKeys = [
  { key: 'similarityDetection', icon: Shield },
  { key: 'centralizedArchive', icon: Database },
  { key: 'deepComparison', icon: FileSearch },
  { key: 'studentProfiles', icon: Users },
  { key: 'adminApproval', icon: Layers },
  { key: 'smartSearch', icon: Search },
];

const stepKeys = [
  { num: 1, key: 'submit', icon: Upload },
  { num: 2, key: 'similarity', icon: Shield },
  { num: 3, key: 'review', icon: CheckCircle },
];

function Home() {
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-badge">
              <GraduationCap size={14} /> {t('home.badge')}
            </span>
            <h1>
              {t('home.heroTitle1')}
              <span className="gradient-text"> {t('home.heroTitle2')}</span>
              <span className="hero-ampersand">{t('home.heroAmpersand')}</span>
              {t('home.heroTitle3')}
              <span className="gradient-text"> {t('home.heroTitle4')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('home.subtitle')}
            </p>
            <div className="hero-actions">
              <Link to="/archive">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  {t('home.browseArchive')}
                </Button>
              </Link>
              <Link to="/student-login">
                <Button variant="outline" size="lg">
                  {t('home.studentLogin')}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="preview-mockup">
              <div className="mockup-header">
                <span></span><span></span><span></span>
              </div>
              <div className="mockup-content">
                <div className="mockup-sidebar">
                  <div className="sidebar-item active"></div>
                  <div className="sidebar-item"></div>
                  <div className="sidebar-item"></div>
                  <div className="sidebar-item"></div>
                </div>
                <div className="mockup-main">
                  <div className="mockup-stats">
                    <div className="mock-stat"></div>
                    <div className="mock-stat accent"></div>
                    <div className="mock-stat"></div>
                  </div>
                  <div className="mockup-form">
                    <div className="form-field"></div>
                    <div className="form-field large"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-title">{t('home.howItWorks')}</h2>
          <div className="steps-grid">
            {stepKeys.map((step, index) => (
              <motion.div
                key={step.num}
                className="step-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <span className="step-number">{step.num}</span>
                <h3>{t(`home.steps.${step.key}.title`)}</h3>
                <p>{t(`home.steps.${step.key}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">{t('home.platformCapabilities')}</h2>
          <div className="features-grid">
            {featureKeys.map((feature, index) => (
              <motion.div
                key={feature.key}
                className="feature-card"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{t(`home.features.${feature.key}.title`)}</h3>
                <p>{t(`home.features.${feature.key}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Primary */}
      <section className="cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>{t('home.cta.title')}</h2>
            <p>{t('home.cta.description')}</p>
            <Link to="/student-login">
              <Button variant="outline" size="lg" className="cta-btn-white" icon={ArrowRight} iconPosition="right">
                {t('home.cta.button')}
              </Button>
            </Link>
            <div className="cta-features">
              <span><CheckCircle size={16} /> {t('home.cta.similarityChecking')}</span>
              <span><CheckCircle size={16} /> {t('home.cta.fullTextSearch')}</span>
              <span><CheckCircle size={16} /> {t('home.cta.adminReview')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Secondary: Portfolio Builder */}
      <section className="secondary-section">
        <div className="container">
          <motion.div
            className="secondary-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="secondary-icon">
              <Palette size={28} />
            </div>
            <div className="secondary-content">
              <h3>{t('home.portfolio.title')}</h3>
              <p>{t('home.portfolio.description')}</p>
            </div>
            <div className="secondary-actions">
              <Link to="/builder">
                <Button variant="outline" size="lg" icon={BookOpen} iconPosition="left">
                  {t('home.portfolio.button')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
