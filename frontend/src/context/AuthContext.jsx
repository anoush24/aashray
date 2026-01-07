import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

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
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('petUser');
    // You might want to call an API endpoint here to clear the backend cookie
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);