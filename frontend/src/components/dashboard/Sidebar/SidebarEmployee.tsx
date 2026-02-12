import { Briefcase, Bookmark, LogOut, X, User, CrossIcon } from 'lucide-react';
import './SidebarEmployee.scss';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  stats: { openJobs: number; jobApplications: number };
  handleLogout: () => void;
 user: {
      firstName: string;
        lastName: string;
      email: string;
       phone: string;
      role: string;
    }
}

export default function Sidebar({ isOpen, setIsOpen, activeSection, setActiveSection, stats, handleLogout, user }: SidebarProps) {
  const menuItems = [
    { id: 'openjobs', label: 'Open Jobs', icon: Briefcase, count: stats.openJobs },
    { id: 'jobapplications', label: 'Job Applications', icon: Bookmark, count: stats.jobApplications },
    { id: 'closedjobs', label: 'Closed Jobs', icon: X },
    { id: 'profile', label: 'Profile', icon: User },
  ];


  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--closed'}`}>
      <div className="sidebar__content">
        <div className="sidebar__header">
          <h1 className="sidebar__logo">Job Shield</h1>
          <button onClick={() => setIsOpen(false)} className="sidebar__close">
            <X size={24} />
          </button>
        </div>

        {/* User Profile */}
        <div className="user-profile">
          <div className="user-profile__info">
            {/* <div className="user-profile__avatar">JD</div> */}
            <div className="user-profile__details">
               <p className="user-profile__name">{user.firstName} {user.lastName}</p>
              <p className="user-profile__email">{user.email}</p>
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
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span className="logout-btn__label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
