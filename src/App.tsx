import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { useContentStore } from './stores/useContentStore';
import { useProgressStore } from './stores/useProgressStore';
import { useTheme } from './hooks/useTheme';
import { useHydration } from './hooks/useHydration';

// Pages
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { PracticePage } from './pages/PracticePage';
import { LettersPage } from './pages/LettersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoadingPage } from './pages/LoadingPage';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

function App() {
  const { loadContent, loaded, loading, error } = useContentStore();
  const { updateStreak } = useProgressStore();
  const isHydrated = useHydration();
  
  useTheme();

  useEffect(() => {
    // Load content on app start
    loadContent();
    
    // Update streak when app opens
    updateStreak();
  }, [loadContent, updateStreak]);

  if (loading || !isHydrated) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Failed to load content
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return <LoadingPage />;
  }

  return (
    <Router basename="/bulglo">
      <PWAInstallPrompt />
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        
        <Route path="/lesson/:lessonId" element={
          <Layout showNavigation={false}>
            <LessonPage />
          </Layout>
        } />
        
        <Route path="/practice" element={
          <Layout>
            <PracticePage />
          </Layout>
        } />
        
        <Route path="/letters" element={
          <Layout>
            <LettersPage />
          </Layout>
        } />
        
        <Route path="/profile" element={
          <Layout>
            <ProfilePage />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
