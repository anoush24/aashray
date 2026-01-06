import React from 'react';
import { Link, useLocation, useNavigate,Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PawPrint, ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- 1. Define Links for Each Role ---
  const userLinks = [
    { name: 'Dashboard', path: '/user/dashboard' },
    { name: 'Adopt', path: '/user/adopt' },
    { name: 'Rescue', path: '/user/rescue' },
    { name: 'Appointment', path: '/user/appointment' },
    { name: 'Shop', path: '/user/shop' },
    { name: 'Blog', path: '/user/blogs' },
  ];

  const hospitalLinks = [
    { name: 'Dashboard', path: '/hospital/dashboard' },
    { name: 'Appointments', path: '/hospital/appointments' },
    { name: 'Rescue Requests', path: '/hospital/rescue-requests' },
    { name: 'My Patients', path: '/hospital/patients' },
  ];

  const navLinks = user?.role === 'hospital' ? hospitalLinks : userLinks;

  return (
    <div className="min-h-screen bg-[var(--color-bg-body)] text-[var(--color-text-main)] transition-colors duration-300">
      
      {/* --- Dynamic Navbar --- */}
      <nav className="sticky top-0 z-50 h-20 bg-[var(--color-bg-card)] shadow-sm px-6 lg:px-12 flex items-center justify-between transition-colors duration-300">
        
        {/* Logo */}
        <Link to={user?.role === 'hospital' ? '/hospital/dashboard' : '/dashboard'} className="flex items-center gap-2 text-[var(--color-primary)] font-extrabold text-2xl font-nunito">
          <PawPrint size={32} weight="fill" />
          Aashray
        </Link>

        {/* Links (Hidden on mobile) */}
        <ul className="hidden md:flex gap-8 font-semibold text-[var(--color-text-muted)]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={`transition ${
                  location.pathname === link.path 
                    ? 'text-[var(--color-primary)] font-bold' 
                    : 'hover:text-[var(--color-primary)]'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          
          {/* Cart Icon (Only show for regular users) */}
          {user?.role === 'user' && (
            <div className="relative cursor-pointer text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition">
              <ShoppingCart size={24} />
              <div className="absolute -top-1.5 -right-1.5 bg-[var(--color-accent)] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                2
              </div>
            </div>
          )}
          
          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm uppercase">
                {user?.username?.substring(0, 2) || <UserIcon size={16} />}
              </div>
              <span className="font-semibold text-sm hidden sm:block capitalize">
                {user?.username || 'User'}
              </span>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="text-[var(--color-text-muted)] hover:text-red-500 transition ml-2"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

        </div>
      </nav>

      {/* --- Main Content Injection --- */}
      <main className="max-w-6xl mx-auto py-10 px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;