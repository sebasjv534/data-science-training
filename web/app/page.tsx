import Link from 'next/link';
import { getModelMetrics } from '../lib/model';

export default function Home() {
  const metrics = getModelMetrics();

  return (
    <div className="space-y-16 pb-12">

      {/* ── Hero ── */}
      <section className="text-center max-w-4xl mx-auto px-4 mt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-xs font-bold mb-6 uppercase tracking-widest stagger-1 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Clinical Grade · Browser-Native Inference
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 stagger-2 animate-fade-in-up">
          Heart Disease Prediction <br className="hidden sm:block" />
          <span className="text-gradient">Powered by ML Ensembles.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto stagger-3 animate-fade-in-up">
          A rigorous academic tool that evaluates 13 clinical parameters using a calibrated Gradient Boosting proxy — 100% client-side, no data leaves your browser.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 stagger-4 animate-fade-in-up">
          <Link
            href="/predict"
            className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
          >
            Launch Assessment
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
          <Link
            href="/guide"
            className="inline-flex justify-center items-center px-8 py-3.5 text-base font-semibold rounded-full text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            Parameter Guide
          </Link>
        </div>
      </section>

      {/* ── Bento Grid ── */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5 max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '450ms' }}>

        {/* Model info */}
        <div className="clinical-card p-8 md:col-span-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-900/20 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-indigo-900/60 border border-indigo-700/40 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{metrics.model_name}</h3>
          <p className="text-slate-400 leading-relaxed max-w-lg">
            Gradient Boosting captures complex, non-linear interactions between clinical variables — from Thalassemia defect types to exercise-induced angina — producing superior discrimination over conventional logistic models.
          </p>
        </div>

        {/* ROC-AUC */}
        <div className="clinical-card p-8 md:col-span-4 bg-[#10172a] border-indigo-800/30 flex flex-col justify-center items-center text-center">
          <div className="p-3 bg-emerald-900/40 border border-emerald-800/40 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">ROC-AUC Score</p>
          <h3 className="text-5xl font-black text-white tracking-tight">{(metrics.metrics.roc_auc * 100).toFixed(1)}<span className="text-2xl text-slate-400">%</span></h3>
        </div>

        {/* Dataset info */}
        <div className="clinical-card p-8 md:col-span-12 flex flex-col md:flex-row items-center gap-8 bg-[#10172a] border-indigo-800/30">
          <div className="w-14 h-14 rounded-2xl bg-indigo-900/60 border border-indigo-700/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1.5">Comprehensive Clinical Dataset</h3>
            <p className="text-slate-400 leading-relaxed">
              Trained on the Kaggle Heart Disease Prediction dataset — 125,000+ stratified patient records covering demographic, biochemical, and electrocardiographic variables. All inference now runs client-side via a calibrated logistic sigmoid proxy derived from the model's feature influence map.
            </p>
          </div>
        </div>

      </section>

      {/* ── Disclaimer ── */}
      <section className="max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <div className="rounded-2xl p-6 border border-amber-700/30 bg-amber-950/20 flex gap-4 items-start">
          <div className="mt-0.5 text-amber-500 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-400 mb-1 uppercase tracking-wider">Academic Disclaimer</h4>
            <p className="text-sm text-amber-200/60 leading-relaxed">
              CardioPredict is designed exclusively for graduate-level research and educational demonstration. Model outputs must <strong>never</strong> substitute for professional medical advice, formal physician diagnosis, or clinically supervised treatment.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
