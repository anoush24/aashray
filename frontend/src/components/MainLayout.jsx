import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate,Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PawPrint, ShoppingCart, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

const MainLayout = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const sellerLinks = [
  { name: 'Dashboard', path: '/user/dashboard' }, // Keep standard dashboard for overview
  { name: 'Inventory', path: '/seller/inventory' },
  { name: 'Add Product', path: '/seller/add-product' },
  { name: 'Shop', path: '/user/shop' }, // Sellers might still want to see the public shop
];

  let navLinks;
 if (user?.role === 'hospital') {
  navLinks = hospitalLinks;
} else if (user?.isSeller === true) { // Explicitly check the boolean from your schema
  navLinks = sellerLinks;
} else {
  navLinks = userLinks;
}

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-body)] text-[var(--color-text-main)] transition-colors duration-300">
      
      {/* --- Dynamic Navbar --- */}
      <nav className="sticky top-0 z-50 h-20 bg-white bg-[var(--color-bg-card)] border-b border-[var(--color-border)] shadow-sm px-6 lg:px-12 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-[var(--color-text-main)] hover:text-[var(--color-primary)] focus:outline-none p-1"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open Menu"
          >
            <Menu size={28} /> 
          </button>
        {/* Logo */}
<Link 
  to={
    user?.role === 'hospital' ? '/hospital/dashboard' : 
    user?.isSeller ? '/user/dashboard' : '/user/dashboard'
  } 
  className="flex items-center gap-2 text-[var(--color-primary)] font-extrabold text-2xl font-nunito"
>
  <PawPrint size={32} weight="fill" />
  Aashray
</Link>
        </div>
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
          
          {user?.role === 'user' && (
  <Link to="/user/cart" className="relative cursor-pointer text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition">
    <ShoppingCart size={24} />
    {cartCount > 0 && (
      <div className="absolute -top-1.5 -right-1.5 bg-[var(--color-accent)] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
        {cartCount}
      </div>
    )}
  </Link>
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

      <div className={`md:hidden fixed inset-0 z-50 flex ${isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
         <div 
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
         ></div>

         <div className={`relative bg-[var(--color-bg-card)] w-4/5 max-w-xs h-full shadow-2xl flex flex-col pt-8 px-6 space-y-8 transform transition-transform duration-300 ease-in-out bg-white ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <button 
               onClick={() => setIsMobileMenuOpen(false)}
               className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] p-1"
               aria-label="Close Menu"
            >
               <X size={28} />
            </button>
            <div className="flex items-center gap-4 pb-6 border-b border-[var(--color-border)] mr-8">
               <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md">
                  {user?.username?.substring(0, 2) || <UserIcon size={28} />}
               </div>
               <div className="overflow-hidden">
                 <p className="font-extrabold text-xl capitalize text-[var(--color-text-main)] truncate">{user?.username}</p>
                 <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">{user?.role === 'user' && user?.isSeller ? 'Seller' : user?.role}</p>
               </div>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto">
               {navLinks.map((link) => (
                 <Link 
                   key={link.name}
                   to={link.path} 
                   className={`text-lg font-semibold px-4 py-3 rounded-xl transition flex items-center ${
                     location.pathname === link.path 
                       ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' 
                       : 'text-[var(--color-text-muted)] hover:bg-gray-50 hover:text-[var(--color-text-main)]'
                   }`}
                 >
                   {link.name}
                 </Link>
               ))}
            </div>

            <button 
               onClick={handleLogout}
               className="flex items-center gap-3 text-red-500 font-bold text-lg mt-auto pb-10 px-4 hover:bg-red-50 py-3 rounded-xl transition"
            >
               <LogOut size={22} /> Logout
            </button>
         </div>
      </div>

      <main className="w-full py-10 px-0">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;