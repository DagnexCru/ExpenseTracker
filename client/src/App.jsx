import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import PageContainer from './components/layout/PageContainer';
import HomePage from './pages/HomePage';
import HealthCheckPage from './pages/HealthCheckPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfileCard from './pages/UserProfileCard';
import TransactionsPage from './pages/TransactionsPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

function MainApp() {
  const [currentView, setCurrentView] = useState('home');
  const { user, isAuthenticated } = useAuth();

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'home':
        return {
          title: '',
          subtitle: '',
          showHeader: false,
        };
      case 'health':
        return {
          title: 'System Architecture & Telemetry',
          subtitle: 'Real-time Mongoose health checks, database latency, and system telemetry.',
          showHeader: true,
        };
      case 'register':
        return {
          title: 'Create Account',
          subtitle: 'Register your private account with industry-standard bcrypt encryption and secure sessions.',
          showHeader: true,
        };
      case 'login':
        return {
          title: 'Sign In to SpendWise',
          subtitle: 'Secure authentication with HTTP-only cookies and token verification.',
          showHeader: true,
        };
      case 'profile':
      case 'settings':
        return {
          title: 'User Profile & Currency Preferences',
          subtitle: 'Manage your display name, account security, and preferred baseline currency.',
          showHeader: true,
        };
      case 'dashboard':
        return {
          title: 'Financial Overview & Analytics',
          subtitle: 'Real-time income vs. expense cashflow, monthly trends, and spending allocations.',
          showHeader: true,
        };
      case 'transactions':
      case 'filters':
        return {
          title: 'Transaction Management & Filters',
          subtitle: 'Full CRUD ledger with multi-field search, date range filters, and pagination.',
          showHeader: true,
        };
      default:
        return {
          title: 'SpendWise Personal Expense Tracker',
          subtitle: 'MERN Full-Stack Application',
          showHeader: true,
        };
    }
  };

  const { title, subtitle, showHeader } = getPageTitle();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header Navbar with concise navigation tabs (no left sidebar) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main dynamic content container */}
      <div className="flex-1 flex flex-col min-w-0">
        <PageContainer title={title} subtitle={subtitle} showHeader={showHeader}>
          {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}

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
