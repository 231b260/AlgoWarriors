import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Activity, 
  UserCircle, 
  LogOut,
  Heart
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('user_id');

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { id: 'analysis', icon: Stethoscope, label: 'Diagnosis', path: '/' }, // Clinical analysis is the same as home if not in result view
    { id: 'history', icon: UserCircle, label: 'My Vault', path: '/history' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-6 top-6 bottom-6 w-24 coral-gradient rounded-[2.5rem] flex flex-col items-center py-10 shadow-2xl z-50">
      {/* Logo */}
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="mb-12 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg">
          <Heart className="w-8 h-8 text-white fill-white/10" />
        </div>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col gap-8">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <button
              onClick={() => navigate(item.path)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative z-10
                ${isActive(item.path) 
                  ? 'bg-white shadow-lg text-[#F47C65]' 
                  : 'text-white/80 hover:text-white'
                }`}
            >
              <item.icon className="w-6 h-6" />
            </button>
            
            {/* Tooltip */}
            <div className="absolute left-20 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#2E2E2E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
              {item.label}
            </div>

            {/* Active Indicator (Pill Background is handles by the button bg-white) */}
          </motion.div>
        ))}
      </div>

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all"
      >
        <LogOut className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default Sidebar;
