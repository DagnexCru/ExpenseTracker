import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PageContainer from './components/layout/PageContainer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfileCard from './pages/UserProfileCard';
import TransactionsPage from './pages/TransactionsPage';
import DashboardPage from './pages/DashboardPage';
import BudgetGoalsPage from './pages/BudgetGoalsPage';
import GoogleAccountChooserPage from './pages/GoogleAccountChooserPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import EditProfilePhotoModal from './components/profile/EditProfilePhotoModal';
import TransactionModal from './components/transactions/TransactionModal';
import { createTransactionApi } from './api/transactions';

function MainApp() {
  const [currentView, setCurrentView] = useState('home');
  const { user, isAuthenticated } = useAuth();

  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global modals states
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isSubmittingQuickTx, setIsSubmittingQuickTx] = useState(false);
  const [quickTxError, setQuickTxError] = useState(null);

  React.useEffect(() => {
    if (isAuthenticated && (currentView === 'login' || currentView === 'register')) {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, currentView]);

  const handleNavigate = (view) => {
    setCurrentView(view);
    setIsMobileSidebarOpen(false);
  };

  const handleQuickAddSubmit = async (formData) => {
    setIsSubmittingQuickTx(true);
    setQuickTxError(null);
    try {
      await createTransactionApi(formData);
      setIsQuickAddModalOpen(false);
      // If we are on dashboard or ledger, re-navigate to refresh
      setCurrentView((prev) => (prev === 'dashboard' ? 'dashboard' : prev));
    } catch (err) {
      setQuickTxError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          'Failed to record transaction. Please verify values.'
      );
    } finally {
      setIsSubmittingQuickTx(false);
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'home':
        return {
          title: '',
          subtitle: '',
          showHeader: false,
        };
      case 'register':
        return {
          title: 'Create Account',
          subtitle: '',
          showHeader: false,
        };
      case 'login':
        return {
          title: 'Sign In',
          subtitle: '',
          showHeader: false,
        };
      case 'profile':
      case 'settings':
        return {
          title: 'User Profile & Preferences',
          subtitle: 'Manage your avatar photo, display name, account security, and baseline currency.',
          showHeader: true,
        };
      case 'budget':
      case 'dashboard':
      case 'transactions':
      case 'filters':
        return {
          title: '',
          subtitle: '',
          showHeader: false,
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

  if (currentView === 'google-account-chooser') {
    return (
      <GoogleAccountChooserPage
        onNavigate={handleNavigate}
        returnView="login"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5F0] flex font-sans">
      {/* Authenticated Left Sidebar with UserProfile Photo Card in Top-Left */}
      {isAuthenticated && (
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          onOpenAddTransaction={() => setIsQuickAddModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area (indented when authenticated desktop sidebar is present) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isAuthenticated
            ? isSidebarCollapsed
              ? 'lg:pl-20'
              : 'lg:pl-72'
            : ''
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          onOpenAddTransaction={() => setIsQuickAddModalOpen(true)}
        />

        {/* Dynamic Page Container */}
        <div className="flex-1 flex flex-col min-w-0">
          <PageContainer title={title} subtitle={subtitle} showHeader={showHeader}>
            {currentView === 'home' && <HomePage onNavigate={handleNavigate} />}

            {currentView === 'register' && (
              <RegisterPage
                onSwitchToLogin={() => setCurrentView('login')}
                onSwitchToGoogleAuth={() => setCurrentView('google-account-chooser')}
                onSuccess={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'login' && (
              <LoginPage
                onSwitchToRegister={() => setCurrentView('register')}
                onSwitchToGoogleAuth={() => setCurrentView('google-account-chooser')}
                onSuccess={() => setCurrentView('dashboard')}
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

            {currentView === 'budget' && (
              <ProtectedRoute onRequireLogin={() => setCurrentView('login')}>
                <BudgetGoalsPage onNavigate={handleNavigate} />
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

      {/* Global Edit Profile & Photo Modal (Accessible from anywhere) */}
      {isAuthenticated && (
        <EditProfilePhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
        />
      )}

      {/* Global Quick Add Transaction Modal */}
      {isAuthenticated && (
        <TransactionModal
          isOpen={isQuickAddModalOpen}
          onClose={() => {
            setIsQuickAddModalOpen(false);
            setQuickTxError(null);
          }}
          onSubmit={handleQuickAddSubmit}
          isLoading={isSubmittingQuickTx}
          currency={user?.currency || 'ETB'}
        />
      )}
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
