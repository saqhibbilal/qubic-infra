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
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in border border-primary/10">
        {/* Header */}
        <div className="bg-primary p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">QUBIC COSMOS</h1>
          <p className="text-white/80 mt-2 text-sm">Decentralized Real World Asset Management</p>
        </div>

        {/* Body */}
        <div className="p-8 bg-surface">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-primary">Welcome Back</h2>
            <p className="text-primary/70 text-sm">Connect your wallet to manage your assets</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-primary/70 uppercase mb-2 tracking-wider">
                Qubic ID / Wallet Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your ID or 'admin'..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm transition-all text-primary"
                  autoFocus
                />
                <Wallet className="w-5 h-5 text-primary/50 absolute left-4 top-4" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Connect Wallet
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Demo Users Helper */}
          <div className="mt-8 pt-6 border-t border-primary/15 text-center">
            <p className="text-xs text-primary/60 mb-3 uppercase tracking-wider font-bold">Quick Demo Access</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setInput('admin')}
                className="px-3 py-1.5 bg-white hover:bg-primary/10 text-primary text-xs font-mono rounded border border-primary/20 transition-colors"
              >
                admin
              </button>
              <button 
                onClick={() => setInput('0x12345678901234567890')}
                className="px-3 py-1.5 bg-white hover:bg-primary/10 text-primary text-xs font-mono rounded border border-primary/20 transition-colors"
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
