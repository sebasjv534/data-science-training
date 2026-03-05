'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { runInference, PredictionInput, InferenceResult } from '../../lib/inference';
import Select from '../../components/Select';

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-600 ml-1 mt-0.5">{hint}</p>}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-indigo-900/30" />
      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest px-2">{label}</span>
      <div className="h-px flex-1 bg-indigo-900/30" />
    </div>
  );
}

export default function PredictionPage() {
  const { register, handleSubmit, control } = useForm<PredictionInput>();
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<InferenceResult | null>(null);

  const onSubmit = (data: PredictionInput) => {
    setLoading(true);
    setResult(null);
    const nums: PredictionInput = {
      age: Number(data.age), sex: Number(data.sex), cp: Number(data.cp),
      trestbps: Number(data.trestbps), chol: Number(data.chol), fbs: Number(data.fbs),
      restecg: Number(data.restecg), thalach: Number(data.thalach), exang: Number(data.exang),
      oldpeak: Number(data.oldpeak), slope: Number(data.slope), ca: Number(data.ca),
      thal: Number(data.thal),
    };
    setTimeout(() => { setResult(runInference(nums)); setLoading(false); }, 700);
  };

  const numInp = 'w-full px-4 py-3 text-sm text-slate-100 bg-[#0d1117] border border-indigo-900/40 rounded-xl outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-700';

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-10 animate-fade-in-up">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-xs font-bold mb-5 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          Browser-Native · Zero Data Transfer
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Clinical Assessment</h1>
        <p className="text-slate-400 leading-relaxed">
          Fill in the 13 measured variables and the prediction engine runs instantly in your browser — no data leaves your device.
        </p>
        <a href="/guide" className="inline-flex items-center gap-1.5 mt-5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium group">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          What do these variables mean?
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="clinical-card bg-[#161b22] p-6 sm:p-10 space-y-8">

        {/* — Demographics — */}
        <div className="space-y-5">
          <SectionDivider label="Patient Demographics" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FieldGroup label="Age" hint="Full years, 20 – 90">
              <input type="number" {...register('age', { required: true })} className={numInp} placeholder="e.g. 55" />
            </FieldGroup>

            <FieldGroup label="Sex">
              <Controller name="sex" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onChange={v => field.onChange(v)}
                    options={[{ value: '1', label: 'Male (1)' }, { value: '0', label: 'Female (0)' }]}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup label="Resting BP" hint="mm Hg at admission">
              <input type="number" {...register('trestbps', { required: true })} className={numInp} placeholder="e.g. 130" />
            </FieldGroup>
          </div>
        </div>

        {/* — Biochemical — */}
        <div className="space-y-5">
          <SectionDivider label="Biochemical Markers" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FieldGroup label="Cholesterol" hint="Serum fasting total, mg/dl">
              <input type="number" {...register('chol', { required: true })} className={numInp} placeholder="e.g. 246" />
            </FieldGroup>

            <FieldGroup label="Fasting Blood Sugar > 120 mg/dl">
              <Controller name="fbs" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onChange={v => field.onChange(v)}
                    options={[{ value: '1', label: 'True (1)' }, { value: '0', label: 'False (0)' }]}
                  />
                )}
              />
            </FieldGroup>
          </div>
        </div>

        {/* — Clinical — */}
        <div className="space-y-5">
          <SectionDivider label="Clinical Diagnostics" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FieldGroup label="Chest Pain Type">
              <Controller name="cp" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onChange={v => field.onChange(v)}
                    options={[
                      { value: '1', label: 'Typical Angina (1)' },
                      { value: '2', label: 'Atypical Angina (2)' },
                      { value: '3', label: 'Non-anginal Pain (3)' },
                      { value: '4', label: 'Asymptomatic (4)' },
                    ]}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup label="Resting ECG">
              <Controller name="restecg" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onChange={v => field.onChange(v)}
                    options={[
                      { value: '0', label: 'Normal (0)' },
                      { value: '1', label: 'ST-T Abnormality (1)' },
                      { value: '2', label: 'LV Hypertrophy (2)' },
                    ]}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup label="Max Heart Rate" hint="Achieved during stress test">
              <input type="number" {...register('thalach', { required: true })} className={numInp} placeholder="e.g. 150" />
            </FieldGroup>

            <FieldGroup label="Exercise Induced Angina">
              <Controller name="exang" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onChange={v => field.onChange(v)}
                    options={[{ value: '1', label: 'Yes (1)' }, { value: '0', label: 'No (0)' }]}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup label="ST Depression (Oldpeak)" hint="Relative to rest, 0.0 – 6.2">
              <input type="number" step="0.1" {...register('oldpeak', { required: true })} className={numInp} placeholder="e.g. 1.0" />
            </FieldGroup>

            <FieldGroup label="Slope of ST Segment">
              <Controller name="slope" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onChange={v => field.onChange(v)}
                    options={[
                      { value: '1', label: 'Upsloping (1)' },
                      { value: '2', label: 'Flat (2)' },
                      { value: '3', label: 'Downsloping (3)' },
                    ]}
                  />
                )}
              />
            </FieldGroup>
          </div>
        </div>

        {/* — Imaging — */}
        <div className="space-y-5">
          <SectionDivider label="Imaging & Nuclear" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldGroup label="Major Vessels Colored (Fluoroscopy)" hint="0 = cleanest; 3 = most occluded">
              <Controller name="ca" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onChange={v => field.onChange(v)}
                    options={[
                      { value: '0', label: '0 vessels' },
                      { value: '1', label: '1 vessel' },
                      { value: '2', label: '2 vessels' },
                      { value: '3', label: '3 vessels' },
                    ]}
                  />
                )}
              />
            </FieldGroup>

            <FieldGroup label="Thallium Perfusion Defect" hint="Strongest predictor in the model">
              <Controller name="thal" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onChange={v => field.onChange(v)}
                    options={[
                      { value: '3', label: 'Normal (3)' },
                      { value: '6', label: 'Fixed Defect — prior MI (6)' },
                      { value: '7', label: 'Reversible Defect — ischaemia (7)' },
                    ]}
                  />
                )}
              />
            </FieldGroup>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full max-w-sm flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-base text-white transition-all ${
              loading
                ? 'bg-indigo-900/60 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Analysing…
              </>
            ) : (
              <>
                Run Clinical Prediction
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7"/></svg>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result */}
      {result && (
        <div className={`clinical-card p-8 sm:p-12 flex flex-col items-center text-center animate-fade-in-up ${
          result.prediction === 1
            ? 'border-red-700/40 bg-red-950/10 shadow-[0_0_60px_rgba(239,68,68,0.05)]'
            : 'border-emerald-700/40 bg-emerald-950/10 shadow-[0_0_60px_rgba(16,185,129,0.05)]'
        }`}>
          <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-6 ${
            result.prediction === 1
              ? 'border-red-700/50 text-red-400 bg-red-900/30'
              : 'border-emerald-700/50 text-emerald-400 bg-emerald-900/30'
          }`}>
            {result.prediction === 1 ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            )}
          </div>

          <h3 className={`text-3xl font-extrabold mb-8 tracking-tight ${result.prediction === 1 ? 'text-red-300' : 'text-emerald-300'}`}>
            {result.prediction === 1 ? 'Significant Cardiovascular Risk Detected' : 'No Significant Risk Detected'}
          </h3>

          <div className="flex flex-wrap justify-center gap-4 mb-8 w-full max-w-sm">
            <div className="flex-1 bg-[#0d1117] border border-white/5 p-6 rounded-2xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Probability</p>
              <p className="text-4xl font-black text-white">{result.probability}%</p>
            </div>
            <div className="flex-1 bg-[#0d1117] border border-white/5 p-6 rounded-2xl">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Risk Stratum</p>
              <p className={`text-3xl font-black mt-0.5 ${
                result.riskLevel === 'High' ? 'text-red-400' :
                result.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>{result.riskLevel}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-lg leading-relaxed border-t border-white/5 pt-6">
            <span className="text-slate-500 font-bold">Clinical Note —</span> Result computed client-side via a calibrated logistic inference engine. For supplementary educational use only; must not replace formal diagnostic workup.
          </p>
        </div>
      )}
    </div>
  );
}
