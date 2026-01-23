import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut,setIsLoggingOut] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);


  const login = (userData, accessToken) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    if (accessToken) {
        localStorage.setItem('token', accessToken);
    }
  };

  const logout = async() => {
    setIsLoggingOut(true)
    try {
      await api.post('/logout')
    }
    catch(err) {
      console.error("Logout failed on server",err)
    } finally {
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
      window.location.href = '/';
    }
  };

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-body)]">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
            <p className="text-[var(--color-text-muted)] font-medium">Securely logging out...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);