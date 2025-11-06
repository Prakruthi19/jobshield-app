import React from 'react';
import { Bell, Menu } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  title: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Header({ title, isSidebarOpen, setIsSidebarOpen }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__left">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className={`header__menu-toggle ${isSidebarOpen ? 'header__menu-toggle--hidden' : ''}`}
        >
          <Menu size={24} />
        </button>
        <h2 className="header__title">{title}</h2>
      </div>
      <div className="header__right">
        <button className="header__notification">
          <Bell size={24} />
          <span className="header__notification-badge"></span>
        </button>
      </div>
    </header>
  );
}
