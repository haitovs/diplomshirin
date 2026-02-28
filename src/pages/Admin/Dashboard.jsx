import { CheckCircle, Clock, FolderOpen, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { statsAPI } from '../../services/api';
import './Dashboard.css';

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      const data = await statsAPI.getDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="dashboard-loading">{t('admin.dashboard.loading')}</div>;
  if (error) return <div className="dashboard-error">{t('admin.dashboard.error', { error })}</div>;
  if (!stats) return null;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('admin.dashboard.title')}</h1>
        <p>{t('admin.dashboard.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FolderOpen size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.overview.totalWorks}</span>
            <span className="stat-label">{t('admin.dashboard.totalWorks')}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.overview.approvedWorks}</span>
            <span className="stat-label">{t('admin.dashboard.approved')}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.overview.pendingWorks}</span>
            <span className="stat-label">{t('admin.dashboard.pending')}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.overview.totalStudents}</span>
            <span className="stat-label">{t('admin.dashboard.students')}</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* By Category */}
        <div className="chart-card">
          <h3 className="chart-title">{t('admin.dashboard.byCategory')}</h3>
          <div className="chart-list">
            {stats.byCategory.length === 0 ? (
              <p className="no-data-text">{t('admin.dashboard.noData')}</p>
            ) : (
              stats.byCategory.map(c => (
                <div key={c.category} className="chart-item">
                  <span className="chart-label">{c.category}</span>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{ width: `${Math.min((c.count / (stats.overview.approvedWorks || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="chart-value">{c.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* By Year */}
        <div className="chart-card">
          <h3 className="chart-title">{t('admin.dashboard.byYear')}</h3>
          <div className="chart-list">
            {stats.byYear.length === 0 ? (
              <p className="no-data-text">{t('admin.dashboard.noData')}</p>
            ) : (
              stats.byYear.map(y => (
                <div key={y.year} className="chart-item">
                  <span className="chart-label">{y.year}</span>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar year"
                      style={{ width: `${Math.min((y.count / (stats.overview.approvedWorks || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="chart-value">{y.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Recent Submissions */}
        <div className="chart-card">
          <h3 className="chart-title">{t('admin.dashboard.recentSubmissions')}</h3>
          <div className="recent-list">
            {stats.recentSubmissions.length === 0 ? (
              <p className="no-data-text">{t('admin.dashboard.noData')}</p>
            ) : (
              stats.recentSubmissions.map(sub => (
                <div key={sub.id} className="recent-item">
                  <div className="recent-info">
                    <span className="recent-title">{sub.title}</span>
                    <span className="recent-author">by {sub.student_name || 'Unknown'}</span>
                  </div>
                  <span className={`status-badge ${sub.status}`}>{sub.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Viewed */}
        <div className="chart-card">
          <h3 className="chart-title">{t('admin.dashboard.topViewed')}</h3>
          <div className="top-list">
            {stats.topViewed.length === 0 ? (
              <p className="no-data-text">{t('admin.dashboard.noData')}</p>
            ) : (
              stats.topViewed.map((w, i) => (
                <div key={w.id} className="top-item">
                  <span className="top-rank">#{i + 1}</span>
                  <span className="top-title">{w.title}</span>
                  <span className="top-views">{t('admin.dashboard.viewsCount', { count: w.views })}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
