import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import MainLayout from './components/MainLayout';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard'

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleGoToRegister = () => {
    setCurrentView('register');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={handleGoToRegister}
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          onBackToLogin={handleBackToLogin}
        />
      )}
      
      {currentView === 'dashboard' && (
        <MainLayout onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
