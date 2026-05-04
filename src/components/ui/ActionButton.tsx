import React from 'react';
import { Loader2 } from 'lucide-react';

interface ActionButtonProps {
  loading?: boolean;
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ActionButton({ loading, label, className = '', onClick, disabled }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      type="button"
      className={`w-full relative overflow-hidden group flex items-center justify-center p-6 rounded-2xl text-2xl font-black tracking-widest uppercase transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        className || 'bg-emerald-500 text-black hover:bg-emerald-400'
      }`}
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <span>{label}</span>}
    </button>
  );
}
