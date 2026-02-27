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
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './Home.css';

const features = [
  {
    icon: Shield,
    title: 'Similarity Detection',
    description: 'Advanced multi-algorithm analysis to identify overlapping content across all submissions'
  },
  {
    icon: Database,
    title: 'Centralized Archive',
    description: 'A single, searchable repository for all student diploma works across departments and years'
  },
  {
    icon: FileSearch,
    title: 'Deep Comparison',
    description: 'TF-IDF, n-gram, and LCS algorithms provide detailed field-by-field similarity breakdowns'
  },
  {
    icon: Users,
    title: 'Student Profiles',
    description: 'Each submission is bound to the student\'s account for full traceability'
  },
  {
    icon: Layers,
    title: 'Admin Approval',
    description: 'Review workflow ensures only verified works enter the archive, with approve/reject controls'
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Full-text search with relevance scoring across titles, descriptions, and technologies'
  }
];

const steps = [
  { num: 1, title: 'Submit Your Work', desc: 'Log in as a student and submit your diploma project with details and description', icon: Upload },
  { num: 2, title: 'Similarity Check', desc: 'The system analyzes your submission against all existing works for originality', icon: Shield },
  { num: 3, title: 'Admin Review', desc: 'An administrator reviews and approves your work for the public archive', icon: CheckCircle }
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
              <GraduationCap size={14} /> Diploma Work Archive
            </span>
            <h1>
              Student Diploma
              <span className="gradient-text"> Repository</span>
              <span className="hero-ampersand"> & </span>
              Similarity
              <span className="gradient-text"> Checker</span>
            </h1>
            <p className="hero-subtitle">
              A centralized platform for storing, searching, and verifying the originality
              of student diploma works. Submit your project, check for similarity, and explore the archive.
            </p>
            <div className="hero-actions">
              <Link to="/archive">
                <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                  Browse Archive
                </Button>
              </Link>
              <Link to="/student-login">
                <Button variant="outline" size="lg">
                  Student Login
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
          <h2 className="section-title">Platform Capabilities</h2>
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

      {/* CTA - Primary */}
      <section className="cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Submit Your Diploma Work?</h2>
            <p>Log in, submit your project, and have it archived for your university</p>
            <Link to="/student-login">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Get Started
              </Button>
            </Link>
            <div className="cta-features">
              <span><CheckCircle size={16} /> Similarity checking</span>
              <span><CheckCircle size={16} /> Full-text search</span>
              <span><CheckCircle size={16} /> Admin review</span>
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
              <h3>Portfolio Builder</h3>
              <p>
                Need a professional portfolio? Use our free builder to create a polished PDF
                portfolio with your skills, projects, and experience.
              </p>
            </div>
            <div className="secondary-actions">
              <Link to="/builder">
                <Button variant="outline" size="lg" icon={BookOpen} iconPosition="left">
                  Build Portfolio
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
