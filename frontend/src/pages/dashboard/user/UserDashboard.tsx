import React, { useState } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar/Sidebar'
import Header from '../../../components/dashboard/Header/Header';
import StatsGrid from '../../../components/dashboard/StatsGrid/StatsGrid';
import ContentSection from '../../../components/dashboard/ContentSection/ContentSection';
import './UserDashboard.scss';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('applied');

  const userScore = 85;
  const stats = { appliedJobs: 12, savedJobs: 8, interviews: 3 };

  return (
    <div className="dashboard">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        stats={stats}
      />
      <main className="main-content">
        <Header 
          title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        <div className="content">
          <StatsGrid stats={stats} />
          <div className="content-section">
            <ContentSection activeSection={activeSection} userScore={userScore} />
          </div>
        </div>
      </main>
    </div>
  );
}
