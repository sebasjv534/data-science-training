'use client';

import { useEffect, useState } from 'react';
import { ModelMetrics } from '../../types/prediction';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ── Dark-mode custom tooltip ─────────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1117] border border-indigo-900/60 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-base font-black text-indigo-300">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`clinical-card p-6 flex flex-col justify-between relative overflow-hidden group bg-[#161b22]`}>
      <div className={`absolute top-0 right-0 w-28 h-28 rounded-full -translate-y-1/3 translate-x-1/3 opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity ${accent}`} />
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      <p className="text-4xl font-black text-white tracking-tight">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);

  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error('Error fetching metrics:', err));
  }, []);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!metrics || metrics.model_name === 'Unknown') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-2 border-indigo-900/40 rounded-full" />
          <div className="absolute inset-0 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading model analytics…</p>
      </div>
    );
  }

  const { accuracy, precision, recall, roc_auc, f1_score } = metrics.metrics;

  const featureData = Object.entries(metrics.feature_importance)
    .map(([key, value]) => ({ name: key, importance: Number((value * 100).toFixed(2)) }))
    .slice(0, 10);

  const [[tn, fp], [fn, tp]] = metrics.metrics.confusion_matrix;

  return (
    <div className="space-y-10 py-8 max-w-6xl mx-auto animate-fade-in-up">

      {/* ── Page header ── */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-xs font-bold mb-4 uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
          Performance Metrics
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
          Model Analytics
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          Technical dashboard for the <span className="text-white font-semibold">{metrics.model_name}</span> ensemble — discrimination metrics, feature geometry, and confusion matrix breakdown.
        </p>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="ROC-AUC"   value={`${(roc_auc   * 100).toFixed(1)}%`} accent="bg-indigo-500" />
        <KpiCard label="Accuracy"  value={`${(accuracy  * 100).toFixed(1)}%`} accent="bg-emerald-500" />
        <KpiCard label="Precision" value={`${(precision * 100).toFixed(1)}%`} accent="bg-violet-500" />
        <KpiCard label="Recall"    value={`${(recall    * 100).toFixed(1)}%`} accent="bg-sky-500" />
      </div>

      {/* ── Charts ── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* Feature importance bar chart */}
        <div className="clinical-card p-8 lg:col-span-3 bg-[#161b22]">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2 bg-indigo-900/60 border border-indigo-700/30 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Feature Importance</h3>
              <p className="text-xs text-slate-500">Top 10 predictors by GBC split gain</p>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureData} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(99,102,241,0.1)" />
                <XAxis type="number" unit="%" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(99,102,241,0.15)' }} tickLine={false} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {featureData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? '#818cf8' : i < 3 ? '#6366f1' : i < 6 ? '#4f46e5' : '#312e81'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/30">
            <p className="text-xs text-slate-500 leading-relaxed">
              <span className="text-indigo-400 font-bold">Thallium</span> (reversible defect) accounts for 53% of total split gain — by far the strongest individual predictor in the ensemble.
            </p>
          </div>
        </div>

        {/* Confusion matrix */}
        <div className="clinical-card p-8 lg:col-span-2 flex flex-col bg-[#161b22]">
          <div className="flex items-center gap-3 mb-7">
            <div className="p-2 bg-indigo-900/60 border border-indigo-700/30 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Confusion Matrix</h3>
              <p className="text-xs text-slate-500">N = {(tn + tp + fn + fp).toLocaleString()} test samples</p>
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center">
            <div className="grid grid-cols-2 gap-3 w-full">

              <div className="aspect-[5/4] rounded-2xl flex flex-col items-center justify-center p-4 bg-emerald-950/30 border border-emerald-800/40 relative overflow-hidden">
                <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-60" />
                <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-2">True Neg.</span>
                <span className="text-3xl font-black text-emerald-300">{tn.toLocaleString()}</span>
              </div>

              <div className="aspect-[5/4] rounded-2xl flex flex-col items-center justify-center p-4 bg-red-950/30 border border-red-800/40 relative overflow-hidden">
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 opacity-60" />
                <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold mb-2">False Pos.</span>
                <span className="text-3xl font-black text-red-300">{fp.toLocaleString()}</span>
              </div>

              <div className="aspect-[5/4] rounded-2xl flex flex-col items-center justify-center p-4 bg-amber-950/30 border border-amber-800/40 relative overflow-hidden">
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-amber-500 opacity-60" />
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-2">False Neg.</span>
                <span className="text-3xl font-black text-amber-300">{fn.toLocaleString()}</span>
              </div>

              <div className="aspect-[5/4] rounded-2xl flex flex-col items-center justify-center p-4 bg-indigo-950/40 border border-indigo-800/40 relative overflow-hidden">
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-60" />
                <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-2">True Pos.</span>
                <span className="text-3xl font-black text-indigo-300">{tp.toLocaleString()}</span>
              </div>

            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/30">
            <p className="text-xs text-slate-500 leading-relaxed text-center">
              F1-Score <span className="text-white font-bold">{(f1_score * 100).toFixed(1)}%</span> — high sensitivity is critical to minimise missed diagnoses in screening contexts.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
