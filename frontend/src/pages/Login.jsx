import React, { useState } from 'react';
import { Shield, Wallet, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onLogin(input.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">AEGIS REGISTRY</h1>
          <p className="text-blue-100 mt-2 text-sm">Decentralized Real World Asset Management</p>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Connect your wallet to manage your assets</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">
                Qubic ID / Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your ID or 'admin'..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm transition-all"
                  autoFocus
                />
                <Wallet className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
            >
              Connect Wallet
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Demo Users Helper */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-bold">Quick Demo Access</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setInput('admin')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-mono rounded border border-slate-200 transition-colors"
              >
                admin
              </button>
              <button 
                onClick={() => setInput('0x12345678901234567890')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-mono rounded border border-slate-200 transition-colors"
              >
                user (0x123...)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
