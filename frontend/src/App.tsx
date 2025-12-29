import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TaskBoard } from './components/TaskBoard';
import { TeamView } from './components/TeamView';
import { Discussion } from './components/Discussion';
import { ProjectManagement } from './components/ProjectManagement';
import { TeamManagement } from './components/TeamManagement';
import { FileManager } from './components/FileManager';
import { TeamSelector } from './components/TeamSelector';
import { Profile } from './components/Profile';
import { LoadingTransition } from './components/LoadingTransition';
import { Toaster } from './components/ui/sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { motion, AnimatePresence } from 'motion/react';

function MainApp() {
  // Set document title
  useEffect(() => {
    document.title = 'TaskMate - Kelola Tim & Tugas Bersama';
  }, []);
  const { isAuthenticated, user } = useAuth();
  const { currentTeam } = useData();
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'team' | 'discussion' | 'projects' | 'teams' | 'files' | 'profile'>('dashboard');
  const [authView, setAuthView] = useState<'login' | 'register' | 'landing'>('landing');
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previousView, setPreviousView] = useState(activeView);
  // Check if user needs to select a team
  useEffect(() => {
    if (isAuthenticated && !currentTeam) {
      setShowTeamSelector(true);
    } else {
      setShowTeamSelector(false);
    }
  }, [isAuthenticated, currentTeam]);

  // Handle view changes with loading transition
  const handleViewChange = (view: typeof activeView) => {
    if (view !== activeView) {
      setIsLoading(true);
      setPreviousView(activeView);
      setTimeout(() => {
        setActiveView(view);
        setIsLoading(false);
      }, 500);
    }
  };

  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <LandingPage 
          onLogin={() => setAuthView('login')}
          onRegister={() => setAuthView('register')}
        />
      );
    }
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} onBackToLanding={() => setAuthView('landing')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} onBackToLanding={() => setAuthView('landing')} />
    );
  }

  // Show team selector if no team is selected
  if (showTeamSelector) {
    return <TeamSelector onTeamSelected={() => setShowTeamSelector(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F5] via-[#FFEEE8] to-[#FFE5DD] dark:from-[#1a1625] dark:via-[#251d30] dark:to-[#2d2438] gradient-mesh transition-all duration-500">
      {/* Decorative floating blobs with TaskMate colors - More refined */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#355070]/12 dark:bg-[#355070]/8 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-20 w-[500px] h-[500px] bg-[#B56576]/12 dark:bg-[#B56576]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-[450px] h-[450px] bg-[#E88C7D]/12 dark:bg-[#E88C7D]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#6D597A]/10 dark:bg-[#6D597A]/8 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <Header 
        onSwitchTeam={() => setShowTeamSelector(true)}
        activeView={activeView}
        onViewChange={handleViewChange}
      />
      
      <div className="relative">
        <main className="p-4 md:p-6 lg:p-8 w-full max-w-[1920px] mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingTransition key="loading" />
            ) : (
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeView === 'dashboard' && <Dashboard onNavigate={handleViewChange} />}
                {activeView === 'tasks' && <TaskBoard />}
                {activeView === 'team' && <TeamView />}
                {activeView === 'discussion' && <Discussion />}
                {activeView === 'projects' && user?.role === 'admin' && <ProjectManagement />}
                {activeView === 'teams' && user?.role === 'admin' && <TeamManagement />}
                {activeView === 'files' && (
                  <Card className="card-premium border-white/60 dark:border-white/20 shadow-2xl">
                    <CardHeader className="p-8">
                      <CardTitle className="bg-gradient-to-r from-[#355070] to-[#B56576] bg-clip-text text-transparent text-3xl">
                        Berkas Tim
                      </CardTitle>
                      <CardDescription className="text-lg mt-2">
                        Kelola semua berkas dari proyek dan tugas dalam tim Anda
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <FileManager viewMode="team" />
                    </CardContent>
                  </Card>
                )}
                {activeView === 'profile' && <Profile />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <MainApp />
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}