import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Database, 
  CheckCircle, 
  AlertOctagon, 
  Award, 
  ArrowRight, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  Layers,
  ChevronRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { fetchDashboard } from '../services/api';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then((res) => {
        if (res && res.success) setStats(res.data);
      })
      .catch((err) => console.error('Dashboard load failed:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-900 via-forest-800 to-agri-900 text-white p-8 md:p-12 shadow-lg border border-agri-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-500/20 text-agri-300 text-xs font-semibold mb-4 border border-agri-400/30">
            <Award className="w-3.5 h-3.5" />
            <span>Fake-News Detection</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            NLP-Based Detection of Agricultural Misinformation in Telugu Social Media
          </h1>

          <p className="text-agri-100/90 text-sm md:text-base leading-relaxed mb-8">
            A specialized Machine Learning and Natural Language Processing system engineered to identify false, 
            exaggerated, unsupported, or fraudulent agricultural claims in Telugu social media posts. Protecting 
            farming communities through verified language intelligence.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/detect"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-agri-500 hover:bg-agri-400 text-slate-950 font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm group"
            >
              <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Analyze Agricultural Text</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/samples"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all text-sm"
            >
              <Database className="w-4 h-4" />
              <span>Explore 3,200 Records</span>
            </Link>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none w-96 h-96">
          <img src="/logo.svg" alt="watermark" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Actual Project Statistics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Verified Dataset & Model Metrics</h2>
          <span className="text-xs text-slate-500">Live data from TAM_D_FINAL_3200_RECORDS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Curated Records"
            value={stats ? stats.totalRecords.toLocaleString() : '3,200'}
            subtitle="14 distinct agricultural topics"
            badge="Balanced 50/50"
            icon={Database}
            color="emerald"
          />
          <StatCard
            title="Genuine Information"
            value={stats ? stats.informationRecords.toLocaleString() : '1,600'}
            subtitle="Verified advisories & guidance"
            badge="50.0%"
            icon={CheckCircle}
            color="emerald"
          />
          <StatCard
            title="Misinformation Claims"
            value={stats ? stats.misinformationRecords.toLocaleString() : '1,600'}
            subtitle="Exaggerated & unverified claims"
            badge="50.0%"
            icon={AlertOctagon}
            color="red"
          />
          <StatCard
            title="Selected ML Model"
            value={stats ? stats.selectedModel : 'Logistic Regression'}
            subtitle="Highest F1-score on test split"
            badge="100% Accuracy"
            icon={Cpu}
            color="blue"
          />
        </div>
      </div>

      {/* How the System Works Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-semibold text-agri-600 uppercase tracking-wider block mb-1">
            System Architecture
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            How the Telugu Misinformation Pipeline Works
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            End-to-end execution flow from raw Telugu social text to Scikit-Learn prediction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-agri-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-700 font-bold flex items-center justify-center mb-4 text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Input & Validation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Farmer or researcher submits Telugu agricultural text from WhatsApp, YouTube, or social media.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-agri-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-700 font-bold flex items-center justify-center mb-4 text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Telugu NLP Preprocessing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Applies Unicode NFC normalization, removes whitespace anomalies, and preserves Telugu characters.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-agri-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-agri-100 text-agri-700 font-bold flex items-center justify-center mb-4 text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">TF-IDF Vectorization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extracts unigram & bigram features against the 632 trained vocabulary tokens with smoothed IDF weights.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-agri-50 border border-agri-200 relative group">
            <div className="w-10 h-10 rounded-xl bg-agri-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-agri-950 mb-2">Model Classification</h3>
            <p className="text-xs text-agri-800 leading-relaxed">
              Computes logistic sigmoid probability to classify as INFORMATION or MISINFORMATION with confidence score.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/detect"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-agri-400 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-agri-700 transition-colors">
              Live Text Detection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste or type Telugu agricultural text to test the actual machine learning model in real-time.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-agri-600 group-hover:text-agri-700">
            <span>Open Predictor</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/analytics"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-agri-400 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
              EDA Analytics & Charts
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspect class distributions, 14 topic breakdowns, text lengths, and top 20 Telugu word frequencies.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:text-blue-700">
            <span>View EDA Charts</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/performance"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-agri-400 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">
              Model Performance
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare Logistic Regression, Naive Bayes, Linear SVM, and MuRIL Transformer on 640 test samples.
            </p>
          </div>
          <div className="mt-4 flex items-center text-xs font-semibold text-amber-600 group-hover:text-amber-700">
            <span>View Evaluation</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
