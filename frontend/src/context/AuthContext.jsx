import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing login on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = (userData, accessToken) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
    if (accessToken) {
        localStorage.setItem('token', accessToken);
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token')
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);