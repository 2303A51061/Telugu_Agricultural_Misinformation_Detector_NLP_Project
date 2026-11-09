import React, { useEffect, useState } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Loader2 
} from 'lucide-react';
import { fetchHistory, clearAllHistory, getExportHistoryUrl } from '../services/api';

export default function History() {
  const [history, setHistory] = useState({ total: 0, records: [] });
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const loadHistory = () => {
    setLoading(true);
    fetchHistory(search, filterClass, 100, 0)
      .then((res) => {
        if (res && res.success) setHistory(res.data);
      })
      .catch((err) => console.error('Failed to load history:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, [filterClass]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadHistory();
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear all prediction history? This action cannot be undone.')) {
      setClearing(true);
      try {
        await clearAllHistory();
        setHistory({ total: 0, records: [] });
      } catch (e) {
        console.error(e);
      } finally {
        setClearing(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-agri-600 uppercase tracking-wider block mb-1">
            SQLite Local Database
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prediction History & Audit Log
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Locally persisted record of past predictions, confidence scores, and evaluated Telugu texts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={getExportHistoryUrl()}
            download="telugu_prediction_history.csv"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={handleClear}
            disabled={clearing || history.records.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Telugu text in history..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-500 font-telugu"
          />
        </form>

        {/* Class Filter */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-600">Filter Class:</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="rounded-lg border border-slate-300 py-1.5 px-3 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
          >
            <option value="">All Predictions ({history.total})</option>
            <option value="INFORMATION">Genuine Information</option>
            <option value="MISINFORMATION">Misinformation</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-agri-600" />
            <span>Loading prediction logs...</span>
          </div>
        ) : history.records.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Database className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No predictions found</p>
            <p className="text-xs text-slate-400 mt-1">
              Analyze some Telugu texts on the Text Detection page to populate the history.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-40">Date & Time</th>
                  <th className="py-3 px-4">Telugu Agricultural Text</th>
                  <th className="py-3 px-4 text-center w-36">Predicted Class</th>
                  <th className="py-3 px-4 text-center w-28">Confidence</th>
                  <th className="py-3 px-4 w-44">Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {history.records.map((row) => {
                  const isMisinfo = row.predicted_label === 'MISINFORMATION';
                  const dateStr = new Date(row.timestamp).toLocaleString();

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-bold">
                        {row.id}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-900 telugu-text text-sm">
                        {row.news_text}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isMisinfo
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isMisinfo ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          <span>{row.predicted_label}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {row.confidence}%
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {row.model_name || 'Logistic Regression'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Privacy note */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <span>
          🔒 All predictions are stored locally on your machine in SQLite. No user-entered text is transmitted to external cloud APIs.
        </span>
        <span className="font-mono text-slate-400 text-[11px]">sqlite3 storage</span>
      </div>
    </div>
  );
}
