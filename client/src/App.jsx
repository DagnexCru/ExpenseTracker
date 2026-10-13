import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PageContainer from './components/layout/PageContainer';
import HealthCheckPage from './pages/HealthCheckPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfileCard from './pages/UserProfileCard';
import TransactionsPage from './pages/TransactionsPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('health');
  const { user, isAuthenticated } = useAuth();

  const handleNavigate = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'health':
        return {
          title: 'System Architecture & Shell',
          subtitle: 'Phase 1: Backend foundation, Mongoose health checks, and React application shell.',
        };
      case 'register':
        return {
          title: 'Create Account',
          subtitle: 'Phase 2: User registration with bcrypt password hashing and HTTP-only session cookies.',
        };
      case 'login':
        return {
          title: 'Sign In to SpendWise',
          subtitle: 'Phase 2: User authentication, JWT issuance, and secure cookie transport.',
        };
      case 'profile':
        return {
          title: 'User Profile & Authentication',
          subtitle: 'Phase 2: Authenticated user details, display currency preference, and session verification.',
        };
      case 'transactions':
      case 'dashboard':
      case 'filters':
      case 'settings':
        return {
          title: 'Protected Financial Dashboard',
          subtitle: 'This section is protected by authentication guards and will be expanded in Phase 3 & 4.',
        };
      default:
        return {
          title: 'SpendWise Personal Expense Tracker',
          subtitle: 'MERN Full-Stack Application',
        };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isHealthy={true}
          onNavigate={handleNavigate}
        />

        {/* Dynamic Page Container */}
        <PageContainer title={title} subtitle={subtitle}>
          {currentView === 'health' && <HealthCheckPage />}

          {currentView === 'register' && (
            <RegisterPage
              onSwitchToLogin={() => setCurrentView('login')}
              onSuccess={() => setCurrentView('profile')}
            />
          )}

          {currentView === 'login' && (
            <LoginPage
              onSwitchToRegister={() => setCurrentView('register')}
              onSuccess={() => setCurrentView('profile')}
            />
          )}

          {currentView === 'profile' && (
            <ProtectedRoute onRequireLogin={() => setCurrentView('login')}>
              <UserProfileCard />
            </ProtectedRoute>
          )}

          {currentView === 'transactions' && (
            <ProtectedRoute onRequireLogin={() => setCurrentView('login')}>
              <TransactionsPage />
            </ProtectedRoute>
          )}

          {(currentView === 'dashboard' || currentView === 'filters' || currentView === 'settings') && (
            <ProtectedRoute onRequireLogin={() => setCurrentView('login')}>
              <TransactionsPage />
            </ProtectedRoute>
          )}
        </PageContainer>
      </div>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
