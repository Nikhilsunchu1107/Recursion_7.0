import React from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <SideNav />
      <main className="ml-0 md:ml-64 min-h-screen pb-24 md:pb-12 px-6 lg:px-12 pt-24">
        <header className="fixed top-0 left-0 md:left-64 right-0 z-30 flex justify-between items-center px-6 py-4 bg-[#111319]/60 backdrop-blur-xl">
          <div className="flex items-center gap-4 flex-1">
            <span className="md:hidden text-lg font-black text-[#e2e2eb]">Competitor Spy</span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-extrabold text-[#e2e2eb] tracking-tight">Your Profile</h2>

          <div className="bg-[#1e1f26] rounded-2xl p-8 border border-white/5 flex items-center gap-6 shadow-xl">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#adc6ff] to-[#4d8eff] flex items-center justify-center text-[#00285d] font-bold text-3xl shrink-0">
              {user?.name?.substring(0, 2).toUpperCase() || 'AC'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#e2e2eb]">{user?.name || 'Alex Chen'}</h3>
              <p className="text-[#9ea0a3] mb-2">{user?.email || 'alex@example.com'}</p>
              <span className="px-3 py-1 bg-white/5 text-[#adc6ff] text-xs font-bold rounded uppercase tracking-wide">
                {user?.role || 'Pro Intelligence'}
              </span>
            </div>
          </div>

          <div className="bg-[#1e1f26] rounded-2xl p-8 border border-white/5 space-y-6 shadow-xl">
            <h4 className="text-xl font-bold text-[#e2e2eb]">Account Settings</h4>
            
            <div className="flex justify-between items-center py-4 border-b border-white/5">
              <div>
                <p className="font-bold text-[#e2e2eb]">Subscription Plan</p>
                <p className="text-sm text-[#9ea0a3]">Pro Intelligence (Active)</p>
              </div>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#e2e2eb] text-sm font-bold rounded-lg transition-colors">
                Manage
              </button>
            </div>

            <div className="flex justify-between items-center py-4 border-b border-white/5">
              <div>
                <p className="font-bold text-[#e2e2eb]">Email Notifications</p>
                <p className="text-sm text-[#9ea0a3]">Weekly competitor digests</p>
              </div>
              <button className="px-4 py-2 bg-[#adc6ff] text-[#00285d] text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">
                Enabled
              </button>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <p className="font-bold text-red-400">Sign Out</p>
                <p className="text-sm text-[#9ea0a3]">Log out of this device</p>
              </div>
              <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-red-400/10 hover:bg-red-400/20 text-red-400 text-sm font-bold rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
