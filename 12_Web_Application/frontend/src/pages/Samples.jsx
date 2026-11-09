import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Tag, 
  ArrowRight,
  Loader2
} from 'lucide-react';
import { fetchSamples, predictTeluguText } from '../services/api';
import PredictionCard from '../components/PredictionCard';

export default function Samples() {
  const [samples, setSamples] = useState({ information: [], misinformation: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, INFORMATION, MISINFORMATION
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [evaluatingId, setEvaluatingId] = useState(null);
  const [liveResults, setLiveResults] = useState({});

  useEffect(() => {
    fetchSamples()
      .then((res) => {
        if (res && res.success) {
          setSamples(res.data);
        }
      })
      .catch((err) => console.error('Failed to load samples:', err))
      .finally(() => setLoading(false));
  }, []);

  const allList = [
    ...(samples.information || []),
    ...(samples.misinformation || [])
  ];

  // Extract unique topics
  const topics = Array.from(new Set(allList.map((s) => s.topic))).filter(Boolean);

  // Filtered samples
  const filtered = allList.filter((item) => {
    const matchesClass = activeTab === 'ALL' || item.label === activeTab;
    const matchesTopic = selectedTopic === 'ALL' || item.topic === selectedTopic;
    return matchesClass && matchesTopic;
  });

  const handleTestSample = async (sample) => {
    setEvaluatingId(sample.id);
    try {
      const res = await predictTeluguText(sample.text);
      if (res && res.success) {
        setLiveResults((prev) => ({
          ...prev,
          [sample.id]: res.data
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-agri-600 uppercase tracking-wider block mb-1">
          Dataset Explorer
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Telugu Agricultural Dataset Samples
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore verified records from the 3,200 dataset collection across 14 agricultural topics. 
          Click "Test Live Model" on any record to compare its ground-truth label against the machine learning prediction.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Class Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Samples ({allList.length})
          </button>
          <button
            onClick={() => setActiveTab('INFORMATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'INFORMATION'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Information ({samples.information?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('MISINFORMATION')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'MISINFORMATION'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Misinformation ({samples.misinformation?.length || 0})</span>
          </button>
        </div>

        {/* Topic Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-600">Agricultural Topic:</span>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="rounded-lg border border-slate-300 py-1.5 px-3 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-agri-500 font-medium"
          >
            <option value="ALL">All Topics (14 Topics)</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Samples List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-agri-600" />
          <span>Loading authentic Telugu agricultural samples...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => {
            const isInfo = item.label === 'INFORMATION';
            const livePred = liveResults[item.id];
            const isEvaluating = evaluatingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Meta info & Labels */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                      {item.id}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      Topic: <strong>{item.topic}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Dataset Label */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 font-medium">Dataset Label:</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isInfo
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* Live Prediction Badge if evaluated */}
                    {livePred && (
                      <div className="flex items-center gap-1.5 animate-fadeIn">
                        <span className="text-[11px] text-slate-400 font-medium">Model Output:</span>
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full text-white shadow-xs ${
                            livePred.predicted_label === 'INFORMATION' ? 'bg-emerald-600' : 'bg-rose-600'
                          }`}
                        >
                          {livePred.predicted_label} ({livePred.confidence}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Telugu Text Content */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                  <p className="text-base text-slate-900 telugu-text leading-relaxed">
                    {item.text}
                  </p>
                  {item.reason && (
                    <div className="mt-2 text-xs text-slate-500 italic">
                      Annotation Context: {item.reason}
                    </div>
                  )}
                </div>

                {/* Test Action & Live Display */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-400">
                    {livePred ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Live inference verified with Scikit-Learn
                      </span>
                    ) : (
                      'Click to run inference through trained model'
                    )}
                  </div>

                  <button
                    onClick={() => handleTestSample(item)}
                    disabled={isEvaluating}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs disabled:opacity-50"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{livePred ? 'Re-Test Sample' : 'Test Live Model'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Live Prediction Details */}
                {livePred && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <PredictionCard result={livePred} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
