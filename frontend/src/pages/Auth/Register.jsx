import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const Register = () => {
  const [role, setRole] = useState('user'); // 'user' or 'hospital'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    contactNumber: '',
    gmap: '', 
    
    address: '',
    licenseNumber: '',
    services: '',
    availableBeds: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      
      if (role === 'user') {
        const { username, password, email, contactNumber, gmap } = formData;
        response = await authService.registerUser({ username, password, email, contactNumber, gmap });
      } else {
        response = await authService.registerHospital(formData);
      }

      // Check for success (Your backend returns { accessToken, refreshToken } on success)
      if (!response.accessToken) {
        throw new Error("Registration failed. Please try again.");
      }

      alert("Registration Successful! Please Log In.");
      navigate('/'); 

    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300 bg-[var(--color-bg-body)]">
      
      {/* Container - Slightly taller for Register form */}
      <div className="flex w-full max-w-[1000px] bg-[var(--color-bg-card)] rounded-[32px] overflow-hidden shadow-2xl flex-col md:flex-row my-8">
        
        {/* --- LEFT SIDE (Brand) --- */}
        <div className="md:w-5/12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] p-8 md:p-12 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -top-[20%] -right-[20%] w-[200px] h-[200px] bg-white/10 rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[5%] left-[10%] w-[100px] h-[100px] bg-white/5 rounded-full pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 text-3xl font-extrabold relative z-10">
            <span className="text-4xl">🐾</span> PetUnity
          </div>
          <h1 className="text-xl md:text-2xl font-semibold leading-relaxed relative z-10 opacity-90 mb-4">
            Join the community.
          </h1>
          <p className="text-white/80 relative z-10">
            {role === 'user' 
              ? "Find your new best friend or help strays in your area." 
              : "Connect your clinic with thousands of pet parents and rescue cases."}
          </p>
        </div>

        {/* --- RIGHT SIDE (Form) --- */}
        <div className="flex-1 p-8 md:p-12 bg-[var(--color-bg-card)]">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold mb-2 text-[var(--color-text-main)]">Create Account</h2>
            <p className="text-[var(--color-text-muted)] text-sm font-medium">It's free and takes 1 minute.</p>
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
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* --- Common Fields --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField id="username" label="Username" placeholder="johndoe123" value={formData.username} onChange={handleChange} />
              <InputField id="contactNumber" label="Phone" placeholder="9876543210" value={formData.contactNumber} onChange={handleChange} />
            </div>

            <InputField id="email" label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
            <InputField id="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            
            <div className="col-span-2">
               <InputField id="gmap" label="Google Maps Link" placeholder="https://goo.gl/maps/..." value={formData.gmap} onChange={handleChange} />
               <p className="text-[10px] text-[var(--color-text-muted)] mt-1 ml-1">Needed for location features (Rescue/Nearby Clinics)</p>
            </div>

            {/* --- Hospital Only Fields --- */}
            {role === 'hospital' && (
              <div className="pt-4 border-t border-[var(--color-border)] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="col-span-2 text-sm font-bold text-[var(--color-primary)]">🏥 Clinic Details</div>
                
                <InputField id="licenseNumber" label="License Number" placeholder="LIC-12345" value={formData.licenseNumber} onChange={handleChange} />
                <InputField id="availableBeds" label="Available Beds" type="number" placeholder="10" value={formData.availableBeds} onChange={handleChange} />
                
                <div className="col-span-1 md:col-span-2">
                   <InputField id="address" label="Full Address" placeholder="123 Vet Street, City" value={formData.address} onChange={handleChange} />
                </div>
                <div className="col-span-1 md:col-span-2">
                   <InputField id="services" label="Services (Comma separated)" placeholder="Vaccination, Surgery, Grooming" value={formData.services} onChange={handleChange} />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full mt-6 p-3 bg-[var(--color-primary)] text-white font-bold text-base rounded-xl hover:bg-[var(--color-primary-hover)] transition-all duration-300 shadow-lg shadow-teal-600/20 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'user' ? 'Pet Owner' : 'Hospital'}`}
            </button>
          </form>

          <div className="text-center mt-6 text-[var(--color-text-muted)] text-sm font-medium">
            Already have an account?{' '}
            <Link to="/" className="text-[var(--color-primary)] font-bold hover:underline">
              Log In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for cleaner JSX
const InputField = ({ id, label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block font-medium mb-1.5 text-xs uppercase tracking-wide text-[var(--color-text-muted)]">{label}</label>
    <input 
      type={type} 
      id={id}
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl text-[var(--color-text-main)] text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200" 
      placeholder={placeholder}
      required 
    />
  </div>
);

export default Register;