import Link from 'next/link';

type Field = {
  name:        string;
  code:        string;
  type:        'Numeric' | 'Binary' | 'Categorical';
  description: string;
  range:       string;
  clinical:    string;
  importance:  'Very High' | 'High' | 'Moderate' | 'Low' | 'Minimal';
};

const FIELDS: Field[] = [
  {
    name: 'Age',
    code: 'age',
    type: 'Numeric',
    description: 'Patient age in full years at the time of the study.',
    range: '20 – 90 years',
    clinical: 'Age is a known independent risk factor. The risk of coronary artery disease increases progressively after 45 (men) and 55 (women).',
    importance: 'Moderate',
  },
  {
    name: 'Sex',
    code: 'sex',
    type: 'Binary',
    description: 'Patient biological sex. Male = 1, Female = 0.',
    range: '0 or 1',
    clinical: 'Males carry a higher baseline cardiovascular risk. Premenopausal women have a relative protective oestrogen effect.',
    importance: 'Moderate',
  },
  {
    name: 'Chest Pain Type',
    code: 'cp',
    type: 'Categorical',
    description: 'Type of chest pain experienced. 1 = Typical angina, 2 = Atypical angina, 3 = Non-anginal pain, 4 = Asymptomatic.',
    range: '1, 2, 3 or 4',
    clinical: 'Counter-intuitively, asymptomatic patients (cp=4) show higher disease prevalence in this dataset — a pattern linked to silent ischaemia. Typical angina (cp=1) is the textbook presentation of obstructive coronary disease.',
    importance: 'High',
  },
  {
    name: 'Resting Blood Pressure',
    code: 'trestbps',
    type: 'Numeric',
    description: 'Resting systolic blood pressure measured at hospital admission (mm Hg).',
    range: '80 – 200 mm Hg',
    clinical: 'Persistent hypertension (≥ 140 mm Hg) damages coronary endothelium and accelerates atherosclerotic plaque formation.',
    importance: 'Low',
  },
  {
    name: 'Cholesterol',
    code: 'chol',
    type: 'Numeric',
    description: 'Serum total cholesterol in mg/dl (fasting measurement).',
    range: '100 – 600 mg/dl',
    clinical: 'Elevated LDL drives subendothelial plaque deposition. Borderline risk: 200–239 mg/dl; High risk: ≥ 240 mg/dl.',
    importance: 'Low',
  },
  {
    name: 'Fasting Blood Sugar > 120 mg/dl',
    code: 'fbs',
    type: 'Binary',
    description: 'Indicates whether fasting blood glucose exceeds 120 mg/dl. True = 1, False = 0.',
    range: '0 or 1',
    clinical: 'Chronic hyperglycaemia (type 2 diabetes) triples cardiovascular mortality risk via advanced glycation end-products and chronic inflammation.',
    importance: 'Minimal',
  },
  {
    name: 'Resting ECG Results',
    code: 'restecg',
    type: 'Categorical',
    description: '0 = Normal, 1 = ST-T wave abnormality (T inversion, ST elevation/depression > 0.05 mV), 2 = Probable or definite left ventricular hypertrophy.',
    range: '0, 1 or 2',
    clinical: 'ST-T changes are direct evidence of myocardial ischaemia. LV hypertrophy indicates chronic pressure overload and is associated with greater infarct severity.',
    importance: 'Low',
  },
  {
    name: 'Maximum Heart Rate',
    code: 'thalach',
    type: 'Numeric',
    description: 'Maximum heart rate achieved during stress testing (bpm).',
    range: '60 – 220 bpm',
    clinical: 'Higher achieved HR reflects better cardiac reserve and pulmonary function. Reduced chronotropic response (failure to reach ≥ 85% of age-predicted max) is a risk marker.',
    importance: 'High',
  },
  {
    name: 'Exercise Induced Angina',
    code: 'exang',
    type: 'Binary',
    description: 'Whether angina was provoked during stress testing. Yes = 1, No = 0.',
    range: '0 or 1',
    clinical: 'Exertional chest pain signifies demand ischaemia: coronary supply cannot meet increased myocardial oxygen demands, strongly suggesting significant obstruction.',
    importance: 'High',
  },
  {
    name: 'ST Depression (Oldpeak)',
    code: 'oldpeak',
    type: 'Numeric',
    description: 'ST segment depression induced by exercise, measured relative to rest (in mm).',
    range: '0.0 – 6.2 mm',
    clinical: 'Greater depression indicates more extensive or severe ischaemia. ST depression > 2 mm during low workloads is considered a high-risk finding.',
    importance: 'High',
  },
  {
    name: 'Slope of ST Segment',
    code: 'slope',
    type: 'Categorical',
    description: 'Morphology of the peak-exercise ST segment. 1 = Upsloping, 2 = Flat (horizontal), 3 = Downsloping.',
    range: '1, 2 or 3',
    clinical: 'Flat and downsloping ST segments during exercise carry the highest diagnostic weight for obstructive ischaemia; upsloping is more benign.',
    importance: 'High',
  },
  {
    name: 'Major Vessels Colored (Fluoroscopy)',
    code: 'ca',
    type: 'Categorical',
    description: 'Number of major coronary vessels (0–3) visualised by radio-opaque contrast fluoroscopy.',
    range: '0, 1, 2 or 3',
    clinical: 'Each additional occluded vessel substantially raises the risk profile. Zero vessels coloured ("clean" coronaries) is the most favourable finding.',
    importance: 'High',
  },
  {
    name: 'Thallium Defect Type',
    code: 'thal',
    type: 'Categorical',
    description: '3 = Normal, 6 = Fixed defect (scar tissue, prior infarction), 7 = Reversible defect (viable ischaemic myocardium).',
    range: '3, 6 or 7',
    clinical: 'The single strongest predictor in the model. A reversible perfusion defect (thal = 7) indicates viable myocardium at risk; with revascularisation, these patients benefit most from intervention.',
    importance: 'Very High',
  },
];

