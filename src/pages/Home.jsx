import { motion } from 'framer-motion';
import {
    ArrowRight, CheckCircle,
    Download,
    FileText, Palette,
    Shield, Smartphone,
    Star,
    Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './Home.css';

const features = [
  {
    icon: FileText,
    title: 'Rich Content Sections',
    description: 'Add skills, projects, experience, education, certifications, and more'
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from modern, classic, or minimal designs with custom colors'
  },
  {
    icon: Download,
    title: 'Export to PDF',
    description: 'Download your portfolio as a professional PDF ready to share'
  },
  {
    icon: Zap,
    title: 'Real-time Preview',
    description: 'See changes instantly as you build your portfolio'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data stays in your browser - no account needed'
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Looks great on any device, from mobile to desktop'
  }
];

const steps = [
  { num: 1, title: 'Add Your Info', desc: 'Fill in your personal details, skills, and experience' },
  { num: 2, title: 'Customize Design', desc: 'Pick a template and accent color that fits your style' },
  { num: 3, title: 'Export & Share', desc: 'Download as PDF or share your portfolio link' }
];

function Home() {
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
              <Star size={14} /> Free Portfolio Builder
            </span>
            <h1>
              Build Your Professional
              <span className="gradient-text"> Portfolio</span>
            </h1>
            <p className="hero-subtitle">
              Create a stunning portfolio in minutes. Add your skills, projects, and experience, 
              then export as a beautiful PDF. No account required.
            </p>
            <div className="hero-actions">
              <Link to="/builder">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Start Building
                </Button>
              </Link>
              <Link to="/preview">
                <Button variant="outline" size="lg">
                  View Demo
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
                  <div className="mockup-form">
                    <div className="form-field"></div>
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
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <motion.div 
                key={step.num}
                className="step-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <span className="step-number">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Everything You Need</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Build Your Portfolio?</h2>
            <p>Join thousands of professionals who've created stunning portfolios</p>
            <Link to="/builder">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Get Started Free
              </Button>
            </Link>
            <div className="cta-features">
              <span><CheckCircle size={16} /> No account needed</span>
              <span><CheckCircle size={16} /> 100% free</span>
              <span><CheckCircle size={16} /> Export to PDF</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
