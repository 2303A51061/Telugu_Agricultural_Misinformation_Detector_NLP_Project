import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  BookOpen, 
  BarChart3, 
  Award, 
  History, 
  Info,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard Overview', icon: Home, badge: 'Home' },
  { path: '/detect', label: 'Telugu Text Detection', icon: Sparkles, badge: 'Predict' },
  { path: '/samples', label: 'Dataset Samples', icon: BookOpen, badge: '3,200' },
  { path: '/analytics', label: 'EDA Analytics', icon: BarChart3, badge: 'Charts' },
  { path: '/performance', label: 'Model Evaluation', icon: Award, badge: '100% F1' },
  { path: '/history', label: 'Prediction History', icon: History, badge: 'SQLite' },
  { path: '/about', label: 'About Research', icon: Info, badge: 'Steps 1-12' },
];

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 lg:min-h-[calc(100vh-5rem)] flex-shrink-0 p-4">
      <div className="mb-4 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        System Navigation
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-agri-50 text-agri-800 border border-agri-200 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-500 group-hover:text-agri-600 transition-colors" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
            </NavLink>
          );
        })}
      </nav>

      {/* Dataset quick stat pill */}
      <div className="mt-8 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <div className="font-semibold text-slate-800 mb-1">Trained Research Model</div>
        <p className="text-[11px] text-slate-500 mb-2">
          Scikit-Learn Logistic Regression with 632 TF-IDF N-Gram features.
        </p>
        <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>TF-IDF Bigrams</span>
          <span className="text-agri-700 font-bold">100% Acc</span>
        </div>
      </div>
    </aside>
  );
}
