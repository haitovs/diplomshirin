import {
    FolderOpen,
    LayoutDashboard,
    LogOut,
    Shield,
    ShieldCheck,
    Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

function AdminLayout() {
  const { t } = useTranslation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { to: '/admin', icon: Shield, label: t('admin.sidebar.similarityChecker'), end: true },
    { to: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.sidebar.dashboard') },
    { to: '/admin/projects', icon: FolderOpen, label: t('admin.sidebar.projects') },
    { to: '/admin/students', icon: Users, label: t('admin.sidebar.students') },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-user">
            <div className="admin-avatar admin-avatar-icon" aria-hidden="true">
              <ShieldCheck size={24} strokeWidth={2.2} />
            </div>
            <div className="admin-info">
              <span className="admin-name">{user.name}</span>
              <span className="admin-role">{user.role}</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-logout" onClick={logout}>
            <LogOut size={20} />
            <span>{t('admin.sidebar.logout')}</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
