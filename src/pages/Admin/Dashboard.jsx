import { motion } from 'framer-motion';
import {
    Activity,
    Eye,
    FolderOpen,
    Star, TrendingUp,
    Users
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import { useData } from '../../context/DataContext';
import './Dashboard.css';

function Dashboard() {
  const { statistics } = useData();
  const { overview, projectsByCategory, monthlyViews, topTechnologies, recentActivity } = statistics;

  const statsCards = [
    { icon: FolderOpen, value: overview.totalProjects, label: 'Total Projects', color: '#4F46E5' },
    { icon: Users, value: overview.totalStudents, label: 'Students', color: '#7C3AED' },
    { icon: Eye, value: overview.totalViews.toLocaleString(), label: 'Total Views', color: '#06B6D4' },
    { icon: Star, value: overview.averageRating.toFixed(1), label: 'Avg Rating', color: '#F59E0B' },
  ];

  const COLORS = projectsByCategory.map(c => c.color);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="stat-icon" style={{ background: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Views Chart */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="chart-title">
            <TrendingUp size={20} />
            Monthly Views
          </h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#4F46E5" 
                  strokeWidth={3}
                  dot={{ fill: '#4F46E5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="chart-title">
            <Activity size={20} />
            Projects by Category
          </h3>
          <div className="chart-container pie-container">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectsByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {projectsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {projectsByCategory.slice(0, 5).map((cat, index) => (
                <div key={cat.name} className="legend-item">
                  <span className="legend-dot" style={{ background: COLORS[index] }} />
                  <span className="legend-name">{cat.name}</span>
                  <span className="legend-value">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Top Technologies */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="chart-title">Top Technologies</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topTechnologies} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-tertiary)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--text-tertiary)" fontSize={12} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="usage" fill="#7C3AED" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          className="chart-card activity-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="chart-title">Recent Activity</h3>
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-dot ${activity.type}`} />
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
