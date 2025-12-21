import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <motion.div 
        className="not-found-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="not-found-illustration">
          <span className="error-code">404</span>
        </div>
        <h1>Page Not Found</h1>
        <p>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-actions">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Back to Home
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline" icon={ArrowLeft}>
              Browse Projects
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;
