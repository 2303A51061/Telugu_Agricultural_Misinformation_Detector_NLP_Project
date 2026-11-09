import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Logo" className="w-6 h-6 object-contain opacity-80" />
          <div>
            <p className="font-semibold text-slate-700">
              NLP-Based Detection of Agricultural Misinformation in Telugu Social Media
            </p>
            <p className="text-slate-400">
              
            </p>
          </div>
        </div>

        <div className="text-center md:text-right">
          <p className="text-slate-600 font-medium">
            Academic Research Prototype • Reusing Real Scikit-Learn Model & Preprocessed Dataset
          </p>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Telugu NLP Preprocessing • TF-IDF Bigram Feature Extraction • SQLite History
          </p>
        </div>
      </div>
    </footer>
  );
}
