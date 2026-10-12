import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PageContainer from './components/layout/PageContainer';
import HealthCheckPage from './pages/HealthCheckPage';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isHealthy={true}
        />

        {/* Dynamic Page Container */}
        <PageContainer
          title="System Architecture & Shell"
          subtitle="Phase 1: Backend foundation and React application shell integration."
        >
          <HealthCheckPage />
        </PageContainer>
      </div>
    </div>
  );
}

export default App;
