import React from 'react';
import { Briefcase, Bookmark, TrendingUp, LogOut, X } from 'lucide-react';
import './Sidebar.scss';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  stats: { appliedJobs: number; savedJobs: number; interviews: number };
}

export default function Sidebar({ isOpen, setIsOpen, activeSection, setActiveSection, stats }: SidebarProps) {
  const menuItems = [
    { id: 'applied', label: 'Applied Jobs', icon: Briefcase, count: stats.appliedJobs },
    { id: 'saved', label: 'Saved Jobs', icon: Bookmark, count: stats.savedJobs },
    { id: 'recommended', label: 'Recommended', icon: TrendingUp },
    { id: 'analytics', label: 'Trust Score', icon: TrendingUp, highlight: true }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="sidebar__content">
        <div className="sidebar__header">
          <h1 className="sidebar__logo">JobPortal</h1>
          <button onClick={() => setIsOpen(false)} className="sidebar__close">
            <X size={24} />
          </button>
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-profile__info">
            <div className="user-profile__avatar">JD</div>
            <div className="user-profile__details">
              <p className="user-profile__name">John Doe</p>
              <p className="user-profile__email">john@example.com</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`nav-menu__item ${activeSection === item.id ? 'nav-menu__item--active' : ''}`}
              >
                <div className="nav-menu__item-content">
                  <Icon size={20} />
                  <span className="nav-menu__item-label">{item.label}</span>
                </div>
                {item.count && <span className="nav-menu__badge">{item.count}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="logout-btn">
          <LogOut size={20} />
          <span className="logout-btn__label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
