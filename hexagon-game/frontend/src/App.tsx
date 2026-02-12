import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <Routes>
          <Route path="/" component={() => 
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/game" component={Game} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <GameProvider>
            <AppContent />
          </GameProvider>
        </AuthProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export { App };