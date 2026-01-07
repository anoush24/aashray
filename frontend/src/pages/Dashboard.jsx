import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import context for dynamic username
import { 
  PlusCircle, 
  Calendar, 
  Siren, 
  FileText, 
  Settings,
  Bone
} from 'lucide-react';
import PetCard from '../components/PetCard';
import ActivityItem from '../components/ActivityItem';
import ActionLink from '../components/ActionLink';

const Dashboard = () => {
  const { user } = useAuth(); // Get logged-in user data
  const [activeTab, setActiveTab] = useState('Appointments');

  return (
    <>
      {/* Welcome Header */}
      <header className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-extrabold font-nunito mb-2">
          Hello, {user?.username || 'Friend'}! 👋
        </h1>
        <p className="text-[var(--color-text-muted)] text-lg">
          Here's what's happening with your furry friends today.
        </p>
      </header>

      {/* --- My Pets Section --- */}
      <div className="flex justify-between items-end mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <h2 className="text-xl font-bold font-nunito">My Pets</h2>
        <a href="#" className="text-[var(--color-primary)] font-bold text-sm hover:underline">Manage All</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Pet Card 1 */}
        <PetCard 
          img="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=60" 
          name="Bruno" 
          breed="Golden Retriever"
          stats={{ age: "3 Yrs", sex: "Male", weight: "24kg" }}
        />

        {/* Pet Card 2 */}
        <PetCard 
          img="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=60" 
          name="Luna" 
          breed="Siamese Cat"
          stats={{ age: "1 Yr", sex: "Female", weight: "4kg" }}
        />

        {/* Add Pet Card */}
        <div className="min-h-[250px] rounded-3xl border-2 border-dashed border-[var(--color-primary)] bg-[var(--color-primary)]/5 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--color-primary)]/10 transition group">
          <PlusCircle size={48} className="text-[var(--color-primary)] mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[var(--color-primary)]">Add New Pet</span>
        </div>
      </div>

      {/* --- Dashboard Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-7 duration-1000">
        
        {/* Left: Activity Section */}
        <div className="lg:col-span-2 bg-[var(--color-bg-card)] rounded-3xl p-8 shadow-sm border border-[var(--color-border)]">
          
          {/* Tabs */}
          <div className="flex gap-6 border-b border-[var(--color-border)] mb-6 pb-2">
            {['Appointments', 'Rescue Reports', 'Order History'].map((tab) => (
              <button 
                key={tab}
                className={`pb-2 font-bold text-sm relative transition ${
                  activeTab === tab 
                    ? 'text-[var(--color-primary)]' 
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute -bottom-[9px] left-0 w-full h-[3px] bg-[var(--color-primary)] rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex flex-col gap-0">
            <ActivityItem 
              day="24" month="OCT" 
              title="Vaccination for Bruno" 
              sub="City Vet Clinic • Dr. Aditya" 
              status="Upcoming" 
              statusColor="blue"
            />
            <ActivityItem 
              day="12" month="OCT" 
              title="General Checkup for Luna" 
              sub="PetCare Hospital • Dr. Smith" 
              status="Completed" 
              statusColor="green"
            />
            <ActivityItem 
              day="02" month="OCT" 
              title="Rescue Report #4029" 
              sub="Reported injured stray at Sector 4" 
              status="Resolved" 
              statusColor="orange"
              isRescue={true}
            />
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex flex-col gap-6">
          
          {/* Promo Card */}
          <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
            <h3 className="font-nunito font-extrabold text-2xl mb-2 relative z-10">Shop Essentials</h3>
            <p className="text-white/90 text-sm mb-6 relative z-10">Get 20% off on premium dog food this week.</p>
            <button className="bg-white text-[var(--color-primary)] px-5 py-2.5 rounded-xl font-bold text-sm relative z-10 hover:bg-white/90 transition">
              Shop Now
            </button>
            {/* Background Icon Decoration */}
            <Bone className="absolute -bottom-4 -right-4 w-32 h-32 text-white/20 -rotate-12" />
          </div>

          {/* Quick Links */}
          <div className="bg-[var(--color-bg-card)] rounded-3xl p-6 shadow-sm border border-[var(--color-border)]">
            <h4 className="font-bold text-lg mb-4">Quick Actions</h4>
            <div className="flex flex-col">
              <ActionLink icon={<Calendar size={20} />} text="Book Vet Appointment" />
              <ActionLink icon={<Siren size={20} className="text-[var(--color-accent)]" />} text="Report a Rescue" />
              <ActionLink icon={<FileText size={20} />} text="Write a Blog Post" />
              <ActionLink icon={<Settings size={20} />} text="Account Settings" last={true} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;