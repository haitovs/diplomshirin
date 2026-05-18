import { CheckCircle, Clock, FolderOpen, TrendingUp, Users } from 'lucide-react';
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

  const maxCategory = Math.max(1, ...stats.byCategory.map(c => c.count));
  const maxYear = Math.max(1, ...stats.byYear.map(y => y.count));

  const statCards = [
    { key: 'total', icon: FolderOpen, tone: 'blue', value: stats.overview.totalWorks, label: t('admin.dashboard.totalWorks'), delta: '+3 this week' },
    { key: 'approved', icon: CheckCircle, tone: 'green', value: stats.overview.approvedWorks, label: t('admin.dashboard.approved'), delta: '+2 this week' },
    { key: 'pending', icon: Clock, tone: 'orange', value: stats.overview.pendingWorks, label: t('admin.dashboard.pending'), delta: 'needs review' },
    { key: 'students', icon: Users, tone: 'purple', value: stats.overview.totalStudents, label: t('admin.dashboard.students'), delta: '+1 this week' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-heading">
          <h1>{t('admin.dashboard.title')}</h1>
          <p>{t('admin.dashboard.subtitle')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map(({ key, icon: Icon, tone, value, label, delta }) => (
          <div key={key} className="stat-card">
            <div className={`stat-icon ${tone}`}>
              <Icon size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
              <span className={`stat-delta ${tone === 'orange' ? 'neutral' : 'positive'}`}>
                <TrendingUp size={12} />
                {delta}
              </span>
            </div>
          </div>
        ))}
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
                <div key={c.category} className="chart-item" title={`${c.category}: ${c.count}`}>
                  <span className="chart-label">{c.category}</span>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{ width: `${Math.min((c.count / maxCategory) * 100, 100)}%` }}
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
                <div key={y.year} className="chart-item" title={`${y.year}: ${y.count}`}>
                  <span className="chart-label">{y.year}</span>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar year"
                      style={{ width: `${Math.min((y.count / maxYear) * 100, 100)}%` }}
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
