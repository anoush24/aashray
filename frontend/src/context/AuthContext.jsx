import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing login on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('petUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = (userData, accessToken) => {
    setUser(userData);
    // Save minimal user info to localStorage for persistence
    localStorage.setItem('petUser', JSON.stringify(userData));
    // Ideally, store accessToken in memory (state) or httpOnly cookie, 
    // but for now we won't manually store it since your backend uses cookies.
    if (accessToken) {
        localStorage.setItem('token', accessToken);
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('petUser');
    localStorage.removeItem('petUser');
    localStorage.removeItem('token')
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);