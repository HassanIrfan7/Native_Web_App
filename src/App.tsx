import React, { useState, useEffect } from 'react';
import { User, Video, Comment, Rating } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import CreatorDashboard from './components/CreatorDashboard';
import ConsumerDashboard from './components/ConsumerDashboard';
import VideoPlayer from './components/VideoPlayer';
import Navigation from './components/Navigation';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const renderView = () => {
    if (!user) {
      return <LoginPage />;
    }

    switch (currentView) {
      case 'video':
        return selectedVideo ? (
          <VideoPlayer 
            video={selectedVideo} 
            onBack={() => setCurrentView('dashboard')} 
          />
        ) : (
          <div>Video not found</div>
        );
      default:
        switch (user.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'creator':
            return <CreatorDashboard />;
          case 'consumer':
            return (
              <ConsumerDashboard 
                onVideoSelect={(video) => {
                  setSelectedVideo(video);
                  setCurrentView('video');
                }}
              />
            );
          default:
            return <div>Unknown role</div>;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {user && (
        <Navigation 
          user={user} 
          onLogout={logout}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      )}
      <main className={user ? 'pt-16' : ''}>
        {renderView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;