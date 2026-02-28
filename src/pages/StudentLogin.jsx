import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import './StudentLogin.css';

function StudentLogin() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginAsStudent, isLoading, error, clearError, isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  // If already logged in as student, redirect to submit
  if (isAuthenticated && isStudent) {
    return <Navigate to="/submit" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const result = await loginAsStudent(email, password);
    if (result.success) {
      navigate('/submit');
    }
  };

  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-header">
          <div className="login-icon student-icon">
            <GraduationCap size={28} />
          </div>
          <h1>{t('studentLogin.title')}</h1>
          <p>{t('studentLogin.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error animate-fade-in">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="student-email">{t('studentLogin.email')}</label>
            <input
              type="email"
              id="student-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('studentLogin.emailPlaceholder')}
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-password">{t('studentLogin.password')}</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="student-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('studentLogin.passwordPlaceholder')}
                className="input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            className="login-submit"
          >
            {t('studentLogin.signIn')}
          </Button>
        </form>

        <div className="login-footer">
          <p className="demo-credentials">
            {t('studentLogin.demo')}
          </p>
          <div className="login-links">
            <Link to="/login" className="back-home">
              {t('studentLogin.adminLogin')}
            </Link>
            <span className="link-separator">|</span>
            <Link to="/" className="back-home">
              {t('studentLogin.backHome')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentLogin;
