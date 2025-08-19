// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

import { Toaster as Toasted } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import ExpenseCalculator from './pages/ExpenseCalculator';
import Analytics from './pages/Analytics';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import { Loader2 } from 'lucide-react';

const AppRoutes: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Routes>

        <Route path='test' element={<ExpenseCalculator />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />


        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Welcome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ExpenseCalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/signin" replace />
        } />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <>
      <Toaster />
      <Toasted position="top-right" />
      <Sonner />
      <AppRoutes />
    </>
  );
};

export default App;