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
import DashboardPage from './pages/DashboardPage';
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
      case 'settings':
        return {
          title: 'User Profile & Currency Preferences',
          subtitle: 'Phase 6: Update display name, preferred currency, and manage account security.',
        };
      case 'dashboard':
        return {
          title: 'Financial Overview & Analytics',
          subtitle: 'Phase 4: Summary totals, monthly cashflow velocity, and category allocations.',
        };
      case 'transactions':
      case 'filters':
        return {
          title: 'Transaction Management & Filters',
          subtitle: 'Phase 5: Search descriptions, filter by date range, category, and paginate.',
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

          {(currentView === 'profile' || currentView === 'settings') && (
            <ProtectedRoute onRequireLogin={() => setCurrentView('login')}>
              <UserProfileCard />
            </ProtectedRoute>
          )}

          {currentView === 'dashboard' && (
            <ProtectedRoute onRequireLogin={() => setCurrentView('login')}>
              <DashboardPage
                onNavigate={handleNavigate}
                userCurrency={user?.currency}
              />
            </ProtectedRoute>
          )}

          {(currentView === 'transactions' || currentView === 'filters') && (
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
