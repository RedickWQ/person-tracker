import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target } from 'lucide-react';
import './Sidebar.css';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Target className="logo-icon" />
        <span className="logo-text">目标追踪</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>仪表盘</span>
        </NavLink>
      </nav>
    </aside>
  );
}
