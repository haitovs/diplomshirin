import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFound.css';

function NotFound() {
  const { t } = useTranslation();

  return (
    <motion.div
      className="not-found-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="not-found-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <div className="not-found-icon" aria-hidden="true">
          <Compass size={56} />
        </div>
        <div className="not-found-illustration">
          <span className="error-code">{t('notFound.code')}</span>
        </div>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.message')}</p>
        <div className="not-found-actions">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              {t('notFound.backHome')}
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline" icon={ArrowLeft}>
              {t('notFound.browseProjects')}
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default NotFound;
