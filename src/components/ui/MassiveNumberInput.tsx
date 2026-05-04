import React from 'react';

interface NumberInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  id: string;
  suffix?: string;
}

export function MassiveNumberInput({ label, value, onChange, id, suffix }: NumberInputProps) {
  return (
    <div className="flex flex-col gap-3 p-6 bg-zinc-900 border-2 border-zinc-800 rounded-2xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
      <label htmlFor={id} className="text-xl font-bold text-zinc-400 focus-within:text-emerald-400">
        {label}
      </label>
      <div className="flex items-baseline gap-2">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full bg-transparent text-5xl font-black text-white outline-none placeholder:text-zinc-700 font-mono"
        />
        {suffix && <span className="text-2xl font-bold text-zinc-600 uppercase">{suffix}</span>}
      </div>
    </div>
  );
}
