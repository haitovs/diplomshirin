import { FolderOpen, Github, Heart, Mail, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Builder', to: '/builder' },
      { label: 'Preview', to: '/preview' },
      { label: 'Templates', to: '/builder' }
    ],
    resources: [
      { label: 'How It Works', to: '/#how-it-works' },
      { label: 'Features', to: '/#features' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@portfoliobuilder.com', label: 'Email' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <FolderOpen size={24} />
              </div>
              <span className="logo-text">PortfolioBuilder</span>
            </Link>
            <p className="footer-description">
              Create professional portfolios in minutes. Free, no account required,
              export to PDF instantly.
            </p>
            <div className="footer-social">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Product</h4>
              <ul className="footer-list">
                {footerLinks.product.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Resources</h4>
              <ul className="footer-list">
                {footerLinks.resources.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} PortfolioBuilder. Made with <Heart size={14} className="heart-icon" /> for students.
          </p>
          <p className="footer-note">
            Diploma Project
          </p>
          <Link to="/login" className="admin-link">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
