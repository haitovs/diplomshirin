import { Github, Heart, Mail, Twitter } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: t('footer.productLinks.builder'), to: '/builder' },
      { label: t('footer.productLinks.preview'), to: '/preview' },
      { label: t('footer.productLinks.templates'), to: '/builder' }
    ],
    resources: [
      { label: t('footer.resourceLinks.howItWorks'), to: '/#how-it-works' },
      { label: t('footer.resourceLinks.features'), to: '/#features' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: t('footer.social.github') },
    { icon: Twitter, href: 'https://twitter.com', label: t('footer.social.twitter') },
    { icon: Mail, href: 'mailto:contact@portfoliobuilder.com', label: t('footer.social.email') }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <img src={logoImg} alt="Logo" className="logo-img" />
              </div>
              <span className="logo-text">{t('footer.brand')}</span>
            </Link>
            <p className="footer-description">
              {t('footer.description')}
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
              <h4 className="footer-title">{t('footer.product')}</h4>
              <ul className="footer-list">
                {footerLinks.product.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">{t('footer.resources')}</h4>
              <ul className="footer-list">
                {footerLinks.resources.map(link => {
                  const hash = link.to.split('#')[1];
                  return (
                    <li key={link.label}>
                      <a
                        href={link.to}
                        className="footer-link"
                        onClick={(e) => {
                          if (!hash) return;
                          e.preventDefault();
                          const scrollToHash = () => {
                            const el = document.getElementById(hash);
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth' });
                            }
                          };
                          if (location.pathname === '/') {
                            scrollToHash();
                          } else {
                            navigate('/');
                            setTimeout(scrollToHash, 300);
                          }
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            {t('footer.copyright', { year: currentYear })} <Heart size={14} className="heart-icon" />
          </p>
          <p className="footer-note">
            {t('footer.note')}
          </p>
          <Link to="/login" className="admin-link">{t('footer.adminLogin')}</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
