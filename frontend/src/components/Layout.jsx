import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, PlusCircle, List, ShoppingBag, Briefcase, LogOut, User } from 'lucide-react';

export default function Layout({ children, user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path 
    ? "bg-white/15 text-white shadow-md" 
    : "text-white/70 hover:bg-white/10 hover:text-white";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-primary text-white p-6 flex flex-col shadow-xl z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider">QUBIC</h1>
            <p className="text-[10px] text-white/60 uppercase tracking-widest">Cosmos</p>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          {user === 'admin' ? (
            <>
              <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 mt-4 px-4">Admin Tools</div>
              <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/dashboard')}`}>
                <Shield className="w-5 h-5" />
                Validator Panel
              </Link>
            </>
          ) : (
            <>
              <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 mt-4 px-4">My Portfolio</div>
              <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/dashboard')}`}>
                <Briefcase className="w-5 h-5" />
                My Assets
              </Link>
              <Link to="/register" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/register')}`}>
                <PlusCircle className="w-5 h-5" />
                Register Asset
              </Link>

              <div className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 mt-8 px-4">Market</div>
              <Link to="/marketplace" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive('/marketplace')}`}>
                <ShoppingBag className="w-5 h-5" />
                Marketplace
              </Link>
            </>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="pt-6 border-t border-white/15">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <User className="w-4 h-4 text-white/80" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user === 'admin' ? 'Administrator' : 'User'}
              </p>
              <p className="text-xs text-white/50 truncate font-mono">
                {user === 'admin' ? 'System Access' : `${user.substring(0, 8)}...`}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-red-500/20 hover:text-red-200 text-white/70 py-2 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Disconnect Wallet
          </button>

          <div className="mt-6 text-[10px] text-white/40 text-center">
            Qubic Hackathon 2025
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-surface">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  );
}
