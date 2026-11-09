import React, { useState } from 'react';
import { Sparkles, Trash2, HelpCircle, ArrowRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import PredictionCard from '../components/PredictionCard';
import { predictTeluguText } from '../services/api';

const QUICK_EXAMPLES = [
  {
    label: 'Genuine Example 1 (Seeds)',
    text: 'విత్తనాలను సరైన తేమ ఉన్న ప్రదేశంలో నిల్వ చేయాలి.',
    expected: 'INFORMATION'
  },
  {
    label: 'Misinformation Example 1 (Fertilizer)',
    text: 'ఈ ఎరువును వాడితే ఒక్క రోజులో పంట దిగుబడి రెట్టింపు అవుతుంది',
    expected: 'MISINFORMATION'
  },
  {
    label: 'Genuine Example 2 (Pesticides)',
    text: 'రైతులకు సమాచారం: పురుగుమందును లేబుల్ సూచనల ప్రకారం ఉపయోగించాలి. అని ఒక సందేశంలో ప్రచారం చేస్తున్నారు.',
    expected: 'INFORMATION'
  },
  {
    label: 'Misinformation Example 2 (Crop Disease)',
    text: 'ఈ మందు అన్ని పంట వ్యాధులను ఒక్క రోజులో నయం చేస్తుంది. అని ఒక సందేశంలో ప్రచారం చేస్తున్నారు.',
    expected: 'MISINFORMATION'
  }
];

export default function Detection() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!inputText || !inputText.trim()) {
      setError('దయచేసి వ్యవసాయ సమాచారాన్ని నమోదు చేయండి (Please enter Telugu text).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await predictTeluguText(inputText.trim());
      if (response && response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Prediction request failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend prediction service.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const handleSelectExample = (exText) => {
    setInputText(exText);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-agri-600 uppercase tracking-wider block mb-1">
          Telugu NLP Inference
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Telugu Agricultural Text Misinformation Detection
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter or paste Telugu social media news or WhatsApp advisories to evaluate legitimacy using the trained Scikit-Learn TF-IDF model.
        </p>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handlePredict} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="teluguText" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                తెలుగు వ్యవసాయ సమాచారం (Telugu Text Input):
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {inputText.length} characters
              </span>
            </div>

            <textarea
              id="teluguText"
              rows={5}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="ఇక్కడ వ్యవసాయానికి సంబంధించిన తెలుగు సమాచారాన్ని నమోదు చేయండి..."
              className="w-full rounded-2xl border border-slate-300 p-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent telugu-text transition-all resize-y"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Examples */}
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              లేదా ఒక ఉదాహరణను ఎంచుకోండి (Or select a verified dataset sample):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectExample(ex.text)}
                  className="text-left p-3 rounded-xl border border-slate-200 hover:border-agri-400 hover:bg-agri-50/40 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-700 group-hover:text-agri-800 mb-1">
                    <span>{ex.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        ex.expected === 'INFORMATION'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ex.expected}
                    </span>
                  </div>
                  <p className="text-slate-500 line-clamp-1 telugu-text text-[11px]">{ex.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClear}
              disabled={loading || (!inputText && !result)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 text-slate-400" />
              <span>Clear</span>
            </button>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-agri-600 hover:bg-agri-700 text-white font-bold text-sm shadow-sm hover:shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Features...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Predict Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Prediction Analysis</h2>
            <span className="text-xs text-slate-400">Stored in local SQLite database</span>
          </div>
          <PredictionCard result={result} />
        </div>
      )}
    </div>
  );
}
