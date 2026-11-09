import React, { useEffect, useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Cpu, 
  BarChart2, 
  CheckCheck, 
  TrendingUp, 
  HelpCircle,
  Loader2 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { fetchModelPerformance } from '../services/api';

export default function ModelPerformance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelPerformance()
      .then((res) => {
        if (res && res.success) setData(res.data);
      })
      .catch((err) => console.error('Failed to load performance metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-agri-600" />
        <span>Loading model evaluation results...</span>
      </div>
    );
  }

  const comparisonData = (data?.models || []).map((m) => ({
    name: m.name,
    Accuracy: m.accuracy,
    Precision: m.precision,
    Recall: m.recall,
    F1_Score: m.f1Score
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-agri-600 uppercase tracking-wider block mb-1">
          Steps 8, 9 & 11 Model Evaluation
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Model Evaluation & Comparative Benchmark
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Rigorous evaluation across 4 candidate models evaluated on 640 held-out test records (320 genuine information, 320 misinformation).
        </p>
      </div>

      {/* Selected Model Highlight Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-agri-500/10 via-emerald-500/5 to-white border border-agri-300 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-agri-600 text-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-agri-800 uppercase tracking-wider">
                Production Selected Model
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-agri-200 text-agri-900">
                Step 11 Decision
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Logistic Regression with TF-IDF N-Grams
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Selected as the final model based on 100% test accuracy and balanced probability calibration across 
              both classes, with sub-millisecond latency and zero deep-learning GPU overhead.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-agri-200 shadow-2xs">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Test Accuracy</span>
            <span className="text-2xl font-black text-agri-700">100.0%</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Misinfo F1</span>
            <span className="text-2xl font-black text-agri-700">100.0%</span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">Actual Benchmark Comparison Table</h3>
          <p className="text-xs text-slate-500">
            Metrics calculated directly from Step 8 Classification Report and Step 11 Final Model Selection.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Model Name</th>
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4 text-center">Accuracy (%)</th>
                <th className="py-3 px-4 text-center">Precision (%)</th>
                <th className="py-3 px-4 text-center">Recall (%)</th>
                <th className="py-3 px-4 text-center">F1-Score (%)</th>
                <th className="py-3 px-4 text-center">Selection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(data?.models || []).map((model, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    model.isBest ? 'bg-agri-50/40 font-semibold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 text-slate-900 flex items-center gap-2">
                    {model.isBest && <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0" />}
                    <span>{model.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{model.type}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">{model.accuracy.toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-center text-slate-700">{model.precision.toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-center text-slate-700">{model.recall.toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-center font-bold text-agri-700">{model.f1Score.toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-center">
                    {model.isBest ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-agri-100 text-agri-800 border border-agri-300">
                        Final Model
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                        Evaluated
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recharts Multi-Metric Bar Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-5 h-5 text-agri-600" />
            <h3 className="text-base font-bold text-slate-900">
              Comparative Model Metrics (Test Split: 640 Samples)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Multi-metric performance comparison on the stratified 20% test dataset.
          </p>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[90, 102]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
              <Legend />
              <Bar dataKey="Accuracy" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Precision" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recall" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="F1_Score" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confusion Matrix Visualizer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-base font-bold text-slate-900">
            Step 10 Error Analysis & Confusion Matrix (Selected Model: Logistic Regression)
          </h3>
          <p className="text-xs text-slate-500">
            Actual test set confusion matrix evaluating 640 unseen samples.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            {/* True Negatives */}
            <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                True Information (TN)
              </span>
              <span className="text-3xl font-black text-emerald-900 block my-1">320</span>
              <span className="text-[10px] text-emerald-700">Correctly identified genuine guidance</span>
            </div>

            {/* False Positives */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-600 uppercase block">
                False Positives (FP)
              </span>
              <span className="text-3xl font-black text-slate-700 block my-1">0</span>
              <span className="text-[10px] text-slate-500">Info flagged as Misinfo (0 errors)</span>
            </div>

            {/* False Negatives */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-600 uppercase block">
                False Negatives (FN)
              </span>
              <span className="text-3xl font-black text-slate-700 block my-1">0</span>
              <span className="text-[10px] text-slate-500">Misinfo missed as Info (0 errors)</span>
            </div>

            {/* True Positives */}
            <div className="p-4 rounded-xl bg-rose-100 border border-rose-300">
              <span className="text-[10px] font-bold text-rose-800 uppercase block">
                True Misinformation (TP)
              </span>
              <span className="text-3xl font-black text-rose-900 block my-1">320</span>
              <span className="text-[10px] text-rose-700">Correctly detected misinformation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
