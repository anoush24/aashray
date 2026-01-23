import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Login = () => {
  const [role, setRole] = useState('user'); // 'user' or 'hospital'
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const redirectUser = (userRole) => {
    if (userRole === 'hospital') {
      navigate('/hospital/dashboard', { replace: true });
    } else {
      navigate('/user/dashboard', { replace: true });
    }
  };

  useEffect(() => {
    const checkSession = async() => {
      if(user) {
        redirectUser(user.role)
        return
      }

      const storedUser = localStorage.getItem('userInfo');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
         const parsedUser = JSON.parse(storedUser);
         login(parsedUser, storedToken);
         redirectUser(parsedUser.role);
         return;
      }

      try {
        const response = await api.get('/refresh');
        const { accessToken, user: backendUser } = response.data;

        login(backendUser, accessToken);
        redirectUser(backendUser.role);

      } catch (err) {
        setCheckingSession(false);
      }
    };

    checkSession();
    
  },[user, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      
      if (role === 'user') {
        response = await authService.loginUser(formData);
      } else {
        response = await authService.loginHospital(formData);
      }

      console.log("Backend Response:", response);

      if (response.message !== "Login Successfull") {
        throw new Error(response.message || "Login failed");
      }

      const userData = {
        ...response.user,
        username: formData.username,
        role: role,
        accessToken: response.accessToken // Store momentarily for API calls
      };

      login(userData, response.accessToken);
      redirectUser(role);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message || "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-body)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-[var(--color-bg-body)]">
      <div className="flex w-full max-w-[900px] min-h-[600px] bg-[var(--color-bg-card)] rounded-[32px] overflow-hidden shadow-2xl flex-col md:flex-row">
        
        {/* Left Side */}
        <div className="flex-1 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] p-8 md:p-12 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -top-[20%] -right-[20%] w-[200px] h-[200px] bg-white/10 rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-6 text-3xl font-extrabold relative z-10">
            <span className="text-4xl">🐾</span> Aashray
          </div>
          <h1 className="text-xl md:text-2xl font-semibold leading-relaxed relative z-10 opacity-90">
            Welcome back to the unified ecosystem of care.
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-[var(--color-bg-card)]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold mb-2 text-[var(--color-text-main)]">Log In</h2>
            <p className="text-[var(--color-text-muted)] text-sm font-medium">Please enter your details to continue.</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-[var(--color-bg-toggle)] p-1 rounded-xl mb-6">
            <button 
              type="button"
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${role === 'user' ? 'bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
              onClick={() => setRole('user')}
            >
              Pet Owner
            </button>
            <button 
              type="button"
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${role === 'hospital' ? 'bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
              onClick={() => setRole('hospital')}
            >
              Hospital / Vet
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold border border-red-200 text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block font-medium mb-1.5 text-sm text-[var(--color-text-main)]">Username</label>
              <input 
                type="text" 
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 bg-[var(--color-bg-input)] border-2 border-[var(--color-border)] rounded-xl text-[var(--color-text-main)] text-sm outline-none focus:border-[var(--color-primary)] transition-colors duration-300" 
                placeholder={role === 'user' ? "username" : "hospital_name"}
                required 
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block font-medium mb-1.5 text-sm text-[var(--color-text-main)]">Password</label>
              <input 
                type="password" 
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-[var(--color-bg-input)] border-2 border-[var(--color-border)] rounded-xl text-[var(--color-text-main)] text-sm outline-none focus:border-[var(--color-primary)] transition-colors duration-300" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full p-3 bg-[var(--color-primary)] text-white font-bold text-base rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 shadow-lg shadow-teal-600/20 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
            >
              {loading ? 'Verifying...' : `Log In as ${role === 'user' ? 'Pet Owner' : 'Hospital'}`}
            </button>
          </form>

          <div className="text-center mt-6 text-[var(--color-text-muted)] text-sm font-medium">
            Don't have an account? <a href="/register" className="text-[var(--color-primary)] font-bold hover:underline">Create free account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;