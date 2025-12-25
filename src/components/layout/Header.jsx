import { Briefcase, Moon, Sun } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import './Header.css';

function Header() {
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/archive', label: '📚 Archive' },
    { to: '/submit', label: '📝 Submit' },
    { to: '/builder', label: 'Builder' },
    { to: '/preview', label: 'Preview' }
  ];

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <Briefcase size={24} />
          <span className="logo-text">PortfolioBuilder</span>
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
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/builder" className="desktop-cta">
            <Button variant="primary" size="sm">
              Start Building
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;

