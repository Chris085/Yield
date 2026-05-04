import React from 'react';

interface VisualSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  id: string;
  helpText?: string;
  colors?: { active: string; thumb: string; text: string };
}

export function VisualSlider({ label, value, min, max, onChange, id, helpText, colors }: VisualSliderProps) {
  const activeColor = colors?.active || 'bg-emerald-500';
  const thumbColor = colors?.thumb || 'bg-emerald-400';
  const textColor = colors?.text || 'text-emerald-400';
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full flex flex-col gap-4 p-6 bg-zinc-900 border-2 border-zinc-800 rounded-2xl">
      <div className="flex justify-between items-end">
        <div>
          <label htmlFor={id} className={`text-xl font-bold ${textColor}`}>{label}</label>
          {helpText && <p className="text-sm text-zinc-500 mt-1">{helpText}</p>}
        </div>
        <span className={`text-3xl font-black ${textColor}`}>{value}</span>
      </div>
      
      <div className="relative w-full h-12 mt-2">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-4 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${activeColor} transition-all duration-300 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div 
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${thumbColor} shadow-[0_0_15px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-300 ease-out`}
          style={{ left: `${percentage}%` }}
        >
          <div className="absolute inset-1 bg-black/20 rounded-full" />
        </div>
      </div>
      <div className="flex justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
        <span>Min {min}</span>
        <span>Max {max}</span>
      </div>
    </div>
  );
}