const importanceBadge: Record<Field['importance'], string> = {
  'Very High': 'bg-red-900/40 text-red-300 border-red-700/40',
  'High':      'bg-amber-900/30 text-amber-300 border-amber-700/40',
  'Moderate':  'bg-indigo-900/40 text-indigo-300 border-indigo-700/40',
  'Low':       'bg-slate-800 text-slate-400 border-slate-700/40',
  'Minimal':   'bg-slate-900 text-slate-500 border-slate-700/20',
};

const typeBadge: Record<Field['type'], string> = {
  'Numeric':     'bg-blue-900/30 text-blue-300 border-blue-700/40',
  'Binary':      'bg-purple-900/30 text-purple-300 border-purple-700/40',
  'Categorical': 'bg-teal-900/30 text-teal-300 border-teal-700/40',
};

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8 animate-fade-in-up">

      {/* ── Header ── */}
      <div className="text-center max-w-3xl mx-auto stagger-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-xs font-bold mb-5 uppercase tracking-widest">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          Clinical Parameter Reference
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          How to use the Assessment Form
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          This guide explains each of the 13 clinical input variables, their expected value ranges, clinical significance, and relative importance to the prediction model.
        </p>
        <Link href="/predict" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5">
          Go to Assessment Form
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>

      {/* ── How it works ── */}
      <section className="clinical-card p-8 stagger-2">
        <h2 className="text-xl font-bold text-white mb-4 tracking-tight flex items-center gap-3">
          <span className="p-2 bg-indigo-900/50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
          </span>
          How the Prediction Works
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-sm text-slate-400">
          <div className="bg-[#0d1117] rounded-xl p-5 border border-white/5">
            <p className="text-indigo-300 font-bold mb-2 text-xs uppercase tracking-widest">Step 1 — Input</p>
            <p>You enter values for the 13 standardised clinical parameters observed during examination and diagnostic testing.</p>
          </div>
          <div className="bg-[#0d1117] rounded-xl p-5 border border-white/5">
            <p className="text-indigo-300 font-bold mb-2 text-xs uppercase tracking-widest">Step 2 — Inference</p>
            <p>Each feature is z-score normalised, multiplied by a calibrated weight (derived from Gradient Boosting importances), and passed through a sigmoid function.</p>
          </div>
          <div className="bg-[#0d1117] rounded-xl p-5 border border-white/5">
            <p className="text-indigo-300 font-bold mb-2 text-xs uppercase tracking-widest">Step 3 — Output</p>
            <p>The model returns a probability (0–100%), a binary prediction (disease / no disease), and a risk stratum (Low / Medium / High), all computed client-side.</p>
          </div>
        </div>
      </section>

      {/* ── Parameter table ── */}
      <section className="space-y-4 stagger-3">
        <h2 className="text-xl font-bold text-white tracking-tight">Parameter Reference</h2>

        {FIELDS.map(field => (
          <div key={field.code} className="clinical-card p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{field.name}</h3>
                <code className="text-xs text-indigo-400 font-mono bg-indigo-900/20 px-2 py-0.5 rounded mt-1 inline-block">{field.code}</code>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${typeBadge[field.type]}`}>{field.type}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${importanceBadge[field.importance]}`}>
                  {field.importance} importance
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">Description</p>
                <p className="text-slate-300 leading-relaxed">{field.description}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">Expected Range</p>
                <p className="text-slate-300 font-mono">{field.range}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">Clinical Context</p>
                <p className="text-slate-400 leading-relaxed">{field.clinical}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── Disclaimer ── */}
      <section className="rounded-2xl p-6 border border-amber-700/30 bg-amber-950/20 flex gap-4 items-start stagger-4">
        <div className="text-amber-500 mt-0.5 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-400 mb-1 uppercase tracking-wider">Limitations</h4>
          <p className="text-sm text-amber-200/60 leading-relaxed">
            The frontend inference engine is a logistic-regression proxy calibrated from the Gradient Boosting model's feature importance map, not a direct export of the scikit-learn model. Its discrimination is approximately equivalent (~88% accuracy / 0.95 AUC) but may diverge from the full ensemble on edge-case inputs. Always interpret results in conjunction with a qualified cardiologist.
          </p>
        </div>
      </section>

    </div>
  );
}
