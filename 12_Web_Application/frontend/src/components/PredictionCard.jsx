import React from 'react';
import { CheckCircle2, AlertTriangle, Cpu, Tag, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function PredictionCard({ result }) {
  if (!result) return null;

  const isMisinfo = result.predicted_label === 'MISINFORMATION';

  return (
    <div
      className={`rounded-2xl border p-6 transition-all shadow-md animate-fadeIn ${
        isMisinfo
          ? 'bg-gradient-to-br from-rose-50/60 via-red-50/40 to-white border-rose-300'
          : 'bg-gradient-to-br from-emerald-50/60 via-teal-50/40 to-white border-emerald-300'
      }`}
    >
      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${
              isMisinfo ? 'bg-rose-600' : 'bg-emerald-600'
            }`}
          >
            {isMisinfo ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Predicted Classification
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-extrabold tracking-tight ${
                  isMisinfo ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {result.predicted_label}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isMisinfo
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {isMisinfo ? 'తప్పుడు సమాచారం' : 'విశ్వసనీయ సమాచారం'}
              </span>
            </div>
          </div>
        </div>

        {/* Confidence Percentage */}
        <div className="text-right">
          <div className="text-xs font-medium text-slate-500">Model Confidence</div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {result.confidence}%
          </div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-6 bg-white/80 p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-emerald-700">Genuine Information: {result.p_information}%</span>
          <span className="text-rose-700">Misinformation: {result.p_misinformation}%</span>
        </div>
        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${result.p_information}%` }}
            className="bg-emerald-500 h-full transition-all duration-700 ease-out"
            title={`Information: ${result.p_information}%`}
          />
          <div
            style={{ width: `${result.p_misinformation}%` }}
            className="bg-rose-500 h-full transition-all duration-700 ease-out"
            title={`Misinformation: ${result.p_misinformation}%`}
          />
        </div>
      </div>

      {/* Original Telugu Text */}
      <div className="mb-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" />
          <span>Analyzed Telugu News Text:</span>
        </div>
        <p className="text-base text-slate-900 telugu-text leading-relaxed font-medium">
          "{result.original_text}"
        </p>
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1 text-xs">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>సిస్టమ్ విశ్లేషణ (System Explanation):</span>
          </div>
          <p className="telugu-text text-sm leading-relaxed">{result.explanation}</p>
        </div>
      )}

      {/* Matched Feature Tokens */}
      {result.matched_features && result.matched_features.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-agri-600" />
            <span>Matched Learned TF-IDF Vocabulary Tokens:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.matched_features.map((feat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs font-telugu"
              >
                {feat.token}
                <span className="text-[10px] text-slate-400 ml-1 font-mono">({feat.ngram}-gram)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Engine & Safety Disclaimer */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-slate-400" />
          <span>Model: <strong className="text-slate-700">{result.model_name}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-400">{result.engine}</span>
        </div>

        <div className="flex items-center gap-1.5 text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Automated research prediction – not a certified expert fact-check.</span>
        </div>
      </div>
    </div>
  );
}
