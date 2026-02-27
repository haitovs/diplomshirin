import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import './StudentLogin.css';

function StudentLogin() {
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
          <h1>Student Login</h1>
          <p>Sign in to submit your diploma work</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error animate-fade-in">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="student-email">Email</label>
            <input
              type="email"
              id="student-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@university.edu"
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="student-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
            Sign In
          </Button>
        </form>

        <div className="login-footer">
          <p className="demo-credentials">
            Demo: <code>shirin@university.edu</code> / <code>student123</code>
          </p>
          <div className="login-links">
            <Link to="/login" className="back-home">
              Admin Login
            </Link>
            <span className="link-separator">|</span>
            <Link to="/" className="back-home">
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StudentLogin;
