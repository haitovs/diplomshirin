import {
    FolderOpen,
    LayoutDashboard,
    LogOut,
    Users
} from 'lucide-react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/projects', icon: FolderOpen, label: 'Projects' },
    { to: '/admin/students', icon: Users, label: 'Students' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="admin-user">
            <img src={user.avatar} alt={user.name} className="admin-avatar" />
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
          <button className="sidebar-link" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
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
