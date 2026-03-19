import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import './Header.css';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'tk', label: 'TK' },
  { code: 'ru', label: 'RU' },
];

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  function changeLang(code) {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
  }

  const navLinks = [
    { to: '/', label: t('header.nav.home') },
    { to: '/archive', label: t('header.nav.archive') },
    { to: '/submit', label: t('header.nav.submit') },
    { to: '/builder', label: t('header.nav.builder') },
    { to: '/preview', label: t('header.nav.preview') },
    { to: '/guide', label: t('header.nav.guide') }
  ];

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logoImg} alt="Logo" className="logo-img" />
          <span className="logo-text">{t('header.logo')}</span>
        </Link>

        {/* Navigation */}
        <nav className="nav-desktop">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Language Switcher */}
          <div className="lang-switcher">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                className={`lang-btn ${i18n.language === code ? 'active' : ''}`}
                onClick={() => changeLang(code)}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={t('header.toggleTheme')}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/archive" className="desktop-cta">
            <Button variant="primary" size="sm">
              {t('header.browseArchive')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
