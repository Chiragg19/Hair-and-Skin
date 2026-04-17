"use client";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import {auth} from '../../../firebase/config';

export default function StudioPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Credentials not recognized.");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505]" />;

  // ==========================================
  // VIEW 1: LOGIN ONLY 
  // (The 'return' here stops the code execution)
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] animate-in fade-in duration-700">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-serif text-white mb-2 tracking-tighter">
              Hair <span className="text-[#d4b78f]">&</span> Skin
            </h1>
            <p className="text-[#d4b78f] text-[10px] tracking-[5px] uppercase opacity-70">Private Studio</p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[40px] shadow-2xl space-y-5">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#d4b78f] transition-all text-sm"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#d4b78f] transition-all text-sm"
              required
            />
            {error && <p className="text-red-500 text-[10px] text-center italic">{error}</p>}
            <button type="submit" className="w-full bg-[#d4b78f] text-black py-4 rounded-2xl font-bold text-[11px] tracking-widest uppercase hover:bg-white transition-all">
              Enter Studio
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: CATALOG ONLY
  // (This only runs if user IS logged in)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row animate-in fade-in duration-1000">
      
      {/* Exclusive Sidebar */}
      <aside className="w-full md:w-[350px] p-12 border-r border-white/5 flex flex-col justify-between h-screen sticky top-0 bg-[#050505]">
        <div>
          <h2 className="text-5xl font-serif mb-6 leading-tight tracking-tighter">
            Hair <span className="text-[#d4b78f] italic">&</span><br/>Skin.
          </h2>
          <div className="pt-8 border-t border-white/5">
            <p className="text-[9px] text-gray-600 tracking-[3px] uppercase mb-1">Authenticated Account</p>
            <p className="text-[#d4b78f] text-sm font-serif italic truncate">{user.email}</p>
          </div>
        </div>

        <button 
          onClick={() => auth.signOut()}
          className="text-left text-[10px] tracking-[3px] uppercase text-gray-600 hover:text-white transition-colors"
        >
          — Logout
        </button>
      </aside>

      {/* Main Catalog */}
      <main className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-serif mb-12 tracking-tight">Curated Treatments</h2>
          
          <div className="grid grid-cols-1 gap-12">
            {/* Treatment Item */}
            <div className="group border-b border-white/5 pb-8 hover:border-[#d4b78f] transition-colors">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-2xl font-serif tracking-tight">Signature Session</h3>
                <span className="text-xl font-light italic">₹2,500</span>
              </div>
              <p className="text-gray-500 text-sm font-light mb-6">A bespoke experience designed for your aesthetic identity.</p>
              <button className="text-[10px] tracking-[3px] uppercase text-[#d4b78f] font-bold hover:text-white transition-colors">
                + Reserve Slot
              </button>
            </div>
            
            {/* Additional Treatment Item */}
            <div className="group border-b border-white/5 pb-8 hover:border-[#d4b78f] transition-colors">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-2xl font-serif tracking-tight">Hydration Therapy</h3>
                <span className="text-xl font-light italic">₹3,800</span>
              </div>
              <p className="text-gray-500 text-sm font-light mb-6">Advanced clinical skincare to restore radiance.</p>
              <button className="text-[10px] tracking-[3px] uppercase text-[#d4b78f] font-bold hover:text-white transition-colors">
                + Reserve Slot
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}