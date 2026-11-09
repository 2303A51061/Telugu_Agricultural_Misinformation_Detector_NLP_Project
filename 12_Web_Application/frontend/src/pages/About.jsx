import React from 'react';
import { 
  FileText, 
  Target, 
  Database, 
  Cpu, 
  Layers, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-100 text-agri-800 text-xs font-semibold mb-3 border border-agri-300">
          <FileText className="w-3.5 h-3.5" />
          <span>Fake-News Detection</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          NLP-Based Detection of Agricultural Misinformation in Telugu Social Media – Fake-News Detection
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Comprehensive project report covering research motivation, corpus engineering, algorithmic modeling, and limitations.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-agri-700 font-bold text-sm uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          <span>1. Problem Statement</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">
          The Threat of Unverified Agricultural Advice on Telugu Social Channels
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Agriculture-related information concerning seeds, fertilizers, pesticides, crop diseases, irrigation, 
          soil management, weather alerts, crop yield claims, organic farming, government subsidies, market pricing, 
          and pest control profoundly influences farmers' day-to-day decisions. In regional Telugu social media 
          (WhatsApp groups, YouTube comments, and Facebook agricultural communities), widespread unverified claims, 
          unsupported pesticide mixtures, and exaggerated organic formulations can lead to catastrophic crop failure, 
          financial ruin, and hazardous agricultural practices. This project formulates an automated Natural Language 
          Processing and Machine Learning pipeline to identify whether a given Telugu agricultural statement is 
          verifiable genuine information or potential misinformation.
        </p>
      </section>

      {/* 2. Objectives & Scope */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Research Objectives</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Core Goals</h3>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
              <span>Curate a structured, balanced Telugu agricultural corpus of 3,200 verified records across 14 topics.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
              <span>Implement customized Telugu NLP text preprocessing including NFC Unicode normalization and tokenization.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
              <span>Extract discriminative n-gram features via TF-IDF vectorization with smoothed inverse document frequency.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0 mt-0.5" />
              <span>Train, evaluate, and benchmark multiple machine learning architectures and transformer baselines.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Scope & Boundaries</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Application Scope</h3>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Specialized strictly for Telugu agricultural dialect, terminology, and social media sentence formats.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Binary classification output: INFORMATION (genuine) vs. MISINFORMATION (false/exaggerated).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Acts as an advisory screening tool for researchers and agricultural extension officers.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. Methodology & Steps 1-12 */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-agri-700 font-bold text-xs uppercase tracking-wider">
          <Workflow className="w-4 h-4" />
          <span>Research Methodology & Execution Steps</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Complete 12-Step Research Roadmap</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 1 — Project Definition</span>
            <span className="text-slate-500">Problem scope, domain taxonomy, and ethical criteria.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 2 — Dataset Creation</span>
            <span className="text-slate-500">Curating 3,200 Telugu claims across 14 agricultural domains.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 3 — Data Cleaning</span>
            <span className="text-slate-500">Validation, duplicate checking, and null removal in Python.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 4 — Exploratory Analysis</span>
            <span className="text-slate-500">Class balance, token lengths, and distribution histograms.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 5 — Telugu NLP Pipeline</span>
            <span className="text-slate-500">Unicode NFC normalization, regex tokenization, and stopwords.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 6 — TF-IDF Vectorization</span>
            <span className="text-slate-500">Bigram extraction yielding 632 learned vocabulary features.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 7 — ML Model Training</span>
            <span className="text-slate-500">Logistic Regression, Naive Bayes, and Linear SVM models.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 8 — Model Evaluation</span>
            <span className="text-slate-500">Accuracy, Precision, Recall, and F1 calculation on 640 test rows.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 9 — Transformer Baselines</span>
            <span className="text-slate-500">MuRIL multilingual Indian language transformer benchmarking.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 10 — Error Analysis</span>
            <span className="text-slate-500">False Positive & False Negative examination on holdout data.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-agri-700 block mb-1">Step 11 — Model Selection</span>
            <span className="text-slate-500">Final selection of Logistic Regression based on F1-score.</span>
          </div>
          <div className="p-3 rounded-xl bg-agri-50 border border-agri-200">
            <span className="font-bold text-agri-800 block mb-1">Step 12 — Web Application</span>
            <span className="text-agri-700">Full-Stack JavaScript React + Express + SQLite application.</span>
          </div>
        </div>
      </section>

      {/* 4. Limitations & Future Enhancements */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Research Limitations & Responsible AI Guidelines</span>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900">Limitations and Future Work</h2>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Corpus Representativeness:</strong> While the 3,200-sample dataset was constructed with 
            diverse agricultural domains, Telugu social media encompasses localized colloquialisms, dialectal slang, 
            and English transliterations (Tanglish/Telugu in Latin script) that may not be captured in formal Unicode text.
          </p>
          <p>
            <strong>Fact-Checking Disclaimer:</strong> Statistical NLP classification predicts patterns based 
            on trained vocabulary. It cannot perform dynamic chemical analysis, verify real-time market pricing, 
            or replace certified agricultural agronomists.
          </p>
          <p>
            <strong>Future Enhancements:</strong> Future iterations can incorporate multi-modal analysis (evaluating 
            WhatsApp image banners and audio voice notes), active retrieval-augmented generation (RAG) linked to 
            ICAR / PJTSAU university fact sheets, and real-time WhatsApp bot integration.
          </p>
        </div>
      </section>
    </div>
  );
}
