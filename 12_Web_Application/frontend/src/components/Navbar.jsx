import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { fetchHealth } from '../services/api';

export default function Navbar() {
  const [online, setOnline] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchHealth()
      .then((data) => {
        if (data && data.status === 'online') setOnline(true);
      })
      .catch(() => setOnline(false));
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Titles */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-agri-50 border border-agri-200 p-1 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="Project Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 group-hover:text-agri-700 transition-colors tracking-tight">
                  Telugu Agricultural Misinformation Detector
                </h1>
                <span className="bg-agri-100 text-agri-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-agri-300">
                  CSE Research
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                An NLP and Machine Learning Based System for Detecting Agricultural Misinformation in Telugu
              </p>
            </div>
          </Link>

          {/* Right Status & Action */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{online ? 'ML Pipeline Active' : 'Connecting ML Service'}</span>
            </div>

            {location.pathname !== '/detect' && (
              <Link
                to="/detect"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-agri-600 hover:bg-agri-700 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Text</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
