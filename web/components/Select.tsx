'use client';

import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options:       Option[];
  placeholder?:  string;
  value:          string;
  onChange:       (val: string) => void;
  className?:    string;
}

export default function Select({ options, placeholder = 'Select…', value, onChange, className = '' }: SelectProps) {
  const [open, setOpen]       = useState(false);
  const containerRef          = useRef<HTMLDivElement>(null);
  const selected              = options.find(o => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl border transition-all outline-none ${
          open
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-[#0d1117]'
            : 'border-indigo-900/40 bg-[#0d1117] hover:border-indigo-700/60'
        } ${selected ? 'text-slate-100' : 'text-slate-600'}`}
      >
        <span className="truncate text-sm">{selected ? selected.label : placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-2 flex-shrink-0 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl border border-indigo-900/50 bg-[#161b22] shadow-2xl shadow-black/50 overflow-hidden animate-fade-in-up">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                opt.value === value
                  ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {opt.label}
              {opt.value === value && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
