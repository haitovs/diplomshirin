import { GraduationCap, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import './Header.css';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const navLinks = [
    { to: '/', label: t('header.nav.home') },
    { to: '/archive', label: t('header.nav.archive') },
    { to: '/submit', label: t('header.nav.submit') },
    { to: '/builder', label: t('header.nav.builder') },
    { to: '/preview', label: t('header.nav.preview') }
  ];

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <GraduationCap size={24} />
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
